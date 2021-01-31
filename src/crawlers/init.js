import puppeteer from 'puppeteer';

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
    const keyword = '바른엔젤체어2';

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(
        `https://search.shopping.naver.com/search/all?query=${encodeURI(
            `${keyword}`,
        )}`,
    );
    await autoScroll(page);

    // 제목 / 가격 / 판매처 / 썸네일 사진 획득
    // 완료
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
        // function이 argument로 넘어가지 않는 문제
        //return getElementIncludeClass;
        // a tags list
        const datas = liTags.map((li) => {
            const data = {
                title: getElementIncludeClass(li, 'basicList_link').text,
                price: getElementIncludeClass(li, 'price_num').text,
                mallUrl: getElementIncludeClass(li, 'basicList_link').href,
                imgUrl: '',
                mall: '',
            };
            // 이미지 src
            data.imgUrl = getElementIncludeClass(
                li,
                'thumbnail',
            ).getElementsByTagName('img')[0].src;
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
    console.log(datas);
};

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
