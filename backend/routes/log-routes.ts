import { Router } from 'express';

const logControllers = require('../controllers/log-controllers');

const router = Router();

router.post('/task', logControllers.addData);

router.get('/daily/:id/:date', logControllers.getDaily);

router.get('/weekly/:id/:startofweek', logControllers.getWeekly);

router.get('/monthly/:id/:date/:task', logControllers.getMonthly);

module.exports = router;
