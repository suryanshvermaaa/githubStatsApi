/**
 * @file routes/index.js
 * @description Defines the API routes and maps them to their respective controllers.
 */

import { Router } from "expresspro";
import {pingController,errorController,languagesController,statsController} from "../controllers/index.js";

const router = Router();

router.get("/ping", pingController);
router.get("/error", errorController);
router.get("/languages", languagesController);
router.get("/stats", statsController);

export default router();