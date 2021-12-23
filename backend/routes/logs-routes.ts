import { Router } from 'express';

const logsControllers = require('../controllers/logs-controllers');

const router = Router();

router.post('/six', logsControllers.addData);

router.get('/daily/:id/:date', logsControllers.getDaily);

router.get('/weekly/:id/:startofweek', logsControllers.getWeekly);

module.exports = router;
