const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
    console.log("Iniciando captura da arte 1080x1080...");
    try {
        const browser = await puppeteer.launch({ 
            executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 
            headless: 'new',
            defaultViewport: { width: 1080, height: 1080 },
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        const htmlPath = path.resolve('c:/SITES/Valora/assets/posts/launch/bilent_facebook_ad.html');
        console.log("Acessando arquivo:", htmlPath);
        
        await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
        
        // Let it render fonts properly
        await new Promise(r => setTimeout(r, 2000));
        
        const element = await page.$('.ad-canvas');
        const outputPath = 'c:/SITES/Valora/assets/posts/launch/bilent_facebook_ad_final.png';
        
        if (element) {
            await element.screenshot({ path: outputPath });
            console.log("Imagem salva com sucesso em:", outputPath);
        } else {
            console.log("Falha ao encontrar .ad-canvas");
            await page.screenshot({ path: outputPath });
        }

        await browser.close();
        console.log("Processo finalizado!");
    } catch (err) {
        console.error('Erro durante a captura:', err);
        process.exit(1);
    }
})();
