import { Router } from 'express';

const router = new Router();

router.get('/term', (req, res) => {
    const { term } = req.params;
});

export default router;
