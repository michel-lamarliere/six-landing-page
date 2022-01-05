import { Router } from 'express';

const logsControllers = require('../controllers/logs-controllers');

const router = Router();

router.post('/task', logsControllers.addData);

router.get('/daily/:id/:date', logsControllers.getDaily);

router.get('/weekly/:id/:startofweek', logsControllers.getWeekly);

router.get('/monthly/:id/:date/:task', logsControllers.getMonthly);

module.exports = router;
