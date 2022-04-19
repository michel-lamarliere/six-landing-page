import { Router } from 'express';

const checkAuth = require('../middleware/check-auth');
const goalsControllers = require('../controllers/goals-controllers');

const router = Router();

router.use(checkAuth);

router.get('/get/:id/:task', goalsControllers.getGoals);

router.post('/edit', goalsControllers.editGoals);

module.exports = router;
