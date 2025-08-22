import express from 'express';
import { signupParent } from '../controllers/parent/auth.parent.signup.js';
import { loginParent } from '../controllers/parent/auth.parent.login.js';
import { logoutParent } from '../controllers/parent/auth.parent.logout.js';
import { refreshParent } from '../controllers/parent/auth.parent.refresh.js';
import { verifyParentEmail } from '../controllers/parent/auth.parent.verifyemail.js';
import { forgotParentPassword } from '../controllers/parent/auth.parent.forgotpassword.js';
import { resetParentPassword } from '../controllers/parent/auth.parent.resetpassword.js';
import { fetchParentProfile } from '../fetchers/parent/fetch.parent.userprofile.js';

const router = express.Router();

router.post('/signup', signupParent);
router.post('/login', loginParent);
router.post('/logout', logoutParent);
router.get('/refresh', refreshParent);
router.get('/forgot-password', forgotParentPassword);
router.get('/reset-password', resetParentPassword);
router.get('/verify', verifyParentEmail);
router.get('/profile', fetchParentProfile);


export default router;
