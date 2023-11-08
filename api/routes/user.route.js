import express from 'express';
import { test, update } from '../controllers/user.controllers.js';
import { verifyToken } from '../utilies/Verifyuser.js';

const router = express.Router();

router.get('/', test);
router.post('/update/:id', verifyToken, update);

export default router;