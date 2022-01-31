import { Router } from 'express';

const checkAuth = require('../middleware/check-auth');
const graphsControllers = require('../controllers/graphs-controllers');

const router = Router();

router.use(checkAuth);

router.get('/annual/:id/:year/:task', graphsControllers.getAnnual);

module.exports = router;
