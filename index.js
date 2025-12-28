/**
 * @file index.js
 * @description Entry point of the GitHub API server application.
 */
import express from "expresspro";
import router from "./routes/index.js";
const app=express();

// middleware to parse JSON requests
app.use(express.json()).use(express.cors());

// routes
app.use("/",router);

// error handling middleware
app.use(express.error)

// start the server
const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`);
});