/**
 * 바닥까지 내려가는 무한 스크롤
 */
export async function autoScroll(page) {
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
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
}
