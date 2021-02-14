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

export const get11stPdtCode = function (url) {
    // url/products/"pdtCode"?queries
    // query 제거한 부분만 추출
    url = url.split('?').shift();
    url = url.split('/');
    url.reverse();
    return url.shift();
};
export const getESMPdtCode = async function (url) {};
export const getSmartStorePdtCode = async function (url) {};
export const getInterparkPdtCode = async function (url) {};
export const getCoupangPdtCode = async function (url) {};
export const getWemapPdtCode = async function (url) {
    // url/products/"pdtCode"?queries
    url = url.split('?').shift();
    url = url.split('/');
    url.reverse();
    return url.shift();
};
export const getHomeAndShoppingPdtCode = async function (url) {};
export const getSSGPdtCode = async function (url) {
    // itemId query
    const { itemId } = destructQueries();
    return itemId;
};
