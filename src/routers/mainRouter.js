import { Router } from 'express';
import { getHome } from '../controllers/mainController';

const router = new Router();

router.get('/', getHome);

router.get('/lastweek');

export default router;
