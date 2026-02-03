// app.js - Main application logic
document.addEventListener("DOMContentLoaded", async function () {
    // Initialize internationalization
    await window.i18n.init();
    
    // PDF generation functionality
    const downloadButton = document.querySelector(".download");
    if (downloadButton) {
        downloadButton.addEventListener("click", function (e) {
            e.preventDefault();
            const element = document.querySelector(".container");
            
            // Add pdf-mode class to hide specific elements
            document.body.classList.add('pdf-mode');
            
            const currentLang = window.i18n.getCurrentLanguage();
            const opt = {
                margin: 0.3,
                filename: currentLang === 'en' ? 'Resume.pdf' : 'Резюме.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 1.5,
                    useCORS: true,
                    allowTaint: true,
                    letterRendering: true,
                    logging: false,
                    scrollX: 0,
                    scrollY: 0
                },
                jsPDF: { 
                    unit: 'in', 
                    format: 'a4', 
                    orientation: 'portrait'
                }
            };
            
            html2pdf().from(element).set(opt).save().then(() => {
                // Remove pdf-mode class after PDF generation
                document.body.classList.remove('pdf-mode');
            });
        });
    }

    // Certificate links error handling
    function checkFileExists(url) {
        return fetch(url, {method: 'HEAD'}).then(res => res.ok);
    }

    // Add error handling to download links
    const downloadLinks = document.querySelectorAll('a[download]');
    downloadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            checkFileExists(href).then(exists => {
                if (!exists) {
                    e.preventDefault();
                    alert('Файл временно недоступен. Пожалуйста, свяжитесь со мной для получения диплома.');
                }
            }).catch(() => {
                // If fetch fails, let the download proceed
                console.log('Unable to check file existence, proceeding with download');
            });
        });
    });
});
