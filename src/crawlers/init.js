import puppeteer from 'puppeteer';

const pages = [
    // krm-65
    'https://search.shopping.naver.com/detail/detail.nhn?nvMid=20793817845&query=%EA%B7%80%EB%9A%9C%EB%9D%BC%EB%AF%B8%20%EC%98%A8%EC%88%98%EB%A7%A4%ED%8A%B8&NaPm=ct%3Dkgfb08pk%7Cci%3D22b7f5bec76c03ea6b8bdc78878d643c2dc480a8%7Ctr%3Dslsl%7Csn%3D95694%7Chk%3Dd8b0149fb7ef7b90860b58fc5fcced02d76fffea',
    // krm-63
    'https://search.shopping.naver.com/detail/detail.nhn?nvMid=20794585904&query=%EA%B7%80%EB%9A%9C%EB%9D%BC%EB%AF%B8%20%EC%98%A8%EC%88%98%EB%A7%A4%ED%8A%B8&NaPm=ct%3Dkgfb09hc%7Cci%3D510c5875fdb6e19eee0ae33536433ae01922d757%7Ctr%3Dslsl%7Csn%3D95694%7Chk%3D9ede74e27bfeeebc70abba37ec656178c06fbec2',
    // em-87
    'https://search.shopping.naver.com/detail/detail.nhn?nvMid=20794885913&query=em-87&NaPm=ct%3Dkgfb3dd4%7Cci%3Db684ef33b6b8a4339ca1ca4625362ac69516fc1b%7Ctr%3Dslsl%7Csn%3D95694%7Chk%3D7b4687fc52801d7764c6b948cf80f7b2101d5c95',
    // em-321
    'https://search.shopping.naver.com/detail/detail.nhn?nvMid=15321359098&query=%EA%B7%80%EB%9A%9C%EB%9D%BC%EB%AF%B8%20%EC%98%A8%EC%88%98%EB%A7%A4%ED%8A%B8&NaPm=ct%3Dkgfb0iqo%7Cci%3D9601a294253a72cd0c01b84d8f89b05cad2cd844%7Ctr%3Dslsl%7Csn%3D95694%7Chk%3D00c8c261e9b2171afe47dd2783fd63bd1233aa9d',
];

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
    // 모델 페이지 크롤링
    const checkList = await crawlModelPage(page);
    // 상품 페이지 크롤링
    for (var object of checkList) {
        console.log(object.title);
        await crawlProductPage(page, object.title);
    }
})();
