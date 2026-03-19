document.addEventListener("DOMContentLoaded", () => {
    // Navbar scroll effect
    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Mobile Floating Nav & Scroll Logic
    const floatNav = document.querySelector(".mobile-float-nav");
    const menuOverlay = document.getElementById("menu-overlay");
    const openMenuBtn = document.getElementById("open-menu");
    const mainMobileMenuBtn = document.querySelector(".menu-mobile"); // Get original hamburger button
    const closeMenuBtn = document.getElementById("close-menu");
    const themeToggleBtn = document.getElementById("theme-toggle");

    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;
        
        // Show floating nav on mobile only after 200px
        if (window.innerWidth <= 992) {
            if (currentScrollY > 200) {
                floatNav.classList.add("is-visible");
            } else {
                floatNav.classList.remove("is-visible");
            }
        }
        
        lastScrollY = currentScrollY;
    });

    // Mobile Menu Overlay Toggle
    const toggleMenu = (show) => {
        if (show) {
            menuOverlay.style.display = "block";
            setTimeout(() => menuOverlay.classList.add("active"), 10);
            document.body.style.overflow = "hidden"; // Prevent scroll
        } else {
            menuOverlay.classList.remove("active");
            setTimeout(() => {
                menuOverlay.style.display = "none";
                document.body.style.overflow = "";
            }, 400);
        }
    };

    if (openMenuBtn) openMenuBtn.addEventListener("click", () => toggleMenu(true));
    if (mainMobileMenuBtn) mainMobileMenuBtn.addEventListener("click", () => toggleMenu(true)); // Also open from original navbar
    if (closeMenuBtn) closeMenuBtn.addEventListener("click", () => toggleMenu(false));
    
    // Close on link click
    menuOverlay.querySelectorAll(".menu-item").forEach(link => {
        link.addEventListener("click", () => toggleMenu(false));
    });

    // Dark Mode Toggle (Global para Desktop e Mobile)
    const themeToggleBtns = document.querySelectorAll("#theme-toggle, #theme-toggle-desktop");
    
    const toggleTheme = () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        
        // Sincroniza todos os botões na página
        themeToggleBtns.forEach(btn => {
            const icon = btn.querySelector("i");
            if (icon) {
                icon.className = isDark ? "ph-bold ph-sun" : "ph-bold ph-moon";
            }
        });
    };

    themeToggleBtns.forEach(btn => {
        btn.addEventListener("click", toggleTheme);
    });

    // Smooth Scroll para links do Menu Mobile e Navbar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset para compensar a navbar fixa
                const headeryOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headeryOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Pricing Tab Switching Logic (rest of the code)

    // Intersection Observer for scroll animations with Staggered Support
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stagger-container')) {
                    const items = entry.target.querySelectorAll('.stagger-item, .card-beneficio, .step, .func-item, .tag, .testimonial-card');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.remove('initial-hidden');
                            item.classList.add('fade-in-up');
                            item.style.opacity = "1";
                            item.style.visibility = "visible";
                            item.style.transform = "none";
                        }, index * 100);
                    });
                } else {
                    entry.target.classList.remove('initial-hidden');
                    entry.target.classList.add('fade-in-up');
                    entry.target.style.opacity = "1";
                    entry.target.style.visibility = "visible";
                    entry.target.style.transform = "none";
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initialize elements with initial-hidden and observe them
    // Increased threshold for safer appearance
    const elementsToAnimate = document.querySelectorAll('.fade-in-up, .stagger-container, .section-header, .card-beneficio, .step, .func-item, .tag, .testimonial-card');
    elementsToAnimate.forEach(el => {
        if (!el.classList.contains('stagger-item')) {
            // Only add if not already marked to avoid double hiding
            if (!el.classList.contains('initial-hidden')) {
                el.classList.add('initial-hidden');
            }
            observer.observe(el);
        }
    });

    // Safety timeout: reveal everything if observer fails or takes too long
    setTimeout(() => {
        document.querySelectorAll('.initial-hidden').forEach(el => {
            el.style.opacity = "1";
            el.style.visibility = "visible";
            el.style.transform = "none";
        });
    }, 3000);

    // Mouse Parallax for Hero Mockup
    const heroImage = document.querySelector('.mockup-img');
    const heroWrapper = document.querySelector('.hero-image-wrapper');

    if (heroWrapper && heroImage) {
        heroWrapper.addEventListener('mousemove', (e) => {
            const { width, height } = heroWrapper.getBoundingClientRect();
            const mouseX = e.clientX - heroWrapper.offsetLeft;
            const mouseY = e.clientY - heroWrapper.offsetTop;
            
            const centerX = width / 2;
            const centerY = height / 2;
            
            const moveX = (mouseX - centerX) / 25;
            const moveY = (mouseY - centerY) / 25;
            
            heroImage.style.transform = `perspective(1000px) rotateY(${moveX}deg) rotateX(${-moveY}deg) translateY(${moveY}px)`;
        });

        heroWrapper.addEventListener('mouseleave', () => {
            heroImage.style.transform = `perspective(1000px) rotateY(-5deg) rotateX(5deg)`;
        });
    }

    // Pricing Tab Switching Logic (already existing)
    const tabBtns = document.querySelectorAll('.tab-btn');
    // ... rest of the pricing logic stays the same ...
    const planTitle = document.getElementById('plan-title');
    const planPrice = document.getElementById('price-val');
    const planPeriod = document.getElementById('price-per');
    const paymentInfo = document.getElementById('payment-info');
    const economyTag = document.getElementById('economy-tag');
    const planCtaBtn = document.getElementById('plan-cta-btn');

    const planData = {
        mensal: {
            title: 'Plano Mensal',
            price: '69,90',
            period: '/mês',
            payment: 'Pagamento mensal',
            economy: false,
            link: 'https://www.asaas.com/paymentCampaign/show/3623754',
            btnText: 'Começar Agora'
        },
        anual: {
            title: 'Plano Anual',
            price: '49,90',
            period: '/mês',
            payment: 'Cobrado anualmente (R$ 598,80)',
            economy: true,
            link: 'https://www.asaas.com/paymentCampaign/show/3623765', 
            btnText: 'Começar Agora'
        },
        exclusivo: {
            title: 'Plano Exclusivo',
            price: 'Sob',
            period: 'Consulta',
            payment: 'Desenvolvimento sob medida',
            economy: false,
            link: 'https://wa.me/5511999999999',
            btnText: 'Falar com Consultor'
        }
    };

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.getAttribute('data-plan');
            
            // Update active states
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update content with animation
            const card = document.querySelector('.plan-card-large');
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                const data = planData[plan];
                planTitle.textContent = data.title;
                planPrice.textContent = data.price;
                planPeriod.textContent = data.period;
                paymentInfo.textContent = data.payment;
                
                if (planCtaBtn) {
                    planCtaBtn.href = data.link;
                    planCtaBtn.textContent = data.btnText;
                }
                
                // Toggle 'Mais Popular' badge only for annual plan
                if (plan === 'anual') {
                    card.classList.add('show-popular');
                } else {
                    card.classList.remove('show-popular');
                }

                if (data.economy) {
                    economyTag.style.display = 'inline-flex';
                } else {
                    economyTag.style.display = 'none';
                }

                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 200);
        });
    });

    // --- Calculadora de Lucro Perdido ---
    const calcVendas = document.getElementById('calc-vendas');
    const calcTicket = document.getElementById('calc-ticket');
    const calcResultado = document.getElementById('calc-resultado');
    const vendasVal = document.getElementById('vendas-val');
    const ticketVal = document.getElementById('ticket-val');

    function calcularPerda() {
        if (!calcVendas || !calcTicket || !calcResultado) return;
        
        const vendas = parseInt(calcVendas.value) || 0;
        const ticket = parseFloat(calcTicket.value) || 0;
        
        // Atualizar as etiquetas visuais dos sliders
        if (vendasVal) vendasVal.textContent = vendas;
        if (ticketVal) ticketVal.textContent = 'R$ ' + ticket;
        
        // Faturamento mensal (30 dias)
        const faturamento = vendas * ticket * 30;
        
        // Perda estimada de 15% (falta de controle, estoque parado, furtos, etc)
        const perda = faturamento * 0.15;
        
        // Formatar valor
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        const formatado = formatter.format(perda).replace('R$', '').trim();
        
        // Atualizar resultado no DOM sem muita animação para sliders não engasgarem
        calcResultado.innerHTML = `<span>R$</span> ${formatado}`;
    }

    if (calcVendas && calcTicket) {
        calcVendas.addEventListener('input', calcularPerda);
        calcTicket.addEventListener('input', calcularPerda);
        // Initial calc
        calcularPerda();
    }

    // --- Demonstração IA Instantânea ---
    const demoForm = document.getElementById('demo-form');
    const demoInput = document.getElementById('demo-input');
    const demoContainer = document.getElementById('demo-chat-container');

    if (demoForm && demoInput && demoContainer) {
        demoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = demoInput.value.trim();
            if (!text) return;
            
            // 1. Add user message
            const userMsg = document.createElement('div');
            userMsg.style.cssText = 'align-self: flex-end; background: var(--clr-primary-600); color: #fff; padding: 1rem 1.5rem; border-radius: 1.5rem 1.5rem 0 1.5rem; max-width: 85%; box-shadow: 0 4px 10px rgba(124,58,237,0.3); font-size: 1rem;';
            userMsg.textContent = text;
            demoContainer.appendChild(userMsg);
            
            // Clear input
            demoInput.value = '';
            
            // 2. Typing indicator
            const typingMsg = document.createElement('div');
            typingMsg.style.cssText = 'align-self: flex-start; background: #222; color: #aaa; padding: 1rem 1.5rem; border-radius: 1.5rem 1.5rem 1.5rem 0; font-size: 0.9rem; border: 1px solid #333; display: flex; gap: 4px; align-items: center;';
            typingMsg.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
            demoContainer.appendChild(typingMsg);
            
            // Scroll to bottom
            demoContainer.scrollTop = demoContainer.scrollHeight;
            
            // 3. Simulated Response
            setTimeout(() => {
                demoContainer.removeChild(typingMsg);
                
                const aiMsg = document.createElement('div');
                aiMsg.style.cssText = 'align-self: flex-start; background: #1a1a1a; color: #fff; padding: 1.25rem; border-radius: 1.5rem 1.5rem 1.5rem 0; width: 100%; border: 1px solid #333; font-size: 1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.3);';
                
                // Random profit margin simulation between 35% and 45%
                const profitMargin = (Math.random() * (0.45 - 0.35) + 0.35); 
                // Trying to extract value from text: "150"
                const valueMatch = text.match(/\d+[,.]?\d*/g);
                let value = 150; // default fallback if no number found
                if (valueMatch && valueMatch.length > 0) {
                    value = parseFloat(valueMatch[valueMatch.length-1].replace(',', '.'));
                }
                const profitFormato = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value * profitMargin);
                
                aiMsg.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; color: #00e676; font-weight: 600;">
                        <i class="ph-bold ph-check-circle"></i> Venda registrada
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; color: #aaa;">
                        <i class="ph-bold ph-package"></i> Estoque atualizado
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; color: var(--clr-primary-400); font-weight: 600; padding-top: 8px; border-top: 1px solid #333;">
                        <i class="ph-bold ph-money"></i> Lucro: ${profitFormato}
                    </div>
                `;
                
                demoContainer.appendChild(aiMsg);
                demoContainer.scrollTop = demoContainer.scrollHeight;
                
            }, 1200); // 1.2s thinking time
        });
    }

});
