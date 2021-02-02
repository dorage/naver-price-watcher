import puppeteer from 'puppeteer';
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
