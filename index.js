/**
 * Main entry point of the application this will ignored for serverless deployment on vercel
 */
import app from './app.js';
// start the server
const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`);
});