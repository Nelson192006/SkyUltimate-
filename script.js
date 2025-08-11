// Splash screen logic
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splash-screen').style.display = 'none';
    document.getElementById('main-content').classList.remove('hidden');
  }, 2000);
});

// Tab switching logic
const tabs = document.querySelectorAll('.tab');
const loginForm = document.getElementById('login-form');
const registrationForms = document.getElementById('registration-forms');
const createAccountLink = document.getElementById('create-account-link');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const role = tab.dataset.role;

    // Hide all registration forms
    document.querySelectorAll('.register-form').forEach(form => form.classList.add('hidden'));

    // Show the correct form
    if (role === 'customer') {
      document.getElementById('customer-register').classList.remove('hidden');
    } else if (role === 'agent') {
      document.getElementById('agent-register').classList.remove('hidden');
    } else if (role === 'superadmin') {
      document.getElementById('superadmin-register').classList.remove('hidden');
    }
  });
});

// Show registration section
createAccountLink.addEventListener('click', () => {
  loginForm.classList.add('hidden');
  registrationForms.classList.remove('hidden');
});

// API integration for all forms
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('https://inspiring-cache-v3wsk9.csb.app/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      alert('✅ Success: ' + result.message);
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  });
});
