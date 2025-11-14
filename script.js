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

    const detailedBudgetForm = document.getElementById('budget-form'); 
    if (detailedBudgetForm) {
        detailedBudgetForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const modelo = document.getElementById('selected-model').value;
            const corAba = document.getElementById('aba-cor').value;
            const corFrente = document.getElementById('frente-cor').value;
            const corLateral = document.getElementById('lateral-cor').value;
            const quantidade = document.getElementById('quantidade').value;
            const nome = document.getElementById('name-detailed').value;
            
            const numeroWhatsApp = "5584998386000";
            
            let mensagem = `Olá, me chamo ${nome}, tenho interesse em ter um `;
            
            mensagem += `modelo *${modelo.toUpperCase()}*`;
            mensagem += ` (${quantidade} unidades). Esses são os detalhes do modelo:\n\n`;
            
            mensagem += `-Cor da Aba: ${corAba || 'Não especificada'}\n`;
            mensagem += `-Cor da Frente: ${corFrente || 'Não especificada'}\n`;
            mensagem += `-Cor das Laterais: ${corLateral || 'Não especificada'}\n\n`;

            mensagem += `*A logomarca para o boné será enviada por mim logo após este contato.`;

            const mensagemFormatada = encodeURIComponent(mensagem);

            const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagemFormatada}`;
            
            window.open(urlWhatsApp, '_blank');
            
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

    // --- LÓGICA DO FORMULÁRIO MULTI-ETAPAS (WIZARD) ---

    const form = document.getElementById('multi-step-form');
    const stepContainer = document.getElementById('form-steps-container');
    const steps = document.querySelectorAll('.form-step');
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    const currentStepInput = document.getElementById('current-step');

    let currentStep = parseInt(currentStepInput.value); // Inicia na Etapa 1
    const totalSteps = steps.length; // 5 etapas

    // Variável para armazenar os dados finais (para envio por e-mail/WhatsApp)
    const collectedData = {};


    // --- FUNÇÕES DE NAVEGAÇÃO E ESTADO ---

    // Atualiza o estado visual do formulário (botões, etapas)
    function updateFormState() {
        // Esconde todos, mostra apenas o atual
        steps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.dataset.step) === currentStep) {
                step.classList.add('active');
            }
        });

        // 1. Atualiza o texto do botão "Próximo"
        if (currentStep === totalSteps) {
            nextBtn.textContent = 'Solicitar Orçamento';
        } else {
            nextBtn.textContent = 'Próximo';
        }

        // 2. Controla a visibilidade do botão "Voltar"
        if (currentStep > 1) {
            backBtn.style.display = 'block';
        } else {
            backBtn.style.display = 'none';
        }
        
        // 3. Atualiza a contagem de etapas no label (ex: Etapa 4 de 5)

        // const currentStepLabel = document.querySelector(`.form-step[data-step="${currentStep}"] label`);
        // if (currentStepLabel && currentStepLabel.id !== 'lead-email' && currentStepLabel.id !== 'lead-name') {
        //     currentStepLabel.textContent = currentStepLabel.textContent.replace(/\(Etapa \d+ de \d+\)/, '').trim() + ` (Etapa ${currentStep} de ${totalSteps})`;
        // }

        // 4. Salva o estado atual
        currentStepInput.value = currentStep;
    }

    // Coleta os dados da etapa atual e valida
    function validateAndCollectData(step) {
        const inputs = step.querySelectorAll('input, select');
        let isValid = true;
        
        inputs.forEach(input => {
            // Validação básica de campo obrigatório
            if (input.hasAttribute('required') && input.value.trim() === '') {
                isValid = false;
                input.focus();
            }
            // Coleta de dados
            collectedData[input.name] = input.value.trim();
        });

        // Coleta o DDI separadamente do input hidden
        if (currentStep === 1) {
            collectedData['ddi'] = document.getElementById('ddi-hidden-input').value;
        }

        // Validação especial para o campo de arquivo (Etapa 5)
        if (currentStep === 5 && !document.getElementById('logo-upload-input').files.length) {
            // Logomarca é obrigatória? Se sim, descomente a linha abaixo.
            // isValid = false; 
        }
        
        return isValid;
    }

    // --- MANIPULADORES DE EVENTOS ---

    // Navegação para TRÁS
    backBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateFormState();
        }
    });

    // Manipulador de SUBMISSÃO (Próximo / Solicitar Orçamento)
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        
        // 1. Valida a etapa atual
        if (!validateAndCollectData(currentStepElement)) {
            alert("Por favor, preencha o campo obrigatório.");
            return;
        }

        // 2. Se não for a etapa final, avança
        if (currentStep < totalSteps) {
            currentStep++;
            updateFormState();
            return;
        }

        // 3. SE FOR A ETAPA FINAL (Solicitar Orçamento)
        sendFinalSubmission(collectedData);
    });


    // --- FUNÇÃO DE ENVIO FINAL ---
    function sendFinalSubmission(data) {
        const numeroWhatsApp = "5584998386000"; 
        
        let mensagem = `Olá! Meu nome é ${data.lead_name} e gostaria de solicitar um layout. \n`;
        mensagem += `Email de contato: ${data.lead_email}\n`;
        mensagem += `Telefone: ${data.ddi} ${data.whatsapp_number}\n\n`;
        
        mensagem += `--- INFORMAÇÕES DO PEDIDO ---\n`;
        mensagem += `- Quantidade Desejada: ${data.lead_quantity}\n`;
        mensagem += `- Arquivo da Logo: Será enviado a seguir. \n\n`;
        
        mensagem += `Aguardo o seu contato para continuarmos o orçamento!`;

        const mensagemFormatada = encodeURIComponent(mensagem);
        const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagemFormatada}`;
        
        // Abre o link do WhatsApp
        window.open(urlWhatsApp, '_blank');
        
        // Simulação de envio de e-mail (necessita de um backend real)
        console.log("Dados Coletados para E-mail:", data);

        alert("Seu pedido de layout foi enviado! Você será redirecionado para o WhatsApp para confirmar o envio da logo.");
        form.reset();
        currentStep = 1; // Volta para a primeira etapa após o envio
        updateFormState();
    }


    // --- LÓGICA DE UPLOAD (Apenas para exibir o nome do arquivo) ---
    const logoUploadInput = document.getElementById('logo-upload-input');
    const fileNameDisplay = document.getElementById('file-name-display');

    logoUploadInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileNameDisplay.textContent = `Arquivo: ${this.files[0].name}`;
        } else {
            fileNameDisplay.textContent = 'Nenhum arquivo selecionado.';
        }
    });

    // --- EXECUÇÃO INICIAL ---
    updateFormState();

    const ddiHeader = document.getElementById('ddi-header');
    const ddiOptionsContainer = document.getElementById('ddi-options');
    const ddiOptions = document.querySelectorAll('.dynamic-select-option');
    const ddiHiddenInput = document.getElementById('ddi-hidden-input');
    const headerFlag = document.getElementById('header-flag');
    const headerText = document.getElementById('header-text');
    const whatsappNumberInput = document.getElementById('whatsapp-number');
    const leadForm = document.getElementById('whatsapp-lead-form');

    function toggleDdiDropdown() {
        if (ddiOptionsContainer.style.display === 'block') {
            ddiOptionsContainer.style.display = 'none';
            ddiHeader.classList.remove('dynamic-select-header-active');
        } else {
            ddiOptionsContainer.style.display = 'block';
            ddiHeader.classList.add('dynamic-select-header-active');
        }
    }

    ddiHeader.addEventListener('click', toggleDdiDropdown);

    function updatePhonePlaceholder(ddi) {
        const input = whatsappNumberInput;
        let placeholderText = '(99) 9 9999-9999';
        let maxLength = 11;
        
        // Brasil (+55) - Formato: (XX) XXXXX-XXXX
        if (ddi === '+55') {
            placeholderText = '(99) 9 9999-9999';
            maxLength = 11; 
        }
        // Portugal (+351) - Formato: XXX XXX XXX
        else if (ddi === '+351') {
            placeholderText = '999 999 999';
            maxLength = 9;
        }
        // Estados Unidos (+1) - Formato: X (XXX) XXX-XXXX
        else if (ddi === '+1') {
            placeholderText = '(999) 999-9999';
            maxLength = 10;
        }
        // Argentina (+54) - Formato: XXXX XXX XXXX
        else if (ddi === '+54') {
            placeholderText = '9 999 999 9999';
            maxLength = 11; 
        }
        
        input.value = ''; 
        
        input.placeholder = placeholderText; 
        
        input.setAttribute('maxlength', maxLength + 4); 
    }

    ddiOptions.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const countryCode = this.getAttribute('data-country');
            const text = this.getAttribute('data-text');
            
            ddiHiddenInput.value = value;
            
            headerText.textContent = text;
            headerFlag.className = 'fi'; 
            headerFlag.classList.add(`fi-${countryCode}`);
            
            updatePhonePlaceholder(value);

            toggleDdiDropdown();
        });
    });

    document.addEventListener('click', function(e) {
        if (!ddiHeader.contains(e.target) && !ddiOptionsContainer.contains(e.target)) {
            if (ddiOptionsContainer.style.display === 'block') {
                toggleDdiDropdown();
            }
        }
    });

    whatsappNumberInput.addEventListener('input', function() {
        const ddiValue = document.getElementById('ddi-hidden-input').value;
        
        let value = this.value.replace(/\D/g, '');
        let maskedValue = '';

        if (ddiValue === '+55') {
            value = value.substring(0, 11); 

            if (value.length > 0) maskedValue += `(${value.substring(0, 2)}`;
            if (value.length > 2) maskedValue += `) ${value.substring(2, 7)}`;
            if (value.length > 7) maskedValue += `-${value.substring(7, 11)}`;
        }
        
        else if (ddiValue === '+351') {
            value = value.substring(0, 9);

            if (value.length > 0) maskedValue += `${value.substring(0, 3)}`;
            if (value.length > 3) maskedValue += ` ${value.substring(3, 6)}`;
            if (value.length > 6) maskedValue += ` ${value.substring(6, 9)}`;
        }
        
        else if (ddiValue === '+1') {
            value = value.substring(0, 10);

            if (value.length > 0) maskedValue += `(${value.substring(0, 3)}`;
            if (value.length > 3) maskedValue += `) ${value.substring(3, 6)}`;
            if (value.length > 6) maskedValue += `-${value.substring(6, 10)}`;
        }

        else if (ddiValue === '+54') {
            value = value.substring(0, 11);
            
            if (value.length > 0) maskedValue += `${value.substring(0, 1)}`;
            if (value.length > 1) maskedValue += ` (${value.substring(1, 4)}`;
            if (value.length > 4) maskedValue += `) ${value.substring(4, 7)}`;
            if (value.length > 7) maskedValue += `-${value.substring(7, 11)}`;
        }
        
        else {
            if (value.length > 0) maskedValue = value;
        }

        this.value = maskedValue;
    });

    leadForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const ddi = ddiSelect.value;
        const number = whatsappNumberInput.value.replace(/\D/g, '');
        const fullNumber = ddi + number;
        
        console.log("Número Completo para Envio:", fullNumber);
        
        alert(`Seu layout está sendo preparado! Entraremos em contato no WhatsApp: ${fullNumber}`);
        
        leadForm.reset();
        updateFlagDisplay(); 
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

