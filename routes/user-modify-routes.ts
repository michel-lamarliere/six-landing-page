import { Router } from 'express';

const checkAuth = require('../middleware/check-auth');
const userModifyControllers = require('../controllers/user-modify-controllers');

const router = Router();

router.get('/forgot-password/:email', userModifyControllers.sendEmailForgotPassword);

router.get(
	'/forgot-password/confirmation/:email/:uniqueId',
	userModifyControllers.checkForgotPasswordAuth
);

router.patch('/forgot-password/modify', userModifyControllers.changeForgottenPassword);

router.patch('/email/confirmation', userModifyControllers.changeEmailConfirmation);

router.patch('/password', userModifyControllers.changePassword);

router.delete('/delete-account/confirmation', userModifyControllers.deleteAccountConfirm);

router.use(checkAuth);

router.patch('/name', userModifyControllers.changeName);

router.patch('/image', userModifyControllers.changeImage);

router.patch('/email', userModifyControllers.changeEmail);

router.patch('/delete-account', userModifyControllers.deleteAccountEmail);

module.exports = router;
