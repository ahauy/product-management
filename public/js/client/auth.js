function switchTab(tabName) {
  const loginTab = document.getElementById('tab-login');
  const registerTab = document.getElementById('tab-register');
  const loginForm = document.getElementById('form-login');
  const registerForm = document.getElementById('form-register');

  if (tabName === 'login') {
      loginTab.className = 'tab-btn active';
      registerTab.className = 'tab-btn inactive';

      loginForm.classList.add('active');
      registerForm.classList.remove('active');
  } else {
      registerTab.className = 'tab-btn active';
      loginTab.className = 'tab-btn inactive';

      registerForm.classList.add('active');
      loginForm.classList.remove('active');
  }
}