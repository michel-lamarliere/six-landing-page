import { Router } from 'express';

const logsControllers = require('../controllers/logs-controllers');

const router = Router();

router.get('/weekly', logsControllers.getWeekly);

router.post('/six', logsControllers.addData);

module.exports = router;
