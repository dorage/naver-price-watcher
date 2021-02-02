import { Router } from 'express';
<<<<<<< HEAD
import { getHome } from '../controllers/mainController';
=======
import { getHome, getLatest, postUpdate } from '../controllers/mainController';
>>>>>>> 1528449be65435bfb6ed4b8dd96e81dbca3b2285

const router = new Router();

router.get('/', getHome);

router.get('/get');

router.post('/update', postUpdate);

export default router;
