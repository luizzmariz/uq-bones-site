document.addEventListener('DOMContentLoaded', function() {
    // 1. Inicializa a biblioteca AOS (Animate On Scroll)
    // Isso simula o efeito de 'fadeInLeft', 'fadeInUp', etc., 
    // que o site original utiliza com o Elementor.
    AOS.init({
        duration: 1000,   // Duração da animação (em ms)
        once: true,       // A animação deve ocorrer apenas uma vez
        easing: 'ease-in-out' // Curva de animação
    });

    // 2. Comportamento do menu de navegação (rolagem suave)
    const navLinks = document.querySelectorAll('.main-menu a, .footer-nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Verifica se é um link interno (âncora)
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    console.log("achou");
                    // Rola a tela suavemente até a seção
                    window.scrollTo({
                        top: targetSection.offsetTop - 70, // -70 para compensar o cabeçalho fixo
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 3. Simulação de envio do formulário (apenas demonstração)
    const form = document.getElementById('budget-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Ação real: Enviar dados via AJAX (necessita de backend)
            // Simulação:
            alert('Orçamento solicitado! Entraremos em contato via WhatsApp em breve.');
            form.reset();
        });
    }

    // 4. Lógica simples de Accordion (Dúvidas Frequentes)
    // O elemento <details> já faz grande parte do trabalho no HTML,
    // mas aqui você pode adicionar mais lógica, como fechar outros
    // itens ao abrir um novo, se quisesse.

    // Exemplo de como forçar apenas um item aberto por vez:
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        item.addEventListener('toggle', function() {
            if (this.open) {
                accordionItems.forEach(otherItem => {
                    if (otherItem !== this && otherItem.open) {
                        otherItem.open = false;
                    }
                });
            }
        });
    });
});