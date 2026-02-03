// i18n.js - Internationalization module
let translations = {};
let currentLanguage = 'ru';

// Load translations from JSON file
async function loadTranslations(lang) {
    try {
        const response = await fetch(`./lang/${lang}.json`);
        const data = await response.json();
        translations[lang] = data;
        return data;
    } catch (error) {
        console.error(`Error loading translations for ${lang}:`, error);
        return null;
    }
}

// Function to change language
async function changeLanguage(lang) {
    // Load translations if not already loaded
    if (!translations[lang]) {
        await loadTranslations(lang);
    }
    
    if (!translations[lang]) {
        console.error(`Translations for ${lang} not found`);
        return;
    }
    
    currentLanguage = lang;
    const elements = document.querySelectorAll('[data-key]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            // Handle special cases for elements with links
            if (key.includes('-desc') && (key.includes('edu') || key.includes('extra'))) {
                const linkElement = element.querySelector('a[download]');
                if (linkElement) {
                    const linkText = translations[lang]['diploma-link'];
                    element.innerHTML = translations[lang][key] + `<a download href="${linkElement.href}" data-key="diploma-link">${linkText}</a>`;
                }
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
    
    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
    
    // Update toggle state
    const toggle = document.getElementById('language-toggle');
    if (toggle) {
        toggle.checked = (lang === 'en');
    }
}

// Function to load saved language preference
async function loadLanguagePreference() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'ru';
    await changeLanguage(savedLang);
}

// Initialize
async function initI18n() {
    // Preload both languages
    await Promise.all([
        loadTranslations('ru'),
        loadTranslations('en')
    ]);
    
    // Load saved preference
    await loadLanguagePreference();
    
    // Language toggle functionality
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
        languageToggle.addEventListener('change', function() {
            const newLang = this.checked ? 'en' : 'ru';
            changeLanguage(newLang);
        });
    }
}

// Export for use in other scripts
window.i18n = {
    init: initI18n,
    changeLanguage: changeLanguage,
    getCurrentLanguage: () => currentLanguage
};
