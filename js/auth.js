/**
 * auth.js — Client-side authentication module
 * 
 * ⚠️ IMPORTANT: This authentication is entirely client-side.
 * All security checks happen in the browser — this is intentionally insecure.
 * 
 * Hint: Client-side security can be modified... 🤔
 */

// Pre-computed SHA-256 hashes for admin credentials
// These hashes are compared against user input hashes
const ADMIN_USER_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'; // 🤫
const ADMIN_PASS_HASH = 'b0439fae31f3a93a0fea4e80e72d56e8a7108f4e8abadf698fc39097e8f009ae'; // 🤫

// Hint for curious CTF players
console.log('%c🔍 Hint: Client-side security can be modified...', 'color: #ff6b35; font-size: 14px; font-weight: bold;');


/**
 * Hash a string using SHA-256 via the Web Crypto API
 * @param {string} message - The string to hash
 * @returns {Promise<string>} - Hex-encoded hash
 */
async function sha256(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Attempt login with the given credentials
 * Compares SHA-256 hashes of input against stored admin hashes
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{success: boolean, role: string}>}
 */
async function attemptLogin(username, password) {
  const userHash = await sha256(username);
  const passHash = await sha256(password);

  // Check if hashes match admin credentials
  if (userHash === ADMIN_USER_HASH && passHash === ADMIN_PASS_HASH) {
    const user = { username: username, role: 'admin' };
    localStorage.setItem('user', JSON.stringify(user));
    return { success: true, role: 'admin' };
  } else {
    // Any other credentials → regular user
    const user = { username: username, role: 'user' };
    localStorage.setItem('user', JSON.stringify(user));
    return { success: true, role: 'user' };
  }
}

/**
 * Get the current logged-in user from localStorage
 * @returns {object|null}
 */
function getCurrentUser() {
  try {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Check if the current user has admin role
 * ⚠️ This check is entirely client-side — it can be bypassed!
 * @returns {boolean}
 */
function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

/**
 * Log out the current user
 */
function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

/**
 * Update navbar based on auth state
 * Shows/hides admin link and updates login button
 */
function updateNavAuth() {
  const user = getCurrentUser();
  const adminNav = document.getElementById('admin-nav');
  const loginBtn = document.getElementById('login-btn');
  const greetingEl = document.getElementById('user-greeting');

  if (adminNav) {
    adminNav.style.display = user && user.role === 'admin' ? 'flex' : 'none';
  }

  if (loginBtn && user) {
    loginBtn.textContent = '🚪 Logout';
    loginBtn.onclick = function (e) {
      e.preventDefault();
      logout();
    };
    loginBtn.href = '#';
  }

  if (greetingEl && user) {
    greetingEl.textContent = `Hi, ${user.username}! 👋`;
    greetingEl.style.display = 'block';
  }
}

/**
 * Require admin access — redirect if not admin
 * Used on admin.html and flag.html
 */
function requireAdmin() {
  if (!isAdmin()) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// Initialize auth state on page load
document.addEventListener('DOMContentLoaded', updateNavAuth);
