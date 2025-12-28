import express from "expresspro";
import { getStats, getTopLanguages } from "./github/index.js";

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
  const profile = await getTopLanguages(username);
  express.resp(res, 200, { message: "fetched data successfully", data: profile });
});

/**
 * @route GET /stats
 * @desc Fetch GitHub statistics for a user
 * @access Public
 */
export const statsController = express.asyncHandler(async (req, res) => {
  const { username } = req.query;
  const profile = await getStats(username);
  express.resp(res, 200, { message: "fetched data successfully", data: profile });
});
