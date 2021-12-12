import { Router } from 'express';

const logsControllers = require('../controllers/logs-controllers');

const router = Router();

router.post('/:userId/:date/:six', logsControllers.addData);

module.exports = router;
