import { Router } from 'express';

const usersController = require('../controllers/users-controllers');

const router = Router();

router.post('/signin', usersController.signIn);

router.post('/signup', usersController.signUp);

router.post('/modify/name', usersController.changeName);

module.exports = router;
