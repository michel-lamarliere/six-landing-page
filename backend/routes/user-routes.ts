import { Router } from 'express';

const userController = require('../controllers/user-controllers');

const router = Router();

router.post('/signin', userController.signIn);

router.post('/signup', userController.signUp);

router.post('/modify/name', userController.changeName);

router.get('/compare/passwords/:id/:password', userController.comparePasswords);

router.post('/modify/password/', userController.changePassword);

module.exports = router;
