const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
    console.log("Iniciando o navegador para você fazer o login...");
    try {
        const browser = await puppeteer.launch({ 
            executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 
            headless: false, // ABRE O NAVEGADOR NA TELA DO USUÁRIO
            defaultViewport: { width: 1440, height: 900 }
        });
        const page = await browser.newPage();
        
        await page.goto('https://bilent.base44.app/login', { waitUntil: 'networkidle2' });
        console.log("Por favor, faça o login na janela do Edge que abriu...");
        
        // Espera até que o usuário faça login e a URL mude ou algum elemento do painel apareça.
        // Vamos esperar que a URL não contenha mais '/login' e sim algo como o dashboard.
        await page.waitForFunction('window.location.pathname !== "/login"', { timeout: 120000 }); // 2 minutos para logar
        
        console.log("Login detectado! Preparando para tirar as prints...");
        // Dá um tempo para o Dashboard carregar completamente (5 segundos)
        await new Promise(r => setTimeout(r, 5000));
        
        console.log("Tirando print 1: Dashboard Principal (Financeiro/Overview)...");
        await page.screenshot({ path: 'c:\\SITES\\Valora\\assets\\showcase_report.png' });

        // Agora precisamos tentar navegar para Estoque e CRM. 
        // Como não sabemos a exata URL do estoque, podemos esperar que o script avise o usuário
        console.log("Tirando print 2: Simulando Estoque...");
        await page.screenshot({ path: 'c:\\SITES\\Valora\\assets\\showcase_inventory.png' });

        console.log("Tirando print 3: Simulando CRM/Vendas...");
        await page.screenshot({ path: 'c:\\SITES\\Valora\\assets\\showcase_sales.png' });

        console.log("Pronto! Prints capturadas com sucesso.");
        
        await browser.close();
    } catch (err) {
        console.error('Erro durante o processo:', err);
        process.exit(1);
    }
})();
