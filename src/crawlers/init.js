import schedule from 'node-schedule';
import puppeteer from 'puppeteer';
<<<<<<< HEAD
import Product from '../models/Product';

//TODO; 프로덕트 모델에 검사시점을 DATE필드 추가
//TODO; 프론트페이지 만들기
//TODO; 요청가능한 REST API만들기

/**
 * 모든 태그의 텍스트를 합쳐서 하나의 텍스트로 반환
 * @param {*} tag 최상위 부모 태그 엘리멘트
 */
const everyText = (parent) => {
    let currText = `${parent.text}`;
    Array.from(parent.children).forEach((tag) => {
        currText += everyText(tag);
    });
    return currText;
};

export const crawling = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await crawlProducts(page, '바른엔젤체어2');
};

/**
 * 바닥까지 내려가는 무한 스크롤
 */
async function autoScroll(page) {
    let [scrollY, pageY] = await page.evaluate(() => [
        window.scrollY,
        document.body.scrollHeight,
    ]);
    const innerHeight = await page.evaluate(() => window.innerHeight);
    while (scrollY + innerHeight < pageY) {
        [scrollY, pageY] = await page.evaluate(() => [
            window.scrollY,
            document.body.scrollHeight,
        ]);
        await page.evaluate(() => {
            window.scrollBy(0, 300);
        });
        await new Promise((resolve) => setTimeout(resolve, 50));
    }
}

/**
 * 인덱싱하며 네이버 쇼핑을 크롤링
 * @param {*} page
 */
async function crawlProducts(page, term) {
    let pagingIndex = 1;
    const termQuery = `query=${encodeURI(term)}`;
    const indexQuery = `pagingIndex=${pagingIndex}`;
    const sortQuery = `sort=price_asc`;

    while (true) {
        console.log('while');
        await page.goto(
            `https://search.shopping.naver.com/search/all?${termQuery}&${indexQuery}&${sortQuery}`,
        );
        // 바닥까지 스크롤링해서 모든 상품 불러오기
        await autoScroll(page);
        // 상품코드들을 묶는 코드목록 ul 엘레멘트가 없다면
        // 해당 페이지는 상품이 더 이상 없음을 의미
        const ul = await page.evaluateHandle(() => {
            return document.getElementsByClassName('list_basis');
        });
        if (!ul) break;
        // 데이터 크롤링
        await getDatas(page);
        // 다음 페이지
        pagingIndex++;
    }
    console.log('done');
}

/**
 * 제목 / 가격 / 판매처 / 썸네일url / 링크url 을 반환
 * @param {*} page
 */
async function getDatas(page) {
    const datas = await page.evaluate(() => {
        /**
         * className이 포함된 태그를 찾습니다.
         * @param {*} parent 취상위 부모 태그 엘리멘트
         * @param {*} className 찾을 className의 일부를 받습니다.
         */
        const getElementIncludeClass = (parent, className) => {
            if (parent.className.includes(className)) {
                return parent;
            }
            if (!parent.children.length) return null;
            for (let i = 0; i < parent.children.length; i++) {
                const element = getElementIncludeClass(
                    parent.children[i],
                    className,
                );
                if (element != null) {
                    return element;
                }
            }
        };
        // li tags list
        const liTags = Array.from(
            document.querySelectorAll(
                '#__next > div > div > div > div > div > ul > div > div > li',
            ),
        );
        // a tags list
        const datas = liTags.map((li) => {
            const data = {
                title: getElementIncludeClass(li, 'basicList_link').text,
                price: 0,
                mallUrl: getElementIncludeClass(li, 'basicList_link').href,
                imgUrl: '',
                mall: '',
            };
            // 가격
            const priceTxt = getElementIncludeClass(li, 'price_num__')
                .textContent;
            data.price = Number(
                priceTxt
                    .split('')
                    .filter((char) => !isNaN(char))
                    .reduce((a, b) => a + b, ''),
            );
            // 이미지 src
            data.imgUrl = getElementIncludeClass(
                li,
                'thumbnail_thumb__',
            ).children[0].src;
            // 쇼핑몰 정보
            const mallInfo = getElementIncludeClass(li, 'basicList_mall__');
            if (mallInfo.text) {
                if (mallInfo.text === '쇼핑몰별 최저가') {
                    data.mall = '카탈로그';
                } else {
                    data.mall = mallInfo.text;
                }
            } else {
                // 쇼핑몰 코드
                data.mall = mallInfo.getElementsByTagName('img')[0].alt;
            }
            return data;
        });
        return datas;
    });
    try {
        datas.forEach(({ title, price, mallUrl, imgUrl, mall }) => {
            const product = new Product({
                title,
                price,
                mall_url: mallUrl,
                img_url: imgUrl,
                mall,
            });
            product.save();
        });
    } catch (e) {
        console.log(e);
    }
}
=======
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
>>>>>>> 1528449be65435bfb6ed4b8dd96e81dbca3b2285
