let visitLogged = false; // Flag to prevent multiple logs per session
let currentLang = 'en'; // Default language
let currentStepIndexState = 0; // Start at step 0 (language selection)
const totalQuizSteps = 3; // Gender, Need, Age (Quiz steps only)

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
        service_derma: "Derma", // Assuming keep English
        service_anti_aging: "ANTI-AGING THERAPY",
        service_hifu: "HIFU", // Assuming keep English
        service_skin_care: "SKIN CARE",
        service_iv_therapy: "IV NUTRIENT THERAPY",
        service_detox: "Detox Therapy",
        service_booster: "BOOSTER SHOTS",
        contact_for_consultation: "Please contact us for a consultation." // Added fallback key
    },
    ar: {
        // Meta
        page_title: "بريمير كلينكس - اكتشف أفضل نسخة منك", // Example Title
        // Step 0: Language
        lang_select_heading: "اختر لغتك:",
        lang_english: "English",
        lang_arabic: "العربية",
        // Step 1: Gender
        step1_heading: "أولاً، أخبرنا عنك:",
        gender_male: "ذكر",
        gender_female: "أنثى",
        // Step 2: Need
        step2_heading: "ما الذي أتى بك إلى هنا اليوم؟",
        need_skin: "مشاكل البشرة",
        need_energy: "طاقة منخفضة",
        need_vitamins: "نقص الفيتامينات",
        need_weight: "فقدان الوزن",
        // Step 3: Age
        step3_heading: "كم عمرك؟",
        age_suffix: "سنة",
        // Buttons
        btn_next: "التالي",
        btn_prev: "السابق",
        btn_results: "عرض نتائجي",
        btn_call: "اتصل بنا الآن",
        btn_whatsapp: "راسلنا واتساب",
        btn_callback: "طلب معاودة الاتصال",
        // Results
        results_heading: "توصياتك المخصصة!",
        results_intro: "بناءً على اختياراتك، نوصي بما يلي:",
        results_contact_heading: "هل أنت مستعد لبدء رحلتك؟",
        results_form_heading: "أو، اطلب معاودة الاتصال:",
        // Form
        form_name: "الاسم:",
        form_phone: "رقم الهاتف:",
        form_email: "البريد الإلكتروني:",
        form_success: "شكراً لك! لقد تلقينا طلبك وسوف نتصل بك قريباً.",
        // Progress
        progress_step: "الخطوة {step} من {total}", // Placeholder pattern
        // Service Names (Using machine translations - REVIEW NEEDED)
        service_derma: "ديرما", // Transliteration
        service_anti_aging: "علاج مقاومة الشيخوخة",
        service_hifu: "هايفو", // Transliteration
        service_skin_care: "العناية بالبشرة",
        service_iv_therapy: "العلاج بالمغذيات الوريدية",
        service_detox: "علاج الديتوكس", // Or "علاج إزالة السموم"
        service_booster: "الحقن المعززة",
        contact_for_consultation: "يرجى الاتصال بنا للحصول على استشارة." // Added fallback key
    }
};

// --- Recommendations Data (Using keys for translation lookup) ---
const recommendationsData = {
    "Skin": ["service_derma", "service_anti_aging", "service_hifu", "service_skin_care"],
    "Energy": ["service_iv_therapy", "service_detox", "service_booster"],
    "Vitamins": ["service_iv_therapy", "service_booster"],
    "Weight Loss": ["service_iv_therapy", "service_booster"]
};


document.addEventListener('DOMContentLoaded', () => {
    // --- Global State (Inside DOMContentLoaded) ---
     const userSelections = {
        gender: null,
        need: null,
        age: 30 // Default age
    };

    // --- Get References to Step Elements ---
    const step0 = document.getElementById('step-0');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const resultsScreen = document.getElementById('results-screen');
    const allStepElements = [step0, step1, step2, step3, resultsScreen].filter(el => el !== null);
    const progressIndicator = document.querySelector('.progress-indicator');

    if (allStepElements.length !== 5) {
        console.error("CRITICAL ERROR: Not all step elements (step-0, step-1, step-2, step-3, results-screen) were found.");
        return;
    }

    // --- Functions ---

    // Function to apply translations
    function applyTranslations(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.title = translations[lang].page_title;

        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.dataset.translateKey;
            if (translations[lang][key]) {
                let textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '');
                if (textNode) {
                    textNode.textContent = translations[lang][key];
                } else {
                    el.textContent = translations[lang][key];
                }
            } else {
                console.warn(`Translation key not found for language '${lang}': ${key}`);
            }
        });

        updateProgressBar(); // Update progress text pattern
        updateAgeDisplay(); // Update age display with new suffix

        if (resultsScreen && resultsScreen.classList.contains('active')) {
            generateRecommendations();
        }
    }

    // Function to update only the age display text
    function updateAgeDisplay() {
        const ageValueSpan = document.getElementById('age-value');
        const ageSlider = document.getElementById('age-slider');
        if (ageValueSpan && ageSlider) {
            userSelections.age = ageSlider.value;
            ageValueSpan.innerHTML = `${userSelections.age} <span data-translate-key="age_suffix">${translations[currentLang].age_suffix}</span>`;
        } else if (ageValueSpan) {
             ageValueSpan.innerHTML = `${userSelections.age} <span data-translate-key="age_suffix">${translations[currentLang].age_suffix}</span>`;
        }
    }


    // Function to log the initial visit (now accepts phone number)
    function logInitialVisit(phoneNumber = null) {
        if (visitLogged) return;
        console.log("Attempting to log initial visit...", phoneNumber ? `Phone: ${phoneNumber}` : "(No phone)");

        const formData = new FormData();
        if (phoneNumber) {
            formData.append('phoneNumber', phoneNumber);
        }

        fetch('log_visit.php', {
            method: 'POST',
            body: formData // Send form data
        })
        .then(response => response.json()) // Expect JSON response now
        .then(data => {
             if (data && data.status === 'success') {
                 console.log("Visit logged successfully:", data.message);
                 visitLogged = true;
             } else {
                 console.error(`Failed to log visit. Status: ${data?.status}. Message:`, data?.message || 'Unknown error');
             }
         })
        .catch(error => console.error("Error logging visit:", error));
    }

    function updateProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        if (!progressBar || !progressText) return;

        // Quiz step number is currentStepIndexState - 1 (since step 0 is lang select)
        const quizStepNumber = currentStepIndexState > 0 ? currentStepIndexState - 1 : 0;
        const progress = quizStepNumber > 0 && quizStepNumber <= totalQuizSteps
                       ? ((quizStepNumber / totalQuizSteps) * 100)
                       : (quizStepNumber > totalQuizSteps ? 100 : 0);

        progressBar.style.width = `${progress}%`;

        // Use currentLang safely as it's defined globally
        const stepPattern = translations[currentLang]?.progress_step || "Step {step} of {total}";

        // Show progress text only for actual quiz steps (1, 2, 3)
        if (currentStepIndexState > 0 && currentStepIndexState <= totalQuizSteps) {
             progressText.textContent = stepPattern
                .replace('{step}', quizStepNumber) // Use quizStepNumber here
                .replace('{total}', totalQuizSteps);
             progressText.style.visibility = 'visible';
        } else {
            progressText.style.visibility = 'hidden'; // Hide on step 0 and results
        }
    }

    function showStep(stepIndexToShow) {
        console.log(`Showing step: ${stepIndexToShow}`);
        currentStepIndexState = stepIndexToShow; // Update state

        allStepElements.forEach((stepElement) => {
            // Ensure element exists before trying to access properties
            if (!stepElement || !stepElement.classList) {
                 console.error(`Error: Found null or invalid element in allStepElements during showStep.`);
                 return; // Skip this iteration
            }

            const stepId = stepElement.id;
            let shouldBeActive = false;

            // Determine if this element should be active based on stepIndexToShow and its ID
            if (stepIndexToShow === 0 && stepId === 'step-0') {
                shouldBeActive = true;
            } else if (stepIndexToShow === 1 && stepId === 'step-1') {
                shouldBeActive = true;
            } else if (stepIndexToShow === 2 && stepId === 'step-2') {
                shouldBeActive = true;
            } else if (stepIndexToShow === 3 && stepId === 'step-3') {
                shouldBeActive = true;
            } else if (stepIndexToShow === totalQuizSteps + 1 && stepId === 'results-screen') { // Results step (index 4)
                shouldBeActive = true;
            }

            // Add or remove 'active' class
            if (shouldBeActive) {
                stepElement.classList.add('active');
                console.log(`Activated step element: ${stepElement.id}`);
                // Process results only when activating the results screen
                if (stepId === 'results-screen') {
                    generateRecommendations();
                    populateHiddenFields();
                }
            } else {
                stepElement.classList.remove('active');
            }
        });

        // Show/hide progress indicator based on step
        if (progressIndicator) {
            // Show only for quiz steps 1, 2, 3
            progressIndicator.style.visibility = (stepIndexToShow > 0 && stepIndexToShow <= totalQuizSteps) ? 'visible' : 'hidden';
        }

        updateProgressBar(); // Update progress based on the new state
        window.scrollTo(0, 0); // Scroll to top
        console.log(`Finished showStep for index: ${stepIndexToShow}`);
    }


    function handleCardSelection(event) {
        const selectedCard = event.currentTarget;
        const stepElement = selectedCard.closest('.step');
        if (!stepElement) return;

        const options = stepElement.querySelectorAll('.card');
        const nextButton = stepElement.querySelector('.btn-next');

        options.forEach(opt => {
             if (opt && opt.classList) opt.classList.remove('selected');
        });
        if (selectedCard && selectedCard.classList) selectedCard.classList.add('selected');

        const stepId = stepElement.id;
        const value = selectedCard.dataset.value;
        // Use userSelections defined within DOMContentLoaded scope
        if (stepId === 'step-1') userSelections.gender = value;
        else if (stepId === 'step-2') userSelections.need = value;

        if (nextButton) nextButton.disabled = false;
    }

    function generateRecommendations() {
        const recommendationsList = document.querySelector('#recommendations ul');
        if (!recommendationsList) return;
        recommendationsList.innerHTML = '';

        // Use userSelections defined within DOMContentLoaded scope
        const selectedNeed = userSelections.need;
        const serviceKeys = recommendationsData[selectedNeed] || [];

        if (serviceKeys.length === 0) {
             const li = document.createElement('li');
             li.textContent = translations[currentLang]['contact_for_consultation'] || "Please contact us for a consultation.";
             recommendationsList.appendChild(li);
             return;
        }

        serviceKeys.forEach(serviceKey => {
            const li = document.createElement('li');
            li.textContent = translations[currentLang][serviceKey] || serviceKey.replace('service_', '').replace('_', ' ').toUpperCase();
            recommendationsList.appendChild(li);
        });
    }

     function populateHiddenFields() {
        const hiddenGender = document.getElementById('selected-gender');
        const hiddenNeed = document.getElementById('selected-need');
        const hiddenAge = document.getElementById('selected-age');
        // Use userSelections defined within DOMContentLoaded scope
        if (hiddenGender) hiddenGender.value = userSelections.gender || '';
        if (hiddenNeed) hiddenNeed.value = userSelections.need || '';
        if (hiddenAge) hiddenAge.value = userSelections.age;
    }

    function checkFormSuccess() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === '1') {
            const formSuccessMessage = document.getElementById('form-success-message');
            const results = document.getElementById('results-screen');

            if (formSuccessMessage) {
                const successKey = formSuccessMessage.dataset.translateKey;
                if (successKey && translations[currentLang][successKey]) {
                    formSuccessMessage.textContent = translations[currentLang][successKey];
                }

                if (results) {
                     showStep(totalQuizSteps + 1);
                     formSuccessMessage.style.display = 'block';
                     formSuccessMessage.scrollIntoView({ behavior: 'smooth' });
                } else {
                     console.warn("Results screen not found when trying to show success message.");
                     formSuccessMessage.style.display = 'block';
                }

                 if (typeof snaptr === 'function') {
                     snaptr('track', 'SIGN_UP', {
                         'description': 'Callback Form Submitted Successfully'
                     });
                     console.log('Snap Pixel: Tracked SIGN_UP (Callback Request)');
                 }

            } else {
                 console.warn("Form success message element not found.");
            }
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    // --- Event Listeners Setup ---
    console.log("Setting up listeners...");

    // Language Selection Cards
    document.querySelectorAll('.lang-card').forEach(card => {
        card.addEventListener('click', (event) => {
            const selectedLang = event.currentTarget.dataset.lang;
            const initialPhoneInput = document.getElementById('initial-phone');
            const phoneNumber = initialPhoneInput?.value?.trim() || null;

            console.log(`Language selected: ${selectedLang}`);
            
            // Immediate visual feedback
            applyTranslations(selectedLang);
            
            // Handle phone input visibility
            const phoneContainer = document.querySelector('.phone-input-container');
            if (phoneContainer) {
                phoneContainer.style.display = 'none';
            }

            // Force DOM update before step transition
            requestAnimationFrame(() => {
                showStep(1); // Move to step 1 (Gender)
                
                // Log visit after visual transition
                setTimeout(() => logInitialVisit(phoneNumber), 100);
            });
        });
    });

    // Quiz Cards
    document.querySelectorAll('#step-1 .card, #step-2 .card').forEach(card => card.addEventListener('click', handleCardSelection));

    // Age Slider
    const ageSlider = document.getElementById('age-slider');
    const ageValueSpan = document.getElementById('age-value');
    if (ageSlider && ageValueSpan) {
        // Sync initial state and display
        userSelections.age = ageSlider.value; // Use userSelections from this scope
        updateAgeDisplay(); // Use function to set initial display correctly

        ageSlider.addEventListener('input', () => {
            // Update state and display on slider change
            updateAgeDisplay();
        });
        console.log("Age slider listener attached.");
    } else {
         console.warn("Age slider or value span not found.");
    }

    // Navigation Buttons
    document.querySelectorAll('.btn-next').forEach(button => {
        button.addEventListener('click', () => {
            if (currentStepIndexState < totalQuizSteps + 1) {
                showStep(currentStepIndexState + 1);
            }
        });
    });
    document.querySelectorAll('.btn-prev').forEach(button => {
        button.addEventListener('click', () => {
            if (currentStepIndexState > 1) { // Can only go back if not on step 0 or 1
                showStep(currentStepIndexState - 1);
            }
        });
    });
    document.querySelectorAll('.btn-submit').forEach(button => {
        button.addEventListener('click', () => showStep(totalQuizSteps + 1));
    });

    // Contact Buttons (Snap Pixel)
    const callBtn = document.getElementById('call-btn');
    if (callBtn) {
        callBtn.addEventListener('click', () => {
            if (typeof snaptr === 'function') {
                snaptr('track', 'CONTACT', { 'description': 'Clicked Call Button' });
                console.log('Snap Pixel: Tracked CONTACT (Call)');
            }
        });
    }
    const whatsappBtn = document.getElementById('whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            if (typeof snaptr === 'function') {
                snaptr('track', 'CONTACT', { 'description': 'Clicked WhatsApp Button' });
                console.log('Snap Pixel: Tracked CONTACT (WhatsApp)');
            }
        });
    }

    console.log("Listeners set up.");

    // --- Initial Setup ---
    console.log("Initial setup: Calling showStep(0).");
    showStep(0); // Show language selection step initially
    // logInitialVisit(); // REMOVED - Logging now happens on language selection
    checkFormSuccess(); // Check for success message

});
