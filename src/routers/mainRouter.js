import { Router } from 'express';
import { getHome, getLatest, postUpdate } from '../controllers/mainController';

const router = new Router();

router.get('/', getHome);

router.get('/latest', getLatest);
router.get('/lastweek');

router.post('/update', postUpdate);

export default router;
