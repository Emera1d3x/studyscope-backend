import express from 'express';
import { loginStudent } from '../controllers/student/auth.student.login.js';
import { logoutStudent } from '../controllers/student/auth.student.logout.js';
import { refreshStudent } from '../controllers/student/auth.student.refresh.js';
import { resetStudentPassword } from '../controllers/student/auth.student.resetpassword.js';
import { fetchStudentProfile } from '../fetchers/student/fetch.student.userprofile.js';
import { emailStudentForgotPassword } from '../emails/student/email.student.forgotpassword.js';

const router = express.Router();

router.post('/login', loginStudent);
router.post('/logout', logoutStudent);
router.get('/refresh', refreshStudent);
router.post('/reset-password', resetStudentPassword);
router.get('/profile', fetchStudentProfile);
router.post('/forgot-password', emailStudentForgotPassword);

export default router;
