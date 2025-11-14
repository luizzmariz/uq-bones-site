const carouselTrack = document.querySelector('.carousel-track');

document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        easing: 'ease-in-out'
    });

    const header = document.getElementById('main-header');
    const detailedFormContainer = document.getElementById('detailed-form-container');
    const carouselContainer = document.querySelector('.model-carousel-container');
    
    const prevButton = document.querySelector('.carousel-arrow.prev');
    const nextButton = document.querySelector('.carousel-arrow.next');
    const originalSlides = Array.from(document.querySelectorAll('.carousel-track .model-slide'));
    const arrayOriginalSize = originalSlides.length; 
    
    let currentSlideIndex = Math.floor(arrayOriginalSize / 2);
    
    const ITENS_DE_BUFFER = 5;
    const gap = 30;

    function get5Itens() {
        carouselTrack.innerHTML = ''; 

        for (let i = 0; i < ITENS_DE_BUFFER; i++) {
            const indexOriginal = (currentSlideIndex - 2 + i + arrayOriginalSize) % arrayOriginalSize;

            const itemParaInserir = originalSlides[indexOriginal].cloneNode(true);
            itemParaInserir.classList.add('is-virtual'); 

            carouselTrack.appendChild(itemParaInserir);
        }
    }

    function addItemAfter() {
        currentSlideIndex = (currentSlideIndex + 1) % arrayOriginalSize; 

        const indexParaAdicionar = (currentSlideIndex + 2) % arrayOriginalSize; 
        const itemParaAdicionar = originalSlides[indexParaAdicionar].cloneNode(true);
        itemParaAdicionar.classList.add('is-virtual');

        carouselTrack.appendChild(itemParaAdicionar); 

        const itemParaRemover = carouselTrack.firstChild;
        if (itemParaRemover) {
            carouselTrack.removeChild(itemParaRemover);
        }

        const slideWidth = carouselTrack.children[0].offsetWidth;
        const resetOffset = slideWidth + gap;

        carouselTrack.style.transition = 'transform 0.5s ease-in-out';

        const newOffset = (slideWidth + gap) * 2; 

        setTimeout(() => {
            carouselTrack.style.transition = 'none';
        }, 500); 
    }

    function addItemBefore() {
        currentSlideIndex = (currentSlideIndex - 1 + arrayOriginalSize) % arrayOriginalSize; 

        const indexParaAdicionar = (currentSlideIndex - 2 + arrayOriginalSize) % arrayOriginalSize; 
        const itemParaAdicionar = originalSlides[indexParaAdicionar].cloneNode(true);
        itemParaAdicionar.classList.add('is-virtual');

        const slideWidth = carouselTrack.children[0].offsetWidth;
        const offset = (slideWidth + gap) * 3;

        carouselTrack.style.transition = 'none';
        
        carouselTrack.prepend(itemParaAdicionar); 

        const itemParaRemover = carouselTrack.lastChild;
        if (itemParaRemover) {
            carouselTrack.removeChild(itemParaRemover);
        }
        
        setTimeout(() => {
            carouselTrack.style.transition = 'transform 0.5s ease-in-out';
            const newOffset = (slideWidth + gap) * 2;
        }, 50);
    }

    function updateSelectedModel() {
        centerCarousel();

        const centralSlideIndexDOM = 2;
        const centralSlideDOM = carouselTrack.children[centralSlideIndexDOM];

        if (!centralSlideDOM) {
            console.error("Slide central não encontrado.");
            return;
        }

        Array.from(carouselTrack.children).forEach(slide => {
            slide.classList.remove('active');
        });

        centralSlideDOM.classList.add('active');

        const modelData = originalSlides[currentSlideIndex];

        document.getElementById('selected-model').value = modelData.dataset.model;
        document.getElementById('selected-model-name').textContent = modelData.querySelector('h3').textContent;
    }

    prevButton.addEventListener('click', () => {
        addItemBefore();
        updateSelectedModel();
    });

    nextButton.addEventListener('click', () => {
        addItemAfter();
        updateSelectedModel();
    });

    if (arrayOriginalSize > 0) {
        get5Itens();
        updateSelectedModel();
    }
    
    carouselTrack.addEventListener('click', function(e) {
        const clickedSlide = e.target.closest('.model-slide');
        if (!clickedSlide) return;

        const indexClicked = Array.from(carouselTrack.children).indexOf(clickedSlide);

        if (indexClicked < 2) {
            addItemBefore();
            updateSelectedModel();
        } else if (indexClicked > 2) {
            addItemAfter();
            updateSelectedModel();
        }

        if (indexClicked === 2) {
            detailedFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    const navLinks = document.querySelectorAll('.main-menu a, .footer-nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    const headerHeight = header ? header.offsetHeight : 0; 
                    const buffer = 15;
                    const scrollPosition = targetSection.offsetTop - headerHeight - buffer; 
                    
                    window.scrollTo({
                        top: Math.max(0, scrollPosition), 
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // const budgetForm = document.getElementById('budget-form');
    // if (budgetForm) {
    //     budgetForm.addEventListener('submit', function(e) {
    //         e.preventDefault();
    //         alert('Orçamento solicitado! Entraremos em contato via WhatsApp em breve.');
    //         budgetForm.reset();
    //     });
    // }

    const detailedBudgetForm = document.getElementById('budget-form'); // Use o ID correto do formulário
    if (detailedBudgetForm) {
        detailedBudgetForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // 1. Captura dos Dados
            const modelo = document.getElementById('selected-model').value;
            const corAba = document.getElementById('aba-cor').value;
            const corFrente = document.getElementById('frente-cor').value;
            const corLateral = document.getElementById('lateral-cor').value;
            const quantidade = document.getElementById('quantidade').value;
            const nome = document.getElementById('name-detailed').value;
            
            // --- 2. Montagem da Mensagem ---
            
            const numeroWhatsApp = "5584998386000"; // O número que você forneceu
            
            let mensagem = `Olá, me chamo ${nome}, tenho interesse em ter um `;
            
            mensagem += `modelo *${modelo.toUpperCase()}*`;
            mensagem += ` (${quantidade} unidades). Esses são os detalhes do modelo\n\n`;
            
            mensagem += `-Cor da Aba: ${corAba || 'Não especificada'}\n`;
            mensagem += `-Cor da Frente: ${corFrente || 'Não especificada'}\n`;
            mensagem += `-Cor das Laterais: ${corLateral || 'Não especificada'}\n\n`;

            // Aviso sobre a logomarca
            mensagem += `*A logomarca para o boné será enviada por mim logo após este contato.`;

            // 3. Formatação da Mensagem para a URL
            // encodeURIComponent() é CRÍTICO para garantir que espaços e quebras de linha funcionem na URL.
            const mensagemFormatada = encodeURIComponent(mensagem);

            // 4. Criação da URL Final e Redirecionamento
            const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagemFormatada}`;
            
            // Abre o link em uma nova aba
            window.open(urlWhatsApp, '_blank');
            
            // Opcional: Resetar o formulário após o envio
            detailedBudgetForm.reset();
        });
    }

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

    // --- Lógica do Formulário de Lead WhatsApp ---

    const ddiSelect = document.getElementById('ddi-select');
    const flagDisplay = document.getElementById('flag-display');
    const whatsappNumberInput = document.getElementById('whatsapp-number');
    const leadForm = document.getElementById('whatsapp-lead-form');

    // Função para atualizar o display da bandeira
    function updateFlagDisplay() {
        const selectedOption = ddiSelect.options[ddiSelect.selectedIndex];
        const flag = selectedOption.getAttribute('data-flag');
        const value = selectedOption.value;
        flagDisplay.textContent = `${flag} (${value})`;
    }

    // 1. Inicializa o display da bandeira
    updateFlagDisplay();

    // 2. Event Listener para mudanças no select
    ddiSelect.addEventListener('change', updateFlagDisplay);

    // 3. (Opcional) Máscara Simples para o Telefone (para simular o visual da imagem)
    whatsappNumberInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        let maskedValue = '';

        if (value.length > 0) {
            // Exemplo de máscara (99) 9 9999-9999
            if (value.length > 0) maskedValue += `(${value.substring(0, 2)}`;
            if (value.length > 2) maskedValue += `) ${value.substring(2, 3)}`;
            if (value.length > 3) maskedValue += ` ${value.substring(3, 7)}`;
            if (value.length > 7) maskedValue += `-${value.substring(7, 11)}`;
        }
        
        this.value = maskedValue;
    });


    // 4. Manipulador de Envio do Formulário
    leadForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const ddi = ddiSelect.value;
        const number = whatsappNumberInput.value.replace(/\D/g, ''); // Limpa a máscara
        const fullNumber = ddi + number;
        
        // Simulação: Aqui você enviaria os dados para o seu servidor ou para a API do WhatsApp
        console.log("Número Completo para Envio:", fullNumber);
        
        // Alerta de sucesso
        alert(`Seu layout está sendo preparado! Entraremos em contato no WhatsApp: ${fullNumber}`);
        
        // Limpar o formulário
        leadForm.reset();
        updateFlagDisplay(); // Reseta a bandeira
    });
});

window.onresize = centerCarousel;

function centerCarousel() {
        const slideWidth = carouselTrack.children[0].offsetWidth;
        const gap = 30;
        let offset = (slideWidth + gap);
        
        const isMobile = window.matchMedia("(max-width: 800px)").matches;
        const isTablet = window.matchMedia("(max-width: 1000px)").matches;

        if(isMobile)
        {
            console.log("3");
            carouselTrack.style.transform = `translateX(0px)`;
        }
        else 
        {
            if(isTablet)
            {
                console.log("1");
                offset = (slideWidth + gap) *2;
                carouselTrack.style.transform = `translateX(-${offset}px)`;        
            }
            else
            {
                console.log("2");
                carouselTrack.style.transform = `translateX(-${offset}px)`;        
            }
        }
    }

