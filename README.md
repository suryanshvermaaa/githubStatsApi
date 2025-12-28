# GitHub Profile Stats API
This Node.js module interacts with GitHub's GraphQL API to fetch user statistics and top programming languages used in their repositories. It utilizes caching to minimize API requests and improve performance.

## Features
- Fetch total commit contributions, pull requests, issues, and repositories.
- Retrieve the top 5 programming languages used across all repositories.
- Caches responses for 6 hour to reduce API calls.

## Setup
1. Clone the repository.
2. Install dependencies using `npm install` or `pnpm install`.
3. Create a `.env` file using .env.example as a template.

## Technologies Used
- Node.js
- node-fetch
- dotenv
- node-cache
- GitHub GraphQL API

