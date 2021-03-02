import { crawling } from '../crawlers/init';
import Term from '../models/Term';
import Task from '../models/Task';
import Product from '../models/Product';
import Price from '../models/Price';
import { TaskProgress } from '../var';
import { product } from 'puppeteer';

export const getTerms = async (req, res) => {
    try {
        const terms = await Term.find().limit(20).sort({ _id: -1 });
        res.send({ okay: true, terms: terms.map((elem) => elem.term) });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};
// TODO;
export const postTerms = async (req, res) => {
    const {
        body: { term },
    } = req;
    let okay = false;
    try {
        // 이미 있는 term 인지 확인
        if (!(await Term.findOne({ term }))) {
            okay = true;
            const newTerm = new Term({ term });
            await newTerm.save();
        }
        const terms = await Term.find().limit(20).sort({ _id: -1 });
        res.send({ okay, terms: terms.map((elem) => elem.term) });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};
// TODO;
export const getTasks = async (req, res) => {
    const {
        query: { term: termQuery },
    } = req;
    try {
        console.log(termQuery);
        if (!termQuery) {
            res.send({ okay: false, message: 'query에 term 이 없음' });
            return;
        }
        const term = await Term.find({ term: termQuery });
        const tasks = await Task.find(
            { term },
            { _id: 0, progress: 1, created_at: 1 },
        );
        res.send({ okay: true, tasks });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};
export const getDataWithTerm = async (req, res) => {
    const {
        query: { term: termQuery, created_at, page },
    } = req;
    try {
        const term = await Term.findOne({ term: termQuery });
        const task = await Task.findOne({
            term,
            created_at,
            progress: TaskProgress.done,
        });
        const tasks = await Task.find({
            term,
            progress: TaskProgress.done,
        }).limit(5);
        const products = await Product.find({ task })
            .limit(40)
            .skip(!page ? 0 : page * 20);

        const response = [];
        for (const product of products) {
            const prices = [];
            for (const task of tasks) {
                const price = await Price.findOne(
                    { task, product },
                    { _id: 0, price: 1 },
                );
                prices.push(price?.price || null);
            }
            const {
                title,
                mall_url,
                product_id,
                img_url,
                mall,
                memo,
                onTracking,
            } = product;
            const obj = {
                title,
                mall_url,
                product_id,
                img_url,
                mall,
                memo,
                onTracking,
                prices,
            };
            response.push(obj);
        }
        res.send(response);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};
// TODO;
export const postCrawlWithTerm = async (req, res) => {
    const {
        query: { term: termQuery },
    } = req;
    try {
        console.log(termQuery);
        const term = await Term.findOne({ term: termQuery });
        // 저장된 term 이 없다면
        // 종료
        if (!term) {
            res.send({ okay: false, value: '저장된 term 이 없음' });
            return;
        }
        // 태스크 생성
        const task = new Task({
            term,
            progress: TaskProgress.pending,
            created_at: Date.now(),
        });
        await task.save();
        crawling(task, termQuery);
        res.send({ okay: true });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};

export const getDate = async (req, res) => {};
