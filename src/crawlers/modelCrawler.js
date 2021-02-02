import { getPagination } from './common';

/// 모델 페이지를 크롤링합니다.
export async function crawlModelPage(page) {
    await page.waitForSelector('.mall_type._mall_nm');
    // 페이지 개수 세기
    const pageCount = await getPagination(page, '#_price_list_paging');
    const crawledData = [];
    // 페이지 별 크롤링
    for (var pageIndex = 0; pageIndex < pageCount; pageIndex++) {
        // 페이지 이동
        if (pageIndex != 0) await page.evaluate(navgiateToNextPage, pageIndex);
        // 로딩 기다리기
        await page.waitForTimeout(1000);
        // contents 모으기
        const contents = await page.evaluate(getContents);
        contents.forEach((elem) => { 
            if (elem === null || crawledData.includes(elem)) return;
            crawledData.push(elem);
        });
    }
    return crawledData;
}

const navgiateToNextPage = (pageNum) => {
    // 네이버 script
    shop.detail.PriceHandler.page(pageNum + 1, '_price_list_paging');
};

/// [{ storeName, title }] 을 반환합니다.
const getContents = (el) => {
    const elements = Array.from(document.querySelectorAll('._itemSection'));
    const titles = elements.map((element, index) => {
        const storeName = element.querySelector('.mall_type._mall_nm');
        const title = element.querySelector('.goods_tit');
        if (!storeName) {
            return null;
        }
        return title.textContent.replace('\n', '').trim();
    });
    return titles;
};