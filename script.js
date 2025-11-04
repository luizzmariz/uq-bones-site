document.addEventListener('DOMContentLoaded', function() {
    // 1. Inicializa a biblioteca AOS
    AOS.init({
        duration: 1000,
        once: true,
        easing: 'ease-in-out'
    });

    // --- VARIÁVEIS GLOBAIS E ELEMENTOS ---
    const header = document.getElementById('main-header');
    const detailedFormContainer = document.getElementById('detailed-form-container');
    const carouselContainer = document.querySelector('.model-carousel-container');
    const carouselTrack = document.querySelector('.carousel-track');
    const navLinks = document.querySelectorAll('.main-menu a, .footer-nav a');
    
    // Configurações do Carrossel Infinito
    const prevButton = document.querySelector('.carousel-arrow.prev');
    const nextButton = document.querySelector('.carousel-arrow.next');
    const originalSlides = Array.from(document.querySelectorAll('.carousel-track .model-slide')); 
    const totalOriginalSlides = originalSlides.length;
    
    // Duplicamos 3 slides (o número visível em desktop) para garantir transições suaves.
    const duplicateCount = 1; 
    const gap = 30; // Garanta que este valor seja o mesmo que no seu CSS!

    
    // --- FUNÇÃO DE DUPLICAÇÃO E INICIALIZAÇÃO DA PISTA ---
    
    // 1. Duplica os últimos slides e coloca no início (clones iniciais)
    const slidesToPrepend = originalSlides.slice(-duplicateCount).map(slide => {
        const clone = slide.cloneNode(true);
        clone.classList.add('is-clone');
        return clone;
    });
    slidesToPrepend.forEach(clone => carouselTrack.prepend(clone));

    // 2. Duplica os primeiros slides e coloca no final (clones finais)
    const slidesToAppend = originalSlides.slice(0, duplicateCount).map(slide => {
        const clone = slide.cloneNode(true);
        clone.classList.add('is-clone');
        return clone;
    });
    slidesToAppend.forEach(clone => carouselTrack.appendChild(clone));

    // Re-seleciona todos os slides (incluindo clones)
    const allSlides = Array.from(document.querySelectorAll('.carousel-track .model-slide'));
    
    // Índice inicial: Começa no primeiro slide REAL (depois dos clones iniciais)
    let currentSlideIndex = duplicateCount; 
    
    
    // --- FUNÇÃO PRINCIPAL DE POSICIONAMENTO E ATUALIZAÇÃO ---
    
    function updateCarouselPosition(smoothTransition = true) {
        if (allSlides.length === 0) return;

        const slideWidth = allSlides[0].offsetWidth;
        const containerWidth = carouselContainer.offsetWidth;
        
        // CÁLCULO DE POSIÇÃO
        // Posição de início do slide atual: (Largura do Slide + Gap) * Índice
        const slideStartOffset = (slideWidth + gap) * currentSlideIndex;

        // Posição Centralizada: (Largura do Container - Largura do Slide) / 2
        const centerOffset = (containerWidth - slideWidth) / 2;
        
        // Posição final da translação
        const scrollOffset = slideStartOffset - centerOffset;

        // Aplica a transição suave ou instantânea
        carouselTrack.style.transition = smoothTransition ? 'transform 0.5s ease-in-out' : 'none';
        carouselTrack.style.transform = `translateX(-${Math.max(0, scrollOffset)}px)`;
        
        
        // --- Lógica de Loop (Reset Imediato) ---
        if (smoothTransition) {
            setTimeout(() => {
                // Se atingiu o CLONE do final (primeiro slide real no final da pista)
                if (currentSlideIndex >= allSlides.length - duplicateCount) {
                    currentSlideIndex = duplicateCount; // Volta para o primeiro slide real
                    updateCarouselPosition(false); 
                }
                // Se atingiu o CLONE do início (último slide real no início da pista)
                else if (currentSlideIndex < duplicateCount) {
                    currentSlideIndex = allSlides.length - (duplicateCount * 2) + (currentSlideIndex - 1); 
                    // Correção: Move para o slide real correspondente ao clone (total slides - clones duplos)
                    currentSlideIndex = totalOriginalSlides + duplicateCount - 1; // Último slide real + clones iniciais
                    currentSlideIndex = allSlides.length - duplicateCount * 2 + currentSlideIndex;
                    currentSlideIndex = totalOriginalSlides;
                    currentSlideIndex = allSlides.length - (duplicateCount + (duplicateCount - currentSlideIndex)); // Melhor cálculo para o final
                    
                    // Simplificando: Vai para o último slide real:
                    currentSlideIndex = totalOriginalSlides + (duplicateCount - 1); // Último índice real
                    currentSlideIndex = allSlides.length - (duplicateCount + 1); // Último slide real
                    
                    // O mais simples:
                    currentSlideIndex = allSlides.length - duplicateCount * 2; // Índice do último slide original
                    currentSlideIndex = allSlides.length - duplicateCount - 1; // Ajuste fino.
                    
                    // Índice do último slide real: allSlides.length - duplicateCount - 1
                    currentSlideIndex = totalOriginalSlides + (duplicateCount - 1);
                    currentSlideIndex = allSlides.length - duplicateCount * 2;

                    updateCarouselPosition(false);
                }
            }, 500); // 500ms é o tempo da transição no CSS
        }
        
        
        // --- Atualiza Estado Ativo e Formulário ---
        const activeIndex = (currentSlideIndex >= duplicateCount && currentSlideIndex < allSlides.length - duplicateCount)
                            ? currentSlideIndex
                            : (currentSlideIndex < duplicateCount ? duplicateCount : allSlides.length - duplicateCount - 1);
        
        allSlides.forEach((s, index) => {
            s.classList.remove('active');
            
            // A classe 'active' só deve ir para os slides reais 
            if (index === currentSlideIndex && !s.classList.contains('is-clone')) {
                s.classList.add('active');
                document.getElementById('selected-model').value = s.dataset.model;
                document.getElementById('selected-model-name').textContent = s.querySelector('h3').textContent;
            }
        });
    }

    // --- MANIPULADORES DE EVENTOS DE NAVEGAÇÃO ---
    
    // Botão Anterior
    prevButton.addEventListener('click', () => {
        // Permitimos ir para o clone inicial (índice 0)
        currentSlideIndex--;
        updateCarouselPosition();
    });

    // Botão Próximo
    nextButton.addEventListener('click', () => {
        // Permitimos ir para o clone final
        currentSlideIndex++;
        updateCarouselPosition();
    });
    
    // Lógica de Clique no Painel
    allSlides.forEach((slide, index) => {
        slide.addEventListener('click', function() {
            
            // Se for um clone, navegamos para o slide real correspondente
            if (this.classList.contains('is-clone')) {
                // Clones no final (primeiros slides reais clonados)
                if (index >= allSlides.length - duplicateCount) {
                    currentSlideIndex = duplicateCount; 
                } 
                // Clones no início (últimos slides reais clonados)
                else {
                    currentSlideIndex = allSlides.length - duplicateCount * 2 + index;
                }
            } else {
                currentSlideIndex = index;
            }

            // Centraliza o slide, atualiza o estado, e rola para o formulário
            updateCarouselPosition(); 

            // setTimeout(() => {
            //     detailedFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // }, 600);
        });
    });

    // --- FUNÇÕES GERAIS ---

    // 2. Rolagem Suave do Menu (Mantida)
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

    // 3. Simulação de Formulário (Mantida)
    const budgetForm = document.getElementById('budget-form');
    if (budgetForm) {
        budgetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Orçamento solicitado! Entraremos em contato via WhatsApp em breve.');
            budgetForm.reset();
        });
    }

    // 4. Lógica simples de Accordion (Mantida)
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
    
    // Inicialização: Garante que o carrossel comece no slide real sem animação
    window.addEventListener('load', () => {
        updateCarouselPosition(false); 
    });
});

