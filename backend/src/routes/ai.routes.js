import {Router} from 'express';import {requireAuth} from '../middleware/auth.js';import {chat,breakdown,suggestions} from '../controllers/ai.controller.js';
const router=Router();router.use(requireAuth);router.post('/chat',chat);router.post('/breakdown',breakdown);router.post('/suggestions',suggestions);export default router;
