import express from "expresspro";
import { getStats, getTopLanguages } from "../github/index.js";
import {languagesCard} from "../cards/languages.js";
import { statsCard } from "../cards/stats.js";
import { skillsCard } from "../cards/skills.js";

/**
 * @route GET /ping
 * @desc Health check endpoint
 * @access Public
 */
export const pingController = express.asyncHandler((req,res)=>{
  express.resp(res,200,{message:"pong"});
});

/**
 * @route GET /error
 * @desc Endpoint to test error handling
 * @access Public
 */
export const errorController = express.asyncHandler((req,res)=>{
  throw new express.AppError("This is a custom error message",400);
});

/**
 * @route GET /languages
 * @desc Fetch top programming languages for a GitHub user
 * @access Public
 */
export const languagesController = express.asyncHandler(async (req, res) => {
  const { username } = req.query;
  const languages = await getTopLanguages(username);
  const SVG = languagesCard(languages);
  res.set("Content-Type", "image/svg+xml");
  res.send(SVG);
});

/**
 * @route GET /stats
 * @desc Fetch GitHub statistics for a user
 * @access Public
 */
export const statsController = express.asyncHandler(async (req, res) => {
  const { username } = req.query;
  const stats = await getStats(username);
  const SVG = statsCard({commits: stats.totalCommits, prs: stats.totalPRs, issues: stats.totalIssues});
  res.set("Content-Type", "image/svg+xml");
  res.send(SVG);
});

/**
 * @route GET /skills
 * @desc Fetch skills card for a user
 * @access Public
 */
export const skillsController = express.asyncHandler(async (req, res) => {
  const { skills } = req.query; // skills saparated by commas
  const skillsArray = skills ? skills.split(",").map(s => s.trim()) : [];
  const SVG = skillsCard(skillsArray);
  res.set("Content-Type", "image/svg+xml");
  res.send(SVG);
});