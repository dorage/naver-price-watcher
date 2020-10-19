import schedule from 'node-schedule';
import puppeteer from 'puppeteer';
import Sequence from '../models/Sequence';
import Product from '../models/Product';
import Seller from '../models/Seller';

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

const crawl = async () => {
    // 새로운 시퀀스
    let newId = 0;
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
    // puppeteer 시동
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(
        'https://search.shopping.naver.com/detail/detail.nhn?nvMid=20793817845',
    );
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    // 모델 페이지 크롤링
    const checkList = await crawlModelPage(page);
    // 상품 페이지 크롤링
    for (var object of checkList) {
        console.log(object.title);
        await crawlProductPage(page, object.title);
    }
    // 검색어별 크롤링
    for (var term of terms) {
        console.log(term);
        await crawlProductPage(page, term, newSequence);
    }
    await Sequence.updateOne({ id: newId }, { processing: false });
};

schedule.scheduleJob('0 * * * *', crawl);

/// 모델 페이지를 크롤링합니다.
/// { storeName, title } 을 반환합니다.
async function crawlModelPage(page) {
    await page.waitForSelector('.mall_type._mall_nm');
    // 페이지 개수 세기
    const pagination = await getPagination(page, '#_price_list_paging');
    const checkList = [];
    // 페이지 별 크롤링
    for (var pageNum = 0; pageNum < pagination; pageNum++) {
        // 페이지 이동
        if (pageNum != 0) {
            await page.evaluate(navigateToNextModelPage, pageNum);
        }
        // 로딩 기다리기
        await page.waitForTimeout(1000);
        // contents 모으기
        const contents = await page.evaluate(getModelContents);
        const validContents = contents.filter((elem) => elem != null);
        checkList.push(...validContents);
    }
    return checkList;
}

const navigateToNextModelPage = (pageNum) => {
    // 네이버 script
    shop.detail.PriceHandler.page(pageNum + 1, '_price_list_paging');
};

const getModelContents = (el) => {
    const elements = Array.from(document.querySelectorAll('._itemSection'));
    const models = elements.map((element, index) => {
        const storeName = element.querySelector('.mall_type._mall_nm');
        const title = element.querySelector('.goods_tit');
        if (!storeName) {
            return null;
        }
        return {
            storeName: storeName.textContent,
            title: title.textContent.replace('\n', '').trim(),
        };
    });
    return models;
};

/// 상품들을 크롤링합니다.
async function crawlProductPage(page, term, sequence) {
    const url =
        'https://search.shopping.naver.com/search/all?frm=NVSHCHK&pagingIndex=1&pagingSize=80&productSet=checkout&query=TERM&sort=rel&timestamp=&viewType=list';
    const checkList = [];
    await page.goto(url.replace('TERM', encodeURI(term)));
    const pagination = await getPagination(page, '.pagination_num__-IkyP');
    // 페이지 별 크롤링
    for (var pageNum = 0; pageNum < pagination; pageNum++) {
        // 스크롤링
        await autoScroll(page);
        // 페이지 크롤링
        const contents = await page.evaluate(getProductContents);
        const validContents = contents.filter((elem) => elem != null);
        checkList.push(...validContents);
        // 마지막 페이지면 탈출
        if (pageNum + 1 == pagination) {
            break;
        }
        // 페이지 이동
        await page.evaluate(NavigateToNextProductPage, pageNum);
        // 딜레이
        await page.waitForTimeout(1000);
    }
    console.log(`length:${checkList.length}`);
    // 각 모델 생성
    const checkedUrl = [];
    for (var object of checkList) {
        if (!object) continue;
        const { storeName, title, sales_price, unit_sales, url } = object;
        // 중복된 검색결과는 패스
        if (checkedUrl.includes(url)) continue;
        checkList.push(url);
        // seller 없으면 새로운 seller 생성
        var seller = await Seller.findOne({ name: storeName });
        if (seller === null) {
            seller = new Seller({ name: storeName });
            seller.save();
        }
        const product = new Product({
            url,
            title,
            unit_sales,
            sales_price,
            sequence,
            seller,
        });
        product.save();
    }
}

const NavigateToNextProductPage = (pageNum) => {
    const paginations = document.getElementsByClassName(
        'pagination_btn_page__FuJaU',
    );
    paginations[pageNum + 1].click();
};

/// 상품 정보를 수집합니다.
/// {storeName, title, sales_price, unit_sales, url }
const getProductContents = () => {
    const elements = Array.from(
        document.querySelectorAll('.basicList_item__2XT81'),
    );
    const products = elements.map((element, index) => {
        // storename 이 없으면 기타 쇼핑몰 -> 패스
        const storeNameElement = element.querySelector(
            '.basicList_mall__sbVax',
        );
        if (storeNameElement.textContent == '') return null;
        // 타이틀에 귀뚜라미 온수매트 관련이 없으면 패스
        const validateTitle = (text) => {
            if (text.replace(' ', '').includes('귀뚜라미')) return true;
            if (text.replace(' ', '').includes('온수매트')) return true;
            return false;
        };
        const titleElement = element.querySelector('.basicList_link__1MaTN');
        if (!validateTitle(titleElement.textContent)) return null;
        // 수량이 없으면 0으로 해서 넘기기
        const infoGroupElements = Array.from(
            element.getElementsByClassName('basicList_etc__2uAYO'),
        );
        var sales_unit = 0;
        if (infoGroupElements) {
            const filteredElements = infoGroupElements.filter((elem) =>
                elem.textContent.includes('구매건수'),
            );
            if (filteredElements.length) {
                sales_unit = filteredElements[0].children[0].textContent;
            }
        }
        // 기타
        const salesPriceElement = element.querySelector('.price_num__2WUXn');
        const productUrlElement = element.querySelector(
            '.basicList_link__1MaTN',
        );
        return {
            storeName: storeNameElement.textContent,
            title: titleElement.textContent.replace('\n', '').trim(),
            sales_price: Number(
                salesPriceElement.textContent
                    .replace(',', '')
                    .replace('원', ''),
            ),
            unit_sales: Number(sales_unit),
            url: productUrlElement.href,
        };
    });
    return products;
};

/// query로 pagination 의 공통 루트를 가져와서 페이지장수를 반환해줍니다.ㄴ
async function getPagination(page, query) {
    const pagination = await page.evaluate((query) => {
        const productMenuLength = document.querySelector(query).children.length;
        return productMenuLength;
    }, query);
    return pagination;
}

/// 화면 최하단까지 오토 스크롤합니다.
/// distance로 스크롤 속도를 조정합니다.
async function autoScroll(page) {
    // https://github.com/puppeteer/puppeteer/issues/1665
    // babel 과 puppeteer 간의 호환성 문제로 아래와 같이 템플릿 문자열로 전달
    await page.evaluate(`(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 300;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    })()`);
}

// 상품페이지 긁어온다
// 페이지 리스트를 긁어서 판매처가 String인 판매처들만 검사
// (판매처 / 상품명 / 판매가 / 링크) 담기
// 상품명으로 검색 수행 -> 상세 정보들 담기

// get으로 리스트
