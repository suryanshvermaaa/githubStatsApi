/**
 * @file github/index.js
 * @description Module to interact with GitHub's GraphQL API to fetch user statistics and top programming languages.
 */
import fetch from "node-fetch";
import "dotenv/config";
import NodeCache from "node-cache";
const GITHUB_TOKEN = process.env.GITHUB_API_TOKEN;
const DEFAULT_USERNAME = process.env.GITHUB_USERNAME || process.env.USERNAME;
const cache = new NodeCache({ stdTTL: 60 * 60 * 6 });  // Cache for 6 hours

/**
 * @description GraphQL query to fetch GitHub profile data
 */
const query = `#graphql
query getTopReposWithLanguages($username: String!, $after: String) {
  user(login: $username) {
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
    }
    repositories(
      first: 100
      after: $after
      privacy: PUBLIC
      ownerAffiliations: OWNER
      isFork: false
      orderBy: { field: STARGAZERS, direction: DESC }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        name
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
  }
}
`

/**
 * @param {Array} repos - List of repositories
 * @returns {Array} Top 5 programming languages by size
 */
const topLanguages = (repos) => {
  const langMap = {};
  repos.forEach(repo => {
    const edges = repo.languages?.edges || [];
    edges.forEach(edge => {
      const { name } = edge.node;
      if (langMap[name]) {
        langMap[name] += edge.size;
      } else {
        langMap[name] = edge.size;
      }
    });
  });
  const sortedLangs = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, size]) => ({ name, size }));
  return sortedLangs;
}

/**
 * @param {string} username
 * @param {string} data 
 */
const storeToCache = (username, data) => {
  cache.set(username, data);
};

/**
 * @param {string} customUsername 
 * @returns {Promise<Object>} GitHub user data
 */
async function fetchData(customUsername) {
  const username = customUsername || DEFAULT_USERNAME;
  const repos=[];
  let stats=null;
  const QUERY = query;
  let cursor = null;
  while (true) {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { username, after: cursor },
      }),
    });
    const json = await res.json();
    if (json.errors) {
      console.error(json.errors);
      throw new Error("GitHub API error");
    }
    const user = json?.data?.user;
    if (!user) {
      throw new Error(`GitHub user not found or missing data for username: ${username}`);
    }
    repos.push(...user.repositories.nodes);
    if(!stats) stats = user.contributionsCollection;
    if (!user.repositories.pageInfo.hasNextPage) {
      break;
    }
    cursor = user.repositories.pageInfo.endCursor;
  }
  return {repos:repos,stats:stats};
}

/**
 * @param {string} username 
 * @returns {Promise<Array>} Top 5 programming languages by size  
 */
const getTopLanguages = async (username) => {
  const cachedData = cache.get(username+"languages");
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  const profileData = await fetchData(username);
  const languages = topLanguages(profileData.repos || []);
  const s = profileData?.stats;
  if (!s) {
    throw new Error("Missing contributions stats in GitHub response");
  }
  const stats = {
    totalCommits: s.totalCommitContributions,
    totalPRs: s.totalPullRequestContributions,
    totalIssues: s.totalIssueContributions
  };
  storeToCache(username+"stats", JSON.stringify(stats));
  storeToCache(username+"languages", JSON.stringify(languages));
  return languages;
};

/**
 * 
 * @param {string} username 
 * @returns {Promise<Object>} GitHub user statistics
 */
const getStats = async (username) => {
  const cachedData = cache.get(username+"stats");
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  const profileData = await fetchData(username);
  const s = profileData?.stats;
  if (!s) {
    throw new Error("Missing contributions stats in GitHub response");
  }
  const stats = {
    totalCommits: s.totalCommitContributions,
    totalPRs: s.totalPullRequestContributions,
    totalIssues: s.totalIssueContributions
  };
  storeToCache(username+"stats", JSON.stringify(stats));
  const languages = topLanguages(profileData.repos);
  storeToCache(username+"languages", JSON.stringify(languages));
  return stats;
}

export {
  getTopLanguages,
  getStats
};