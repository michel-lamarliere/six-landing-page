import { Router } from 'express';

const logsControllers = require('../controllers/logs-controllers');

const router = Router();

router.post('/six', logsControllers.addData);

router.get('/:id/:startofweek/weekly', logsControllers.getWeekly);

module.exports = router;
