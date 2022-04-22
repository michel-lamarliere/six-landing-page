import { Router } from 'express';

const checkAuth = require('../middleware/check-auth');
const userControllers = require('../controllers/user-controllers');

const router = Router();

router.post('/sign-up', userControllers.signUp);

router.post('/sign-in', userControllers.signIn);

router.patch('/email-confirmation/confirm', userControllers.confirmEmailAddress);

router.use(checkAuth);

router.get('/refresh-data/:userId', userControllers.refreshData);

router.post('/email-confirmation/send-email', userControllers.resendEmailConfirmation);

module.exports = router;
