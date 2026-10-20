// Natural Genesis - Core Scripts & Admin Authentication
(function () {
  'use strict';

  // Configured Authorized Admin Credentials
  const AUTH_CONFIG = {
    username: 'subhadipsarkars@gmail.com',
    password: 'Aviraj2023@',
    sessionKey: 'ng_admin_user',
    storageKey: 'ng_admin_remembered'
  };

  // Helper to check if admin is logged in
  function getLoggedInUser() {
    return sessionStorage.getItem(AUTH_CONFIG.sessionKey) || localStorage.getItem(AUTH_CONFIG.sessionKey);
  }

  // 1. Mobile Menu Toggle
  function initMobileMenu() {
    document.querySelectorAll('.menu-toggle').forEach(button => {
      button.addEventListener('click', () => {
        const nav = document.querySelector('.main-nav');
        if (!nav) return;
        const isOpen = nav.classList.toggle('open');
        button.setAttribute('aria-expanded', String(isOpen));
        button.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
        button.textContent = isOpen ? '×' : '☰';
      });
    });
  }

  // 2. Header State Check
  function updateHeaderState() {
    const loggedUser = getLoggedInUser();
    const adminButtons = document.querySelectorAll('.header-admin-btn, #openAdminModalBtn');
    
    adminButtons.forEach(btn => {
      if (loggedUser) {
        btn.classList.add('is-logged-in');
        const span = btn.querySelector('span');
        if (span) span.textContent = 'Dashboard ↗';
        btn.setAttribute('title', 'Logged in as ' + loggedUser);
        btn.onclick = function (e) {
          e.preventDefault();
          window.location.href = 'admin.html';
        };
      } else {
        btn.classList.remove('is-logged-in');
        const span = btn.querySelector('span');
        if (span) span.textContent = 'Admin Login';
        btn.removeAttribute('title');
        btn.onclick = function (e) {
          e.preventDefault();
          openModal();
        };
      }
    });

    const mobileAdminLinks = document.querySelectorAll('.nav-admin-link');
    mobileAdminLinks.forEach(link => {
      if (loggedUser) {
        link.textContent = 'Admin Dashboard ↗';
        link.href = 'admin.html';
      } else {
        link.textContent = 'Admin Login';
        link.href = '#';
        link.onclick = function (e) {
          e.preventDefault();
          const nav = document.querySelector('.main-nav');
          if (nav && nav.classList.contains('open')) {
            nav.classList.remove('open');
            const menuToggle = document.querySelector('.menu-toggle');
            if (menuToggle) {
              menuToggle.setAttribute('aria-expanded', 'false');
              menuToggle.textContent = '☰';
            }
          }
          openModal();
        };
      }
    });
  }

  // 3. Modal Dialog Management
  const modalOverlay = document.getElementById('authModalOverlay');
  const modalCloseBtn = document.getElementById('closeAuthModalBtn');
  const loginForm = document.getElementById('adminLoginForm');
  const emailInput = document.getElementById('adminEmail');
  const passwordInput = document.getElementById('adminPassword');
  const togglePwdBtn = document.getElementById('togglePwdBtn');
  const rememberCheckbox = document.getElementById('rememberAdmin');
  const alertBox = document.getElementById('authAlert');

  function openModal() {
    if (!modalOverlay) {
      window.location.href = 'login.html';
      return;
    }
    if (getLoggedInUser()) {
      window.location.href = 'admin.html';
      return;
    }
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (alertBox) {
      alertBox.style.display = 'none';
      alertBox.className = 'auth-alert';
      alertBox.textContent = '';
    }
    setTimeout(() => {
      if (emailInput) {
        emailInput.focus();
        if (!emailInput.value) {
          emailInput.value = 'subhadipsarkars@gmail.com';
        }
      }
    }, 150);
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showAlert(message, type) {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = 'auth-alert ' + type;
    alertBox.style.display = 'flex';
  }

  function handleLogin(e) {
    e.preventDefault();
    if (!emailInput || !passwordInput) return;

    const enteredUser = emailInput.value.trim();
    const enteredPass = passwordInput.value;

    if (!enteredUser || !enteredPass) {
      showAlert('Please enter both username/email and password.', 'error');
      return;
    }

    const isUserValid = enteredUser.toLowerCase() === AUTH_CONFIG.username.toLowerCase();
    const isPassValid = enteredPass === AUTH_CONFIG.password;

    if (isUserValid && isPassValid) {
      showAlert('✓ Verification successful. Redirecting to dashboard...', 'success');
      
      sessionStorage.setItem(AUTH_CONFIG.sessionKey, AUTH_CONFIG.username);
      if (rememberCheckbox && rememberCheckbox.checked) {
        localStorage.setItem(AUTH_CONFIG.sessionKey, AUTH_CONFIG.username);
      }

      const submitBtn = document.getElementById('adminSubmitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Entering Portal...</span>';
      }

      setTimeout(() => {
        window.location.href = 'admin.html';
      }, 600);
    } else {
      showAlert('Invalid email or password. Please try again.', 'error');
      if (passwordInput) {
        passwordInput.value = '';
        passwordInput.focus();
      }
      const card = modalOverlay.querySelector('.auth-modal-card');
      if (card) {
        card.style.animation = 'none';
        void card.offsetWidth;
        card.style.animation = 'modalShake 0.4s ease';
      }
    }
  }

  function initAuth() {
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
        closeModal();
      }
    });

    if (togglePwdBtn && passwordInput) {
      togglePwdBtn.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        togglePwdBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        togglePwdBtn.innerHTML = isPassword
          ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
          : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }

    // Connect header buttons
    const openBtns = document.querySelectorAll('#openAdminModalBtn, .header-admin-btn');
    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (getLoggedInUser()) {
          window.location.href = 'admin.html';
        } else {
          openModal();
        }
      });
    });

    updateHeaderState();
  }

  // DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initMobileMenu();
      initAuth();
    });
  } else {
    initMobileMenu();
    initAuth();
  }

  // Expose for external calls
  window.NGAuth = {
    openModal: openModal,
    closeModal: closeModal,
    getLoggedInUser: getLoggedInUser,
    logout: function () {
      sessionStorage.removeItem(AUTH_CONFIG.sessionKey);
      localStorage.removeItem(AUTH_CONFIG.sessionKey);
      window.location.href = 'index.html';
    }
  };
})();
