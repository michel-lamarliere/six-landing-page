import { Router } from 'express';

const checkAuth = require('../middleware/check-auth');
const userController = require('../controllers/user-controllers');

const router = Router();

router.post('/signup', userController.signUp);

router.post('/signin', userController.signIn);

router.use(checkAuth);

router.patch('/modify/name', userController.changeName);

router.get('/compare/passwords/:id/:password', userController.comparePasswords);

router.patch('/modify/password/', userController.changePassword);

module.exports = router;
