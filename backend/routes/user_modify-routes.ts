import { Router } from 'express';

const checkAuth = require('../middleware/check-auth');
const userModifyControllers = require('../controllers/user_modify-controllers');

const router = Router();

router.get(
	'/email/forgot-password/:email',
	userModifyControllers.sendEmailForgotPassword
);

router.get('/:email/:uniqueId', userModifyControllers.checkForgotPasswordAuth);

router.patch('/email/confirmation', userModifyControllers.changeEmailConfirmation);

router.patch('/password/', userModifyControllers.changePassword);

router.delete('/delete-account/confirmation', userModifyControllers.deleteAccountConfirm);

router.use(checkAuth);

router.patch('/name', userModifyControllers.changeName);

router.patch('/image', userModifyControllers.changeImage);

router.patch('/email', userModifyControllers.changeEmail);

router.patch('/delete-account', userModifyControllers.deleteAccountEmail);

module.exports = router;
