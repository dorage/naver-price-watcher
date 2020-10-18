import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(
        'https://search.shopping.naver.com/detail/detail.nhn?nvMid=20793817845',
    );
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    // 모델 페이지
    /*
    for (const term of checkList) {
        await page.goto(url.replace('TERM', encodeURI(term.title)));
        await autoScroll(page);
    }
    */
})();

/// 모델 페이지를 크롤링합니다.
async function crawlModelPage(page) {
    await page.waitForSelector('.mall_type._mall_nm');
    // 페이지 개수 세기
    const pages = await getPagination(page, '#_price_list_paging');
    const checkList = [];
    // pagination & crawl
    for (var pageNum = 0; pageNum < pages; pageNum++) {
        // 페이지 이동
        if (pageNum != 0) {
            await page.evaluate((pageNum) => {
                // 네이버 script
                shop.detail.PriceHandler.page(
                    pageNum + 1,
                    '_price_list_paging',
                );
            }, pageNum);
        }
        await page.waitForTimeout(1000);
        // contents 모으기
        const contents = await page.evaluate((el) => {
            const elements = Array.from(
                document.querySelectorAll('._itemSection'),
            );
            const malls = elements.map((element, index) => {
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
            return malls;
        });
        const validContents = contents.filter((elem) => elem != null);
        checkList.push(...validContents);
    }
}

/// 상품들을 크롤링합니다.
async function crawlProductPage(page) {
    const url =
        'https://search.shopping.naver.com/search/all?frm=NVSHCHK&pagingIndex=1&pagingSize=80&productSet=checkout&query=TERM&sort=rel&timestamp=&viewType=list';
    const testUrl =
        'https://search.shopping.naver.com/search/all?query=(%EC%A3%BC)Moashop%20%EA%B7%80%EB%9A%9C%EB%9D%BC%EB%AF%B8%20%EC%98%A8%EC%88%98%EB%A7%A4%ED%8A%B8%20KRM-651%20%EC%8A%AC%EB%A6%BC%EC%8B%B1%EA%B8%80&frm=NVSHATC&prevQuery=%EA%B7%80%EB%9A%9C%EB%9D%BC%EB%AF%B8%20%EC%98%A8%EC%88%98%EB%A7%A4%ED%8A%B8';
    const checkList = [];
    //await page.goto(url.replace('TERM', encodeURI(checkList[0].title)));
    await page.goto(testUrl);
    const pageNumOfProducts = await getPagination(
        page,
        '.pagination_num__-IkyP',
    );
    for (var pageNum = 0; pageNum < pageNumOfProducts; pageNum++) {
        // 스크롤링
        await autoScroll(page);
        // 페이지 크롤링
        const contents = await page.evaluate((el) => {
            const elements = Array.from(
                document.querySelectorAll('.basicList_item__2XT81'),
            );
            const products = elements.map((element, index) => {
                // storename 이 없으면 기타 쇼핑몰 -> 패스
                const storeNameElement = element.querySelector(
                    '.basicList_mall__sbVax',
                );
                if (storeNameElement.textContent == '') {
                    return null;
                }
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
                        sales_unit =
                            filteredElements[0].children[0].textContent;
                    }
                }
                // 기타
                const titleElement = element.querySelector(
                    '.basicList_link__1MaTN',
                );
                const salesPriceElement = element.querySelector(
                    '.price_num__2WUXn',
                );
                const productUrlElement = element.querySelector(
                    '.basicList_link__1MaTN',
                );
                return {
                    storeName: storeNameElement.textContent,
                    title: titleElement.textContent.replace('\n', '').trim(),
                    sales_price: salesPriceElement.textContent,
                    unit_sales: sales_unit,
                    product_url: productUrlElement.href,
                };
            });
            console.log(products);
            return products;
        });
        const validContents = contents.filter((elem) => elem != null);
        checkList.push(...validContents);
        console.log(checkList);
        if (pageNum + 1 == pageNumOfProducts) {
            break;
        }
        // 페이지 이동
        await page.evaluate((pageNum) => {
            const paginations = document.getElementsByClassName(
                'pagination_btn_page__FuJaU',
            );
            paginations[pageNum + 1].click();
        }, pageNum);
        await page.waitForTimeout(1000);
    }
}

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
