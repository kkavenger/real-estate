import express from 'express';
import { deleteUser, test, update, getUserlisting} from '../controllers/user.controllers.js';
import { verifyToken } from '../utilies/Verifyuser.js';

const router = express.Router();

router.get('/', test);
router.post('/update/:id', verifyToken, update);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listing/:id', verifyToken, getUserlisting);

export default router;