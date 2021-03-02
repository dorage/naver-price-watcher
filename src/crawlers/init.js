import schedule from 'node-schedule';
import puppeteer from 'puppeteer';
import Product from '../models/Product';
import Task from '../models/Task';
import { TaskProgress } from '../var';
import { crawlProducts } from './shoppingCrawler';

//TODO; 배포하기
//TODO; [크롤링] 상품코드별로 가격추이가 가능하게 모델 구조 변경하기 (동일 코드에 모든 정보가 묶이도록)
//TODO; [프론트] 상품명 추가하는 기능만들기 (마지막)

export const crawling = async (task, term) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    try {
        await crawlProducts(page, task, term);
        task.progress = TaskProgress.done;
        await task.save();
    } catch (err) {
        console.log(err);
        task.progress = TaskProgress.error;
        await task.save();
    }
    console.log('done');
    await page.close();
    await browser.close();
};
