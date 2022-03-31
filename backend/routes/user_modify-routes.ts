import { Router } from 'express';

const checkAuth = require('../middleware/check-auth');
const userModifyControllers = require('../controllers/user_modify-controllers');

const router = Router();

router.get('/check-email/:email', userModifyControllers.checkEmail)

router.get(
	'/email/forgot-password/:email',
	userModifyControllers.sendEmailForgotPassword
);

router.get('/:email/:uniqueId', userModifyControllers.checkForgotPasswordAuth);

router.patch('/modify/password/', userModifyControllers.changePassword);

router.use(checkAuth);

router.patch('/modify/name', userModifyControllers.changeName);

router.patch('/modify/email', userModifyControllers.changeEmail);

router.get('/compare/passwords/:id/:password', userModifyControllers.comparePasswords);

module.exports = router;
