const puppeteer = require('puppeteer-core');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
    console.log('\n=======================================');
    console.log('🖼️  Renderizador de Carrossel Bilent');
    console.log('=======================================\n');

    let browser;
    try {
        const filePath = path.join(__dirname, 'assets', 'posts', 'launch', 'bilent_carrossel.html');
        const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`;

        console.log(`🌐 Acessando arquivo: ${filePath}`);

        browser = await puppeteer.launch({
            executablePath: edgePath,
            headless: "new",
            defaultViewport: {
                width: 1200, 
                height: 3600, // Big enough to fit all 3 slides vertically
                deviceScaleFactor: 2 
            }
        });

        const page = await browser.newPage();
        
        console.log('⏱️  Aguardando carregamento de fontes e ícones...');
        
        await page.goto(fileUrl, {
            waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
            timeout: 30000
        });

        // Extra tempo para garantir a renderização dos SVG
        await new Promise(r => setTimeout(r, 2000));

        const slides = ['slide1', 'slide2', 'slide3'];

        for (const [index, slideId] of slides.entries()) {
            console.log(`📸 Capturando ${slideId}...`);
            const element = await page.$(`#${slideId}`);
            if (element) {
                const outPath = path.join(__dirname, 'assets', 'posts', 'launch', `bilent_carrossel_${index + 1}.png`);
                await element.screenshot({ path: outPath });
                console.log(`✅ Salvo: bilent_carrossel_${index + 1}.png`);
            } else {
                console.log(`❌ Erro: Elemento #${slideId} não encontrado.`);
            }
        }

        console.log('\n🎉 Processo finalizado com sucesso!\n');
    } catch (error) {
        console.error('\n❌ Ocorreu um erro durante a captura:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
})();
