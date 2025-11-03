import express from 'express';
import { register, login, signOut, refreshToken } from '../controllers/authenController.js';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post("/signout", signOut);

router.get("/refresh", refreshToken);

export default router;