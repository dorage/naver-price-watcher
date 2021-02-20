import {
    get11stPdtCode,
    getAuctionCode,
    getGMarketCode,
    getG9Code,
    getSmartStorePdtCode,
    getInterparkPdtCode,
    getCoupangPdtCode,
    getWemapPdtCode,
    getSSGPdtCode,
    getLotteOnPdtCode,
    getKShoppingPdtCode,
    getLFMallPdtCode,
    getLotteIMallPdtCode,
    getNSMallPdtCode,
    getGSShopPdtCode,
    getGongYoungPdtCode,
    getCJMallPdtCode,
    getSKStoaPdtCode,
    getLotteDepartmentPdtCode,
    getHomeAndShoppingPdtCode,
    getHmallPdtCode,
    getTMonPdtCode,
} from './mallActions';

/**
 * 인수로 주어지는 url로 이동하여 상품ID를 받아옵니다.
 * @param {*} page
 * @param {*} mallUrl
 */
export async function getProductCode(page, mall, mallUrl) {
    /**
     * 다음 시간만큼 대기합니다.
     * @param {*} ms
     */
    const sleep = function (ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };
    // 페이지가 리다이렉트될때까지 대기합니다.
    try {
        await page.goto(mallUrl);
        while (page.url().includes('https://cr.shopping.naver.com')) {
            await sleep(100);
        }
        const pdtCode = await getProductCodeFromMall(mall, page.url());
        return pdtCode;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function getProductCodeFromMall(mall, mallUrl) {
    switch (mall) {
        case '11번가':
            return get11stPdtCode(mallUrl);
        case '옥션':
            return getAuctionCode(mallUrl);
        case 'G마켓':
            return getGMarketCode(mallUrl);
        case '위메프':
            return getWemapPdtCode(mallUrl);
        case '쿠팡':
            return getCoupangPdtCode(mallUrl);
        case 'SK스토아':
            return getSKStoaPdtCode(mallUrl);
        case '롯데홈쇼핑':
            return getLotteIMallPdtCode(mallUrl);
        case 'G9':
            return getG9Code(mallUrl);
        case 'K쇼핑':
            return getKShoppingPdtCode(mallUrl);
        case '롯데ON':
            return getLotteOnPdtCode(mallUrl);
        case '티몬':
            return getTMonPdtCode(mallUrl);
        case '인터파크':
            return getInterparkPdtCode(mallUrl);
        case 'NS홈쇼핑':
            return getNSMallPdtCode(mallUrl);
        case '신세계몰':
            return getSSGPdtCode(mallUrl);
        case 'GSSHOP':
            return getGSShopPdtCode(mallUrl);
        case 'CJmall':
            return getCJMallPdtCode(mallUrl);
        case 'SSG닷컴':
            return getSSGPdtCode(mallUrl);
        case '이마트몰':
            return getSSGPdtCode(mallUrl);
        case '현대Hmall':
            return getHmallPdtCode(mallUrl);
        case '공영쇼핑':
            return getGongYoungPdtCode(mallUrl);
        case '롯데백화점':
            return getLotteDepartmentPdtCode(mallUrl);
        case 'LFmall':
            return getLFMallPdtCode(mallUrl);
        case '홈앤쇼핑':
            return getHomeAndShoppingPdtCode(mallUrl);
    }
    if (mallUrl.includes('smartstore')) {
        return getSmartStorePdtCode(mallUrl);
    }
}
