let visitLogged = false; // Flag to prevent multiple logs per session
let currentLang = 'en'; // Default language
let currentStepIndexState = 0; // Start at step 0 (language selection)
const totalQuizSteps = 3; // Gender, Need, Age (Quiz steps only

// --- Translations Object ---
const translations = {
    en: {
        // Meta
        page_title: "Premier Health Clinics - Find Your Best Self",
        // Step 0: Language
        lang_select_heading: "Choose your language:",
        lang_english: "English",
        lang_arabic: "العربية",
        // Step 1: Gender
        step1_heading: "First, tell us about you:",
        gender_male: "Male",
        gender_female: "Female",
        // Step 2: Need
        step2_heading: "What brings you here today?",
        need_skin: "Skin Concerns",
        need_energy: "Low Energy",
        need_vitamins: "Vitamins Deficiency",
        need_weight: "Weight Loss",
        // Step 3: Age
        step3_heading: "How young are you?",
        age_suffix: "years",
        // Buttons
        btn_next: "Next",
        btn_prev: "Previous",
        btn_results: "See My Results",
        btn_call: "Call Us Now",
        btn_whatsapp: "WhatsApp Us",
        btn_callback: "Request Callback",
        // Results
        results_heading: "Your Personalized Recommendations!",
        results_intro: "Based on your selections, we recommend the following:",
        results_contact_heading: "Ready to start your journey?",
        results_form_heading: "Or, request a callback:",
        // Form
        form_name: "Name:",
        form_phone: "Phone Number:",
        form_email: "Email:",
        form_success: "Thank you! We've received your request and will contact you soon.",
        // Progress
        progress_step: "Step {step} of {total}", // Placeholder pattern
        // Service Names (Keep English or use provided translations)
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
        // Arabic translations remain unchanged
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
    const userSelections = {
        gender: null,
        need: null,
        age: 30
    };

    // Step elements and progress indicator setup
    const step0 = document.getElementById('step-0');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const resultsScreen = document.getElementById('results-screen');
    const allStepElements = [step0, step1, step2, step3, resultsScreen].filter(el => el !== null);
    const progressIndicator = document.querySelector('.progress-indicator');

    if (allStepElements.length !== 5) {
        console.error("Missing step elements");
        return;
    }

    // -- Functions --
    function applyTranslations(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.title = translations[lang].page_title;

        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.dataset.translateKey;
            if (translations[lang][key]) {
                let textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                textNode ? textNode.textContent = translations[lang][key] : el.textContent = translations[lang][key];
            }
        });

        updateProgressBar();
        updateAgeDisplay();
        if (resultsScreen?.classList.contains('active')) generateRecommendations();
    }

    function updateAgeDisplay() {
        const ageValueSpan = document.getElementById('age-value');
        if (ageValueSpan) {
            ageValueSpan.innerHTML = `${userSelections.age} <span data-translate-key="age_suffix">${translations[currentLang].age_suffix}</span>`;
        }
    }

    function logInitialVisit() {
        if (visitLogged) return;
        console.log("Logging initial visit...");

        fetch('log_visit.php', {
            method: 'POST',
            body: new FormData()
        })
        .then(response => response.json())
        .then(data => {
            if (data?.status === 'success') {
                visitLogged = true;
            }
        })
        .catch(error => console.error("Error logging visit:", error));
    }

    // Rest of the functions remain unchanged except phone-related code removed
    // [Other functions (updateProgressBar, showStep, handleCardSelection, etc.) 
    //  remain identical to previous version but with phone-related code removed]

    // -- Event Listeners --
    document.querySelectorAll('.lang-card').forEach(card => {
        card.addEventListener('click', (event) => {
            const selectedLang = event.currentTarget.dataset.lang;
            console.log(`Language selected: ${selectedLang}`);
            
            applyTranslations(selectedLang);
            
            requestAnimationFrame(() => {
                showStep(1);
                setTimeout(logInitialVisit, 100);
            });
        });
    });

    // Rest of the event listeners remain unchanged
    // [Quiz cards, age slider, navigation buttons etc. unchanged]
    
    // Initial setup
    showStep(0);
    checkFormSuccess();
});
