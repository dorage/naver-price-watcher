import { Router } from 'express';

const router = new Router();

router.get('/', getHome);

export default router;
