import { getProductCode } from './mallCrawler';

/**
 * 인덱싱하며 네이버 쇼핑을 크롤링
 * @param {*} page
 */
export async function crawlProducts(page, task, term) {
    let pagingIndex = 1;
    const termQuery = `query=${encodeURI(term)}`;
    const indexQuery = `pagingIndex`;
    const sortQuery = `sort=price_asc`;
    while (true) {
        await page.goto(
            `https://search.shopping.naver.com/search/all?${termQuery}&${indexQuery}=${pagingIndex}&${sortQuery}`,
        );
        // 추천 낮은 가격순이 있으면 해당기능 끄기
        await turnOffRecommendation(page);
        // 바닥까지 스크롤링해서 모든 상품 불러오기
        await autoScroll(page);
        // 상품코드들을 묶는 코드목록 ul 엘레멘트가 없다면
        // 해당 페이지는 상품이 더 이상 없음을 의미
        const ul = await page.evaluateHandle(() => {
            return (
                document.getElementsByClassName('list_basis')[0] !== undefined
            );
        });
        if (!ul._remoteObject.value) break;
        {
            // 현재 페이지 크롤링
            const datas = await getDatas(page, task);
            await makeModel(page, datas);
        }
        // 다음 페이지
        pagingIndex++;
    }
    console.log('done');
}

/**
 * 크롤링한 데이터를 DB에 저장합니다.
 * @param {*} datas
 */
async function makeModel(page, datas) {
    for (const [title, price, mallUrl, imgUrl, mall] of datas) {
        // 몰 접속해서 상품코드 받아오기
        const productId = await getProductCode(page, mall, mallUrl);
        // 이미 등록된 상품인지 확인하고 등록되지 않았으면 생성하기
        // 이미 등록된 상품이면 새로운 가격 모델만 생성하고 저장
        // 카탈로그 는 기본적으로 추적을 꺼버리기
    }
}

/**
 * 추천 낮은 가격순 기능을 끕니다.
 * @param {*} page
 */
export async function turnOffRecommendation(page) {
    await page.evaluate(() => {
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
        const radio = getElementIncludeClass(
            document.body,
            'subFilter_btn_radio__',
        );
        if (!radio || radio.text === 'OFF') return;
        radio.click();
    });
}

/**
 * 제목 / 가격 / 판매처 / 썸네일url / 링크url 을 반환
 * @param {*} page
 */
export async function getDatas(page, task) {
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
        // data list
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
            data.imgUrl = li.getElementsByTagName('img')[0].src;
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
    return datas;
}
