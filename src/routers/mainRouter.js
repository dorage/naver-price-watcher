import { Router } from 'express';
import { getHome, getLatest } from '../controllers/mainController';

const router = new Router();

router.get('/', getHome);

router.get('/latest', getLatest);
router.get('/lastweek');

export default router;
