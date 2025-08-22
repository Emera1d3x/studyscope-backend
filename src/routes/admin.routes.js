import express from 'express';
import { loginAdmin } from '../controllers/admin/auth.admin.login.js';
import { logoutAdmin } from '../controllers/admin/auth.admin.logout.js';
const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);


export default router;
