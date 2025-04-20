let visitLogged = false;
let currentLang = 'en';
let currentStepIndexState = 0;
const totalQuizSteps = 3;

// --- Translations Object ---
const translations = {
    en: {
        // ... keep existing English translations unchanged ...
    },
    ar: {
        // ... keep existing Arabic translations unchanged ...
    }
};

// --- Recommendations Data ---
const recommendationsData = {
    "Skin": ["service_derma", "service_anti_aging", "service_hifu", "service_skin_care"],
    "Energy": ["service_iv_therapy", "service_detox", "service_booster"],
    "Vitamins": ["service_iv_therapy", "service_booster"],
    "Weight Loss": ["service_iv_therapy", "service_booster"]
};

document.addEventListener('DOMContentLoaded', () => {
    const userSelections = { gender: null, need: null, age: 30 };
    const steps = [
        document.getElementById('step-0'),
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3'),
        document.getElementById('results-screen')
    ];

    // Language selection
    document.querySelectorAll('.lang-card').forEach(card => {
        card.addEventListener('click', (event) => {
            const lang = event.currentTarget.dataset.lang;
            applyTranslations(lang);
            showStep(1);
        });
    });

    // Gender/Need selection
    document.querySelectorAll('#step-1 .card, #step-2 .card').forEach(card => {
        card.addEventListener('click', handleCardSelection);
    });

    function handleCardSelection(event) {
        const card = event.currentTarget;
        const step = card.closest('.step');
        
        // Clear previous selections
        step.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        
        // Update selections
        if(step.id === 'step-1') userSelections.gender = card.dataset.value;
        if(step.id === 'step-2') userSelections.need = card.dataset.value;
        
        // Enable next button
        const nextBtn = step.querySelector('.btn-next');
        if(nextBtn) nextBtn.disabled = false;
    }

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        currentStepIndexState = stepIndex;
        updateProgressBar();
        window.scrollTo(0, 0);
    }

    function applyTranslations(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.title = translations[lang].page_title;

        // Update all translatable elements
        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.dataset.translateKey;
            const translation = translations[lang][key];
            
            if(el.tagName === 'INPUT') {
                el.placeholder = translation;
            } else if(el.tagName === 'LABEL') {
                el.textContent = translation;
                const input = document.getElementById(el.htmlFor);
                if(input) input.placeholder = translation;
            } else {
                const textNode = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
                textNode ? textNode.textContent = translation : el.textContent = translation;
            }
        });
        
        updateAgeDisplay();
        if(steps[4].classList.contains('active')) generateRecommendations();
    }

    function generateRecommendations() {
        const list = document.querySelector('#recommendations ul');
        list.innerHTML = '';
        const services = recommendationsData[userSelections.need] || [];
        
        services.forEach(serviceKey => {
            const li = document.createElement('li');
            li.textContent = translations[currentLang][serviceKey];
            list.appendChild(li);
        });
    }

    function updateProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        const progress = (currentStepIndexState / totalQuizSteps) * 100;
        
        if(progressBar) progressBar.style.width = `${progress}%`;
        if(progressText) {
            const text = translations[currentLang].progress_step
                .replace('{step}', currentStepIndexState)
                .replace('{total}', totalQuizSteps);
            progressText.textContent = text;
        }
    }

    function updateAgeDisplay() {
        const ageValue = document.getElementById('age-value');
        if(ageValue) {
            ageValue.innerHTML = `${userSelections.age} 
                <span data-translate-key="age_suffix">${translations[currentLang].age_suffix}</span>`;
        }
    }

    function checkFormSuccess() {
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.get('success') === '1') {
            document.getElementById('form-success-message').style.display = 'block';
            window.history.replaceState({}, '', window.location.pathname);
        }
    }

    // Navigation buttons
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => showStep(currentStepIndexState + 1));
    });
    
    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => showStep(currentStepIndexState - 1));
    });

    // Age slider
    const ageSlider = document.getElementById('age-slider');
    if(ageSlider) {
        ageSlider.addEventListener('input', (e) => {
            userSelections.age = e.target.value;
            updateAgeDisplay();
        });
    }

    // Form submission
    document.getElementById('booking-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('selected-gender').value = userSelections.gender;
        document.getElementById('selected-need').value = userSelections.need;
        document.getElementById('selected-age').value = userSelections.age;
        e.target.submit();
    });

    // Results button handler (event delegation)
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-submit')) {
            showStep(4);
            generateRecommendations();
        }
    });

    // Initialize progress bar visibility
    document.querySelector('.progress-indicator').style.visibility = 'visible';

    // Initialize
    showStep(0);
    checkFormSuccess();
});
