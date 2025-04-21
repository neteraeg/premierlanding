let currentLang = 'en';
let currentStepIndexState = 0;
const totalQuizSteps = 3;

// --- Translations Object ---
const translations = {
    en: {
        page_title: "Premier Health Clinics - Find Your Best Self",
        lang_select_heading: "Choose your language:",
        lang_english: "English",
        lang_arabic: "العربية",
        step1_heading: "First, tell us about you:",
        gender_male: "Male",
        gender_female: "Female",
        step2_heading: "What brings you here today?",
        need_skin: "Skin Concerns",
        need_energy: "Low Energy",
        need_vitamins: "Vitamins Deficiency",
        need_weight: "Weight Loss",
        step3_heading: "How young are you?",
        age_suffix: "years",
        btn_next: "Next",
        btn_prev: "Previous",
        btn_results: "See My Results",
        btn_call: "Call Us Now",
        btn_whatsapp: "WhatsApp Us",
        btn_callback: "Request Callback",
        results_heading: "Your Personalized Recommendations!",
        results_intro: "Based on your selections, we recommend the following:",
        results_contact_heading: "Ready to start your journey?",
        results_form_heading: "Or, request a callback:",
        form_name: "Name:",
        form_phone: "Phone Number:",
        form_email: "Email:",
        form_success: "Thank you! We've received your request and will contact you soon.",
        progress_step: "Step {step} of {total}",
        service_derma: "Derma", 
        service_anti_aging: "ANTI-AGING THERAPY",
        service_hifu: "HIFU",
        service_skin_care: "SKIN CARE",
        service_iv_therapy: "IV NUTRIENT THERAPY",
        service_detox: "Detox Therapy",
        service_booster: "BOOSTER SHOTS",
        contact_for_consultation: "Please contact us for a consultation."
    },
    ar: {
        page_title: "بريمير كلينكس - اكتشف أفضل نسخة منك",
        lang_select_heading: "اختر لغتك:",
        lang_english: "English",
        lang_arabic: "العربية",
        step1_heading: "أولاً، أخبرنا عنك:",
        gender_male: "ذكر",
        gender_female: "أنثى",
        step2_heading: "ما الذي أتى بك إلى هنا اليوم؟",
        need_skin: "مشاكل البشرة",
        need_energy: "طاقة منخفضة",
        need_vitamins: "نقص الفيتامينات",
        need_weight: "فقدان الوزن",
        step3_heading: "كم عمرك؟",
        age_suffix: "سنة",
        btn_next: "التالي",
        btn_prev: "السابق",
        btn_results: "عرض نتائجي",
        btn_call: "اتصل بنا الآن",
        btn_whatsapp: "راسلنا واتساب",
        btn_callback: "طلب معاودة الاتصال",
        results_heading: "توصياتك المخصصة!",
        results_intro: "بناءً على اختياراتك، نوصي بما يلي:",
        results_contact_heading: "هل أنت مستعد لبدء رحلتك؟",
        results_form_heading: "أو، اطلب معاودة الاتصال:",
        form_name: "الاسم:",
        form_phone: "رقم الهاتف:",
        form_email: "البريد الإلكتروني:",
        form_success: "شكراً لك! لقد تلقينا طلبك وسوف نتصل بك قريباً.",
        progress_step: "الخطوة {step} من {total}",
        service_derma: "ديرما",
        service_anti_aging: "علاج مقاومة الشيخوخة",
        service_hifu: "هايفو",
        service_skin_care: "العناية بالبشرة",
        service_iv_therapy: "العلاج بالمغذيات الوريدية",
        service_detox: "علاج الديتوكس",
        service_booster: "الحقن المعززة",
        contact_for_consultation: "يرجى الاتصال بنا للحصول على استشارة."
    }
};

// --- Recommendations Data ---
const recommendationsData = {
    "Skin": ["service_derma", "service_anti_aging", "service_hifu", "service_skin_care"],
    "Energy": ["service_iv_therapy", "service_detox", "service_booster"],
    "Vitamins": ["service_iv_therapy", "service_booster"],
    "Weight Loss": ["service_iv_therapy", "service_booster"]
};

document.addEventListener('DOMContentLoaded', async () => {
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

    // Results button handler (event delegation)
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-submit')) {
            showStep(4);
            generateRecommendations();
        }
    });

    // Initialize progress bar visibility
    document.querySelector('.progress-indicator').style.visibility = 'visible';

    // Initialize translations first
    applyTranslations(currentLang);
    showStep(0);
});
