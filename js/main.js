/**
 * Lidia Chávez - Scripts Compartidos
 * Manejo de navegación responsiva, acordeones accesibles y tracking de conversiones de WhatsApp.
 */

// Menú hamburguesa móvil
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const toggleBtn = document.querySelector('.menu-toggle');
    if (navLinks && toggleBtn) {
        navLinks.classList.toggle('active');
        toggleBtn.classList.toggle('active');
    }
}

function closeMenu() {
    const navLinks = document.getElementById('navLinks');
    const toggleBtn = document.querySelector('.menu-toggle');
    if (navLinks && toggleBtn) {
        navLinks.classList.remove('active');
        toggleBtn.classList.remove('active');
    }
}

// Acordeón FAQ accesible por teclado
function toggleFaq(buttonElement) {
    const faqItem = buttonElement.closest('.faq-item');
    if (!faqItem) return;

    const isExpanded = buttonElement.getAttribute('aria-expanded') === 'true';
    
    // Cerrar otros acordeones si se prefiere comportamiento exclusivo
    const allItems = document.querySelectorAll('.faq-item');
    allItems.forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
            const btn = item.querySelector('.faq-question');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }
    });

    // Alternar el acordeón actual
    if (isExpanded) {
        buttonElement.setAttribute('aria-expanded', 'false');
        faqItem.classList.remove('active');
    } else {
        buttonElement.setAttribute('aria-expanded', 'true');
        faqItem.classList.add('active');
    }
}

// Tracking de clics en WhatsApp con etiqueta de analítica
function trackWaClick(eventLabel) {
    if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
            'send_to': 'AW-18297301316/OBhzCLm2tcocEMTS6pRE',
            'value': 1.0,
            'currency': 'MXN'
        });
        gtag('event', eventLabel, {
            'event_category': 'WhatsApp',
            'event_label': eventLabel
        });
    }
}

// Transición suave de entrada y salida al navegar entre páginas
document.addEventListener('DOMContentLoaded', () => {
    // Animación suave de entrada
    document.body.classList.add('page-entering');
    setTimeout(() => {
        document.body.classList.remove('page-entering');
    }, 450);

    // Capturar clics en enlaces internos para animación de salida si no se soporta View Transitions nativo
    const links = document.querySelectorAll('a[href^="/"], a[href^="../"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = link.getAttribute('href');
            if (!targetUrl || targetUrl.startsWith('#') || link.getAttribute('target') === '_blank') return;

            // Si el navegador no soporta startViewTransition, hacemos la salida fluida por JS/CSS
            if (!document.startViewTransition) {
                e.preventDefault();
                document.body.classList.add('page-leaving');
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 220);
            }
        });
    });
});

