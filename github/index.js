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
query getGithubProfileData($username: String!) {
  user(login: $username) {
  contributionsCollection {
    totalCommitContributions
    totalPullRequestContributions
    totalIssueContributions
  }
  repositories(
    first: 100
    privacy: PUBLIC
    ownerAffiliations: OWNER
    isFork: false
  ) {
    nodes {
      primaryLanguage {
        name
        color
      }
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
}`;

/**
 * @param {Array} repos - List of repositories
 * @returns {Array} Top 5 programming languages by size
 */
const topLanguages = (repos) => {
  const langMap = {};
  repos.forEach(repo => {
    repo.languages.edges.forEach(edge => {
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
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GITHUB_TOKEN}`
    },
    body: JSON.stringify({
      query,
      variables: { username }
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API error: ${response.status} ${text}`);
  }

  const json = await response.json();
  if (json.errors) {
    const msg = json.errors.map(e => e.message).join(", ");
    throw new Error(`GraphQL errors: ${msg}`);
  }

  return json.data?.user || null;
}

/**
 * @param {string} username 
 * @returns {Promise<Array>} Top 5 programming languages by size  
 */
const getTopLanguages = async (username) => {
  const cachedData = cache.get(username+"languages");
  if (cachedData) {
    return cachedData;
  }
  const profileData = await fetchData(username);
  const languages = topLanguages(profileData.repositories.nodes);
  storeToCache(username+"languages", languages);
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
    return cachedData;
  }
  const profileData = await fetchData(username);
  const stats = {
    totalCommits: profileData.contributionsCollection.totalCommitContributions,
    totalPRs: profileData.contributionsCollection.totalPullRequestContributions,
    totalIssues: profileData.contributionsCollection.totalIssueContributions
  };
  storeToCache(username+"stats", stats);
  return stats;
}

export {
  getTopLanguages,
  getStats
};