import { Router } from 'express';
import {
    getDataWithTerm,
    getTerms,
    postTerms,
    getTasks,
    postCrawlWithTerm,
    getDate,
} from '../controllers/apiController';

const router = new Router();

router.get('/term', getTerms);
router.post('/term', postTerms);
router.get('/task', getTasks);
router.get('/crawl', getDataWithTerm);
router.post('/crawl', postCrawlWithTerm);
router.get('/:id/memo', postCrawlWithTerm);
router.post('/:id/memo', postCrawlWithTerm);

router.get('/date', getDate);

export default router;
