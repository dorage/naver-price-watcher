import schedule from 'node-schedule';
import puppeteer from 'puppeteer';
import Sequence from '../models/Sequence';
import { crawlModelPage } from './modelCrawler';
import { crawlProductPage } from './productCrawler';

const pages = [
    // krm-65
    'https://search.shopping.naver.com/detail/detail.nhn?nvMid=20793817845&query=%EA%B7%80%EB%9A%9C%EB%9D%BC%EB%AF%B8%20%EC%98%A8%EC%88%98%EB%A7%A4%ED%8A%B8&NaPm=ct%3Dkgfb08pk%7Cci%3D22b7f5bec76c03ea6b8bdc78878d643c2dc480a8%7Ctr%3Dslsl%7Csn%3D95694%7Chk%3Dd8b0149fb7ef7b90860b58fc5fcced02d76fffea',
    // krm-63
    'https://search.shopping.naver.com/detail/detail.nhn?nvMid=20794585904&query=%EA%B7%80%EB%9A%9C%EB%9D%BC%EB%AF%B8%20%EC%98%A8%EC%88%98%EB%A7%A4%ED%8A%B8&NaPm=ct%3Dkgfb09hc%7Cci%3D510c5875fdb6e19eee0ae33536433ae01922d757%7Ctr%3Dslsl%7Csn%3D95694%7Chk%3D9ede74e27bfeeebc70abba37ec656178c06fbec2',
    // em-87
    'https://search.shopping.naver.com/detail/detail.nhn?nvMid=20794885913&query=em-87&NaPm=ct%3Dkgfb3dd4%7Cci%3Db684ef33b6b8a4339ca1ca4625362ac69516fc1b%7Ctr%3Dslsl%7Csn%3D95694%7Chk%3D7b4687fc52801d7764c6b948cf80f7b2101d5c95',
    // em-321
    'https://search.shopping.naver.com/detail/detail.nhn?nvMid=15321359098&query=%EA%B7%80%EB%9A%9C%EB%9D%BC%EB%AF%B8%20%EC%98%A8%EC%88%98%EB%A7%A4%ED%8A%B8&NaPm=ct%3Dkgfb0iqo%7Cci%3D9601a294253a72cd0c01b84d8f89b05cad2cd844%7Ctr%3Dslsl%7Csn%3D95694%7Chk%3D00c8c261e9b2171afe47dd2783fd63bd1233aa9d',
];
// 검색어
/*
const terms = [
    'krm-653',
    'krm-652',
    'krm-651',
    'krm-632',
    'krm-631',
    'em-873',
    'em-871',
    'em-322',
    'em-321',
];
*/
const terms = ['귀뚜라미 온수매트']

// 새로운 sequence를 생성합니다.
const createSequence = async () => {
    let newId = 0;
    try {
        if (await Sequence.countDocuments()) {
            const prevSequence = await Sequence.findOne({}).sort({ _id: -1 });
            newId = prevSequence.id + 1;
        }
        const newSequence = new Sequence({
            id: newId,
            created_at: Date.now(),
            processing: true,
        });
        newSequence.save();
        return newSequence;
    } catch (err) {
        console.log(err);
    }
}
const initPuppeteer = async () => { 
    // puppeteer 시동
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    return page;
};

export const crawl = async () => {
    const sequence = await createSequence();
    try {
        // puppeteer 초기화
        const page = await initPuppeteer();
        // 모델 페이지 크롤링
        const titles = await crawlModelPage(page);
        // 상품페이지
        const checkDuplication = {};
        const searchTargets = [titles, terms];
        for (var searchTarget of searchTargets) {
            for (var searchTerm of searchTarget) {
                console.log(title);
                await crawlProductPage(page, searchTerm, sequence, checkDuplication);
            }
        }
        // 시퀸스 완료 업데이트
        await Sequence.updateOne({ id: sequence.id }, { processing: false });
        console.log('everyjob is done!');
    } catch (err) {
        console.log(err);
        await Sequence.deleteOne({id:sequence.id});
    }
};