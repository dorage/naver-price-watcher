/// query로 pagination 의 공통 루트를 가져와서 페이지장수를 반환해줍니다.ㄴ
export async function getPagination(page, query) {
    const pagination = await page.evaluate((query) => {
        const productMenuLength = document.querySelector(query).children.length;
        return productMenuLength;
    }, query);
    return pagination;
}