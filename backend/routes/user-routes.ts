import { Router } from 'express';

const checkAuth = require('../middleware/check-auth');
const userController = require('../controllers/user-controllers');

const router = Router();

router.post('/signup', userController.signUp);

router.post('/signin', userController.signIn);

router.patch('/confirm/email', userController.confirmEmailAddress);

router.get('/email/forgot-password/:email', userController.sendEmailForgotPassword);

router.get('/:email/:uniqueId', userController.checkForgotPasswordAuth);

router.patch('/modify/password/', userController.changePassword);

router.use(checkAuth);

router.patch('/modify/name', userController.changeName);

router.get('/compare/passwords/:id/:password', userController.comparePasswords);

router.get('/:userId', userController.refreshData);

router.post('/email/email-confirmation', userController.resendEmailConfirmation);

module.exports = router;
