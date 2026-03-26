const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
    console.log("Iniciando...");
    try {
        const browser = await puppeteer.launch({ 
            executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 
            headless: 'new',
            userDataDir: 'C:\\SITES\\Valora\\EdgeTempProfile',
            defaultViewport: { width: 1440, height: 900 },
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        console.log("Acessando a página de login...");
        await page.goto('https://bilent.base44.app', { waitUntil: 'networkidle2', timeout: 60000 });
        
        // Let's check if we are on the login page or already admitted
        await new Promise(r => setTimeout(r, 3000));
        let url = page.url();
        console.log("Current URL:", url);
        
        if (url.includes('/login')) {
            console.log("Na página de login. Tentando clicar no botão do Google...");
            // Click any button containing 'Google'
            const googleBtn = await page.evaluateHandle(() => {
                const btns = Array.from(document.querySelectorAll('button'));
                return btns.find(b => b.innerText.includes('Google'));
            });
            if (googleBtn) {
                await googleBtn.click();
                console.log("Clicou no botão do Google!");
                await new Promise(r => setTimeout(r, 5000));
                
                // If there's a Google account chooser (since we copied the profile), click the first account
                const accountDiv = await page.evaluateHandle(() => {
                    // Google's chooser usually has an identifiable class or data-email
                    const divs = Array.from(document.querySelectorAll('div[data-email], div[role="button"][data-identifier]'));
                    return divs[0];
                });
                if (accountDiv) {
                    await accountDiv.click();
                    console.log("Clicou na conta do Google!");
                }
            }
            
            // Wait for navigation to dashboard
            console.log("Aguardando carregar o painel (até 30s)...");
            await page.waitForFunction('window.location.pathname !== "/login"', { timeout: 30000 }).catch(()=>console.log("Timeout aguardando painel, continuando assim mesmo..."));
            await new Promise(r => setTimeout(r, 5000)); // wait for api calls
        }
        
        url = page.url();
        console.log("URL atual pós login:", url);

        // Screenshot 1: Relatórios Financeiros (Dashboard)
        console.log("Capturando Dashboard (showcase_report.png)...");
        await page.screenshot({ path: 'c:\\SITES\\Valora\\assets\\showcase_report.png' });
        
        // Vamos tentar achar o link de 'Produtos' na navegação
        console.log("Procurando menu de Produtos...");
        const clickedEstoque = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a, button, div[role="button"]'));
            const estoqueBtn = links.find(l => l.innerText && l.innerText.toLowerCase().includes('produtos'));
            if (estoqueBtn) {
                estoqueBtn.click();
                return true;
            }
            return false;
        });
        await new Promise(r => setTimeout(r, 4000));
        console.log("Capturando Estoque (showcase_inventory.png)...");
        await page.screenshot({ path: 'c:\\SITES\\Valora\\assets\\showcase_inventory.png' });

        // Vamos tentar achar o link de 'Vendas' / 'CRM' na navegação
        console.log("Procurando menu de Vendas/CRM...");
        const clickedVendas = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a, button, div[role="button"]'));
            const vendasBtn = links.find(l => l.innerText && (l.innerText.toLowerCase().includes('vendas') || l.innerText.toLowerCase().includes('crm') || l.innerText.toLowerCase().includes('PDV')));
            if (vendasBtn) {
                vendasBtn.click();
                return true;
            }
            return false;
        });
        await new Promise(r => setTimeout(r, 4000));
        console.log("Capturando Vendas (showcase_sales.png)...");
        await page.screenshot({ path: 'c:\\SITES\\Valora\\assets\\showcase_sales.png' });

        console.log("Pronto!");
        await browser.close();
    } catch (err) {
        console.error('Erro durante o roteiro:', err);
        process.exit(1);
    }
})();
