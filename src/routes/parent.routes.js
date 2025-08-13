import express from 'express';
import { loginParent } from '../controllers/parent/auth.parent.login.js';
import { logoutParent } from '../controllers/parent/auth.parent.logout.js';
import { refreshParent } from '../controllers/parent/auth.parent.refresh.js';
import { resetParentPassword } from '../controllers/parent/auth.parent.resetpassword.js';
import { fetchParentProfile } from '../fetchers/parent/fetch.parent.userprofile.js';
import { emailParentForgotPassword } from '../emails/parent/email.parent.forgotpassword.js';

const router = express.Router();

router.post('/login', loginParent);
router.post('/logout', logoutParent);
router.get('/refresh', refreshParent);
router.post('/reset-password', resetParentPassword);
router.get('/profile', fetchParentProfile);
router.post('/forgot-password', emailParentForgotPassword);

export default router;
