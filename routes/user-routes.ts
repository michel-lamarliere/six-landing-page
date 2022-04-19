import { Router } from 'express';

const checkAuth = require('../middleware/check-auth');
const userControllers = require('../controllers/user-controllers');

const router = Router();

router.post('/sign-up', userControllers.signUp);

router.post('/sign-in', userControllers.signIn);

router.patch('/confirm/email', userControllers.confirmEmailAddress);

router.use(checkAuth);

router.get('/:userId', userControllers.refreshData);

router.post('/email/email-confirmation', userControllers.resendEmailConfirmation);

module.exports = router;
