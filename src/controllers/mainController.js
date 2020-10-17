import puppeteer from 'puppeteer';

export const getHome = (req, res) => {
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(
            'https://search.shopping.naver.com/detail/detail.nhn?nvMid=20793817845&query=%EA%B7%80%EB%9A%9C%EB%9D%BC%EB%AF%B8%20%EC%98%A8%EC%88%98%EB%A7%A4%ED%8A%B8&NaPm=ct%3Dkgc9zx8w%7Cci%3D164563fc46b063c973ad079319e4ccfe1cfcc999%7Ctr%3Dslsl%7Csn%3D95694%7Chk%3D230205d6c27dd2fcf0ab38637b0ecf96fb5aec91',
            {
                waitUntil: 'networkidle2',
            },
        );
        await page.pdf({ path: 'search.pdf', format: 'A4' });

        await browser.close();
    })();

    res.send('done!');
};
