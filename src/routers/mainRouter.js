import { Router } from 'express';
import { getHome, getTest } from '../controllers/mainController';

const router = new Router();

router.get('/', getHome);
router.get('/test', getTest);

export default router;
