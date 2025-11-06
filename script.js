document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        easing: 'ease-in-out'
    });

    // --- VARIÁVEIS GLOBAIS DO CARROSSEL ---
    const header = document.getElementById('main-header');
    const detailedFormContainer = document.getElementById('detailed-form-container');
    const carouselContainer = document.querySelector('.model-carousel-container');
    const carouselTrack = document.querySelector('.carousel-track');
    
    const prevButton = document.querySelector('.carousel-arrow.prev');
    const nextButton = document.querySelector('.carousel-arrow.next');
    const originalSlides = Array.from(document.querySelectorAll('.carousel-track .model-slide'));
    const arrayOriginalSize = originalSlides.length; // Ex: 3
    
    // O índice que rastreia qual item REAL do array original DEVE estar no CENTRO
    let currentSlideIndex = Math.floor(arrayOriginalSize / 2); // Ex: 1 (AMERICANO)
    
    const ITENS_DE_BUFFER = 5; // Mantemos 5 slides no DOM (2 de buffer em cada lado + 1 central)
    const gap = 30; // Valor do CSS

    
    // --- FUNÇÕES DE MANIPULAÇÃO DO DOM (SUA LÓGICA) ---

    // Função que insere os 5 itens iniciais e centraliza a visualização no item do meio (índice 2)
    function get5Itens() {
        carouselTrack.innerHTML = ''; // Limpa a pista

        for (let i = 0; i < ITENS_DE_BUFFER; i++) {
            // Calcula o índice do item no array original (Ex: Trucker=0, Americano=1, NY=2)
            // Começamos em (Central - 2)
            const indexOriginal = (currentSlideIndex - 2 + i + arrayOriginalSize) % arrayOriginalSize;
            
            // Clona o nó (CRÍTICO) e marca como virtual
            const itemParaInserir = originalSlides[indexOriginal].cloneNode(true);
            itemParaInserir.classList.add('is-virtual'); 

            carouselTrack.appendChild(itemParaInserir);
        }
        
        // CHAVE: Alinha o carrossel. Força o início a ser o ponto de início do 3º item.
        // O 3º item (índice 2) deve estar no centro.

        // const slideWidth = carouselTrack.children[0].offsetWidth;
        // const offset = (slideWidth + gap);
        
        // carouselTrack.style.transform = `translateX(-${offset}px)`;
    }


    // Move para o próximo item
    function addItemAfter() {
        // 1. Lógica de Loop (Virtual)
        currentSlideIndex = (currentSlideIndex + 1) % arrayOriginalSize; // Avança e volta ao início

        // 2. Manipulação de DOM: Adicionar Item no FIM
        // Calcula o índice do item que deve vir depois do 5º (4º index)
        const indexParaAdicionar = (currentSlideIndex + 2) % arrayOriginalSize; 
        const itemParaAdicionar = originalSlides[indexParaAdicionar].cloneNode(true);
        itemParaAdicionar.classList.add('is-virtual');
        
        // Adiciona o item no final
        carouselTrack.appendChild(itemParaAdicionar); 

        // 3. Manipulação de DOM: Remover Item do INÍCIO
        // O primeiro slide agora está fora do buffer de 5, removemos ele.
        const itemParaRemover = carouselTrack.firstChild;
        if (itemParaRemover) {
            carouselTrack.removeChild(itemParaRemover);
        }
        
        // 4. Correção Visual (CHAVE)
        // Após a manipulação de DOM, a pista fica um item mais para a esquerda.
        // Movemos a pista para trás (sem transição) pelo tamanho de um slide + gap.
        const slideWidth = carouselTrack.children[0].offsetWidth;
        const resetOffset = slideWidth + gap;
        
        // Aplica a transição suave
        carouselTrack.style.transition = 'transform 0.5s ease-in-out';
        
        // Move para a posição do próximo slide (2 slides + buffer)
        const newOffset = (slideWidth + gap) * 2; 
        // carouselTrack.style.transform = `translateX(-${newOffset}px)`;
        
        // Após a transição, reseta a posição visualmente (sem a transição de volta)
        setTimeout(() => {
            carouselTrack.style.transition = 'none';
        }, 500); 
    }


    // Move para o item anterior
    function addItemBefore() {
        // 1. Lógica de Loop (Virtual)
        currentSlideIndex = (currentSlideIndex - 1 + arrayOriginalSize) % arrayOriginalSize; // Volta para o final se necessário

        // 2. Manipulação de DOM: Adicionar Item no INÍCIO
        // Calcula o índice do item que deve vir antes do 1º (0º index)
        const indexParaAdicionar = (currentSlideIndex - 2 + arrayOriginalSize) % arrayOriginalSize; 
        const itemParaAdicionar = originalSlides[indexParaAdicionar].cloneNode(true);
        itemParaAdicionar.classList.add('is-virtual');

        // 3. Adiciona o item no início, mas primeiro move a pista para a esquerda (tamanho de 1 slide)
        const slideWidth = carouselTrack.children[0].offsetWidth;
        const offset = (slideWidth + gap) * 3; // Onde o slide central deveria estar se estivesse no índice 3

        carouselTrack.style.transition = 'none';
        // carouselTrack.style.transform = `translateX(-${offset}px)`;
        
        carouselTrack.prepend(itemParaAdicionar); // Adiciona no início
        
        // 4. Manipulação de DOM: Remover Item do FIM
        const itemParaRemover = carouselTrack.lastChild;
        if (itemParaRemover) {
            carouselTrack.removeChild(itemParaRemover);
        }
        
        // 5. Transição suave para a nova posição central
        setTimeout(() => {
            carouselTrack.style.transition = 'transform 0.5s ease-in-out';
            const newOffset = (slideWidth + gap) * 2; // Volta para a posição 2
            // carouselTrack.style.transform = `translateX(-${newOffset}px)`;
        }, 50); // Pequeno atraso para o navegador registrar o 'prepend'
    }

    function updateSelectedModel() {
        centerCarousel();

        // 1. O slide central no DOM é sempre o TERCEIRO item (índice 2)
        const centralSlideIndexDOM = 2;
        const centralSlideDOM = carouselTrack.children[centralSlideIndexDOM];

        if (!centralSlideDOM) {
            console.error("Slide central não encontrado.");
            return;
        }

        // 2. Garante que apenas o slide central está 'active'
        Array.from(carouselTrack.children).forEach(slide => {
            slide.classList.remove('active');
        });

        centralSlideDOM.classList.add('active');

        // 3. O índice REAL dos dados é o índice virtual (currentSlideIndex)
        const modelData = originalSlides[currentSlideIndex];

        // 4. Atualiza os dados do formulário
        document.getElementById('selected-model').value = modelData.dataset.model;
        document.getElementById('selected-model-name').textContent = modelData.querySelector('h3').textContent;
    }

    function centerCarousel() {
        const slideWidth = carouselTrack.children[0].offsetWidth;
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

    // Chame esta função na inicialização do DOM, e no final das manipulações.
    
    // --- LÓGICA DE EVENTOS E INICIALIZAÇÃO ---

    // Manipuladores de Eventos
    prevButton.addEventListener('click', () => {
        addItemBefore();
        updateSelectedModel();
        // Atualiza o estado ativo no novo item central (sem precisar de função update)
        // Isso será complexo, então vou simplificar o Update de Ativo
    });

    nextButton.addEventListener('click', () => {
        addItemAfter();
        updateSelectedModel();
    });
    
    // Adiciona esta lógica no final do seu DOMContentLoaded
    // 1. Inicializa o carrossel com 5 itens
    if (arrayOriginalSize > 0) {
        get5Itens();
        updateSelectedModel();
    }
    
    // 2. Lógica de Clique no Painel (Adaptada para a nova estrutura)
    // Você precisará adicionar um event listener aos novos slides 'is-virtual'
    carouselTrack.addEventListener('click', function(e) {
        const clickedSlide = e.target.closest('.model-slide');
        if (!clickedSlide) return;

        // Verifica o índice do slide clicado no DOM (0 a 4)
        const indexClicked = Array.from(carouselTrack.children).indexOf(clickedSlide);

        if (indexClicked < 2) {
            // Clicou no slide 0 ou 1 (esquerda), deve mover para trás
            addItemBefore();
            updateSelectedModel();
        } else if (indexClicked > 2) {
            // Clicou no slide 3 ou 4 (direita), deve mover para frente
            addItemAfter();
            updateSelectedModel();
        }

        // Se clicou no item central (índice 2), apenas rola para o formulário
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

    const budgetForm = document.getElementById('budget-form');
    if (budgetForm) {
        budgetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Orçamento solicitado! Entraremos em contato via WhatsApp em breve.');
            budgetForm.reset();
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
});