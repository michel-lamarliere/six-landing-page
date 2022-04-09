import { Router } from 'express';

const checkAuth = require('../middleware/check-auth');
const contactControllers = require('../controllers/contact-controllers');

const router = Router();

router.use(checkAuth);

router.post('/message', contactControllers.sendMessage);

module.exports = router;
