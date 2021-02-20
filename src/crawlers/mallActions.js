/**
 * url에서 쿼리들을 분리해냅니다
 * @param {*} url
 */
const destructQueries = function (url) {
    const splitUrl = url.split('?');
    splitUrl.shift();
    const queryString = splitUrl
        .reduce((acc, curr) => acc + curr, '')
        .split('&');
    const queryObjects = {};
    queryString.forEach((query) => {
        const [queryName, queryValue] = query.split('=');
        Object.defineProperty(queryObjects, queryName, {
            value: queryValue,
            writable: false,
            enumerable: true,
            configurable: true,
        });
    });
    return queryObjects;
};

/**
 * 11번가 상품번호
 * @param {*} url
 */
export const get11stPdtCode = function (url) {
    // prdNo query
    const { prdNo: pdtCode } = destructQueries(url);
    return pdtCode;
};
/**
 * 옥션 상품번호
 * @param {*} url
 */
export const getAuctionCode = function (url) {
    // ItemNo query
    const { ItemNo: pdtCode } = destructQueries(url);
    return pdtCode;
};
/**
 * 지마켓 상품번호
 * @param {*} url
 */
export const getGMarketCode = function (url) {
    // goodscode query
    const { goodscode: pdtCode } = destructQueries(url);
    return pdtCode;
};
/**
 * G9 상품번호
 * @param {*} url
 */
export const getG9Code = function (url) {
    // url/"pdtCode"?queries
    url = url.split('?').shift();
    url = url.split('/');
    url.reverse();
    const pdtCode = url.shift();
    return pdtCode;
};
/**
 * 스마트스토어 상품번호
 * @param {*} url
 */
export const getSmartStorePdtCode = function (url) {
    // url/username/products/"pdtCode"?queries
    url = url.split('?').shift();
    url = url.split('/');
    url.reverse();
    const pdtCode = url.shift();
    return pdtCode;
};
/**
 * 인터파크 상품번호
 * @param {*} url
 */
export const getInterparkPdtCode = function (url) {
    // prdNo query
    const { prdNo: pdtCode } = destructQueries(url);
    return pdtCode;
};
/**
 * 쿠팡 상품번호
 * @param {*} url
 */
export const getCoupangPdtCode = function (url) {
    // prdNo query
    const { itemId: pdtCode } = destructQueries(url);
    return pdtCode;
};
/**
 * 위메프 상품번호
 * @param {*} url
 */
export const getWemapPdtCode = function (url) {
    // url/products/"pdtCode"?queries
    url = url.split('?').shift();
    url = url.split('/');
    url.reverse();
    const pdtCode = url.shift();
    return pdtCode;
};
/**
 * SSG 상품번호
 * @param {*} url
 */
export const getSSGPdtCode = function (url) {
    // itemId query
    const { itemId: pdtCode } = destructQueries(url);
    return pdtCode;
};
/**
 * 롯데ON 상품번호
 * @param {*} url
 */
export const getLotteOnPdtCode = function (url) {
    // url/"pdtCode"?queries
    url = url.split('?').shift();
    url = url.split('/');
    url.reverse();
    const pdtCode = url.shift();
    return pdtCode;
};
/**
 * K쇼핑 상품번호
 * @param {*} url
 */
export const getKShoppingPdtCode = function (url) {
    // url/"pdtCode"?queries
    url = url.split('?').shift();
    url = url.split('/');
    url.reverse();
    const pdtCode = url.shift();
    return pdtCode;
};
/**
 * lf몰 상품번호
 * @param {*} url
 */
export const getLFMallPdtCode = function (url) {
    // itemId query
    const { PROD_CD: pdtCode } = destructQueries(url);
    return pdtCode;
};
/**
 * 롯데홈쇼핑 상품번호
 * @param {*} url
 */
export const getLotteIMallPdtCode = function (url) {
    // itemId query
    const { goods_no: pdtCode } = destructQueries(url);
    return pdtCode;
};
/**
 * NS몰 상품번호
 * @param {*} url
 */
export const getNSMallPdtCode = function (url) {
    // itemId query
    const { partNumber: pdtCode } = destructQueries(url);
    return pdtCode;
};
/**
 * GS샵 상품번호
 * @param {*} url
 */
export const getGSShopPdtCode = function (url) {
    // itemId query
    const { prdid: pdtCode } = destructQueries(url);
    return pdtCode;
};
/**
 * 공영쇼핑 상품번호
 * @param {*} url
 */
export const getGongYoungPdtCode = function (url) {
    // itemId query
    const { prdId: pdtCode } = destructQueries(url);
    return pdtCode;
};
/**
 * CJ몰 상품번호
 * @param {*} url
 */
export const getCJMallPdtCode = function (url) {
    // url/"pdtCode"?queries
    url = url.split('?').shift();
    url = url.split('/');
    url.reverse();
    const pdtCode = url.shift();
    return pdtCode;
};
/**
 * SK스토아 상품번호
 * @param {*} url
 */
export const getSKStoaPdtCode = function (url) {
    // url/"pdtCode"?queries
    url = url.split('?').shift();
    url = url.split('/');
    url.reverse();
    const pdtCode = url.shift();
    return pdtCode;
};
/**
 * 롯데백화점 상품번호
 * @param {*} url
 */
export const getLotteDepartmentPdtCode = function (url) {
    // url/"pdtCode"?queries
    url = url.split('?').shift();
    url = url.split('/');
    url.reverse();
    const pdtCode = url.shift();
    return pdtCode;
};
/**
 * 홈앤쇼핑 상품번호
 * @param {*} url
 */
export const getHomeAndShoppingPdtCode = function (url) {
    // itemId query
    const { goods_code: pdtCode } = destructQueries(url);
    return pdtCode;
};
/**
 * H몰 상품번호
 * @param {*} url
 */
export const getHmallPdtCode = function (url) {
    // itemId query
    const { slitmCd: pdtCode } = destructQueries(url);
    return pdtCode;
};
/**
 * 티몬 상품번호
 * @param {*} url
 */
export const getTMonPdtCode = function (url) {
    // url/"pdtCode"?queries
    url = url.split('?').shift();
    url = url.split('/');
    url.reverse();
    const pdtCode = url.shift();
    return pdtCode;
};
