import Product from '../models/Product';
import Seller from '../models/Seller';
import { getPagination } from './common';

const baseUrl = 'https://search.shopping.naver.com/search/all?frm=NVSHCHK&pagingIndex=1&pagingSize=80&productSet=checkout&query=TERM&sort=rel&timestamp=&viewType=list';

/// 상품들을 크롤링합니다.
export async function crawlProductPage (page, term, sequence, checkDuplication) {
    const contentsList = [];
    await page.goto(baseUrl.replace('TERM', encodeURI(term)));
    const pageCount = await getPagination(page, '.pagination_num__-IkyP');
    // 페이지 별 크롤링
    for (var pageIndex = 0; pageIndex < pageCount; pageIndex++) {
        // 스크롤링
        await autoScroll(page);
        // contents 모으기
        const contents = await page.evaluate(getContents);
        contents.forEach((elem) => {
            if (elem === null) return;
            const { storeName, title } = elem;
            // 중복 체크로 체크하기
            const compressedTitle = title.replace(/ /g, 'i');
            if (Object.keys(checkDuplication).includes(storeName)) {
                if (checkDuplication[storeName].includes(compressedTitle)) {
                    return;
                }
                checkDuplication[storeName].push(compressedTitle);
            }
            if (checkDuplication[storeName] === undefined) {
                checkDuplication[storeName] = [compressedTitle];
            }
            contentsList.push(elem);
        });
        // 마지막 페이지 탈출
        if (pageIndex + 1 == pageCount) {
            break;
        }
        // 페이지 이동
        await page.evaluate(navgiateToNextPage, pageIndex);
        // 딜레이
        await page.waitForTimeout(1000);
    }
    console.log('Crawling Done!');
    createModels(sequence, contentsList);
}

/// 크롤링한 콘텐츠를 DB에 도큐먼트로 생성합니다.
const createModels = async (sequence, contentsList) => {
    // 각 모델 생성
    for (var object of contentsList) {
        if (!object) continue;
        const { storeName, title, sales_price, unit_sales, url } = object;
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

/// 네비게이션
const navgiateToNextPage = (pageNum) => {
    const paginations = document.getElementsByClassName(
        'pagination_btn_page__FuJaU',
    );
    paginations[pageNum + 1].click();
};

/// 상품 정보를 수집합니다.
/// {storeName, title, sales_price, unit_sales, url }
const getContents = () => {
    const elements = Array.from(
        document.querySelectorAll('.basicList_item__2XT81'),
    );
    const products = elements.map((element, index) => {
        // storename 이 없으면 기타 쇼핑몰 / 패스
        const storeNameElement = element.querySelector(
            '.basicList_mall__sbVax',
        );
        if (storeNameElement.textContent == '') return null; 
        const storeName = storeNameElement.textContent;
        // url이 이미 스크래핑한 url이면 패스
        const productUrlElement = element.querySelector(
            '.basicList_link__1MaTN',
        );
        const url = productUrlElement.href;
        // title에 귀뚜라미 온수매트 관련이 없으면 패스
        const validateTitle = (text) => {
            if (text.replace(' ', '').includes('귀뚜라미')) return true;
            if (text.replace(' ', '').includes('온수매트')) return true;
            return false;
        };
        const titleElement = element.querySelector('.basicList_link__1MaTN');
        if (!validateTitle(titleElement.textContent)) return null;
        const title = titleElement.textContent.replace('\n', '').trim();
        // 수량이 없으면 0으로 해서 넘기기
        const infoGroupElements = Array.from(
            element.getElementsByClassName('basicList_etc__2uAYO'),
        );
        var unitSales = 0;
        if (infoGroupElements) {
            const filteredElements = infoGroupElements.filter((elem) =>
                elem.textContent.includes('구매건수'),
            );
            if (filteredElements.length) {
                unitSales = Number(filteredElements[0].children[0].textContent);
            }
        }
        // 기타
        const salesPriceElement = element.querySelector('.price_num__2WUXn');
        const salesPrice = Number(
            salesPriceElement.textContent
                .replace(',', '')
                .replace('원', ''),
        );
        return {
            storeName:storeName,
            title:title,
            sales_price:salesPrice,
            unit_sales:unitSales,
            url:url,
        };
    });
    return products;
};

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
