import { Router } from "express";
import {  postChatStream } from "../controllers/chat.controller.js";

const router = Router();


router.post("/chat/stream", postChatStream);

export default router;
