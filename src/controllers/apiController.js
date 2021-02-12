import { crawling } from '../crawlers/init';
import Term from '../models/Term';
import Task from '../models/Task';
import Product from '../models/Product';
import { TaskProgress } from '../var';

export const getTerms = async (req, res) => {
    try {
        const terms = await Term.find().limit(20).sort({ _id: -1 });
        res.send({ okay: true, terms: terms.map((elem) => elem.term) });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};
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
        query: { term: termQuery, date: dateQuery },
    } = req;
    try {
        const term = await Term.findOne({ term: termQuery });
        const task = await Task.findOne({ term, created_at: dateQuery });
        const data = await Product.find({ task });
        res.send(data);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};
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
