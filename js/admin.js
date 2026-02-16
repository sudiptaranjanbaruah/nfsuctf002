/**
 * admin.js — Admin dashboard logic
 * 
 * Controls access to admin.html and flag.html
 * ⚠️ All access control is client-side only!
 * 
 * <!-- Psst: The role check is just reading localStorage... -->
 */

// The flag is stored here — not in the HTML
// Can you find it? 😉
const _0x466c6167 = atob('TkZTVUNURns4YTVmMTMwMDQyZTMwNDNjZTk3Yzg1MTYyMWJlM2V9');

/**
 * Initialize the admin page
 * Redirects non-admin users to index
 */
function initAdminPage() {
    if (!requireAdmin()) return;

    // Populate fake dashboard data
    animateStats();
}

/**
 * Initialize the flag page
 * Redirects non-admin users to index
 */
function initFlagPage() {
    if (!requireAdmin()) return;

    // Reveal the flag from JS variable
    const flagBox = document.getElementById('flag-value');
    if (flagBox) {
        flagBox.textContent = _0x466c6167;
    }
}

/**
 * Animate stat counters on the admin dashboard
 */
function animateStats() {
    const statEls = document.querySelectorAll('.stat-num[data-target]');
    statEls.forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        const duration = 1500;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString();
        }, 16);
    });
}

/**
 * Reveal the secret flag link
 */
function revealSecret() {
    const secretLink = document.getElementById('secret-link');
    if (secretLink) {
        secretLink.style.display = 'block';
        secretLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Initialize the correct page
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('admin.html')) {
        initAdminPage();
    } else if (path.includes('flag.html')) {
        initFlagPage();
    }
});
