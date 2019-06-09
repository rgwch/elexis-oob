const player = require('puppeteer');
const db = require('../../utils/dbutils');


const run = async () => {
    const conn = await db.getConnection(true, false)
    try {
        await db.exec(conn, "drop database elexisoobtest")
        await db.exec(conn, "drop user oobtester")

    } catch (prem) {
        console.log(prem)
    }

    const browser = await player.launch({ headless: false, slowMo: 100, defaultViewport: { width: 1024, height: 800 } });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    await page.click("#initdb")
    await page.$eval("#dbname", el => el.value = "elexisoobtest")
    await page.$eval("#dbuser", el => el.value = "oobtester")
    await page.click('button[type="submit"]');
    await page.waitForSelector("#place")
    await page.click('button[type="submit"]');
    await page.waitForSelector('button#tomain')
    await page.click('button[type="submit"]');

    await page.screenshot({ path: 'abschluss.png' });

    await browser.close();
}

run().then(r => {
    console.log("ok")
    
}).catch(err => { 
    console.log(err) 
})