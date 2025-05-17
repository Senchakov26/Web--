document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, авторизован ли пользователь
    checkAuthStatus();

    // Обработчики для страницы авторизации/регистрации
    if (document.querySelector('.auth-container')) {
        setupAuthForms();
    }

    // Обработчик выхода
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});

// Проверка статуса авторизации
function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authLink = document.getElementById('auth-link');
    
    if (user && authLink) {
        authLink.textContent = 'Личный кабинет';
        authLink.href = 'profile.html';
    }
    
    // Заполняем данные профиля, если мы на странице профиля
    if (document.getElementById('profile-name')) {
        if (user) {
            document.getElementById('profile-name').textContent = user.name;
            document.getElementById('profile-email').textContent = user.email;
        } else {
            // Если пользователь не авторизован, перенаправляем на страницу входа
            window.location.href = 'auth.html';
        }
    }
}

// Настройка форм авторизации/регистрации
function setupAuthForms() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    
    // Переключение между вкладками
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Удаляем активный класс у всех кнопок и форм
            tabBtns.forEach(b => b.classList.remove('active'));
            authForms.forEach(form => form.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке и форме
            this.classList.add('active');
            document.getElementById(`${tabId}-form`).classList.add('active');
        });
    });
    
    // Обработка формы входа
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Проверяем существование пользователя
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Сохраняем данные пользователя для "сессии"
                localStorage.setItem('user', JSON.stringify(user));
                window.location.href = 'profile.html';
            } else {
                document.getElementById('login-error').textContent = 'Неверный email или пароль';
            }
        });
    }
    
    // Обработка формы регистрации
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm').value;
            
            // Валидация
            if (password !== confirmPassword) {
                document.getElementById('register-error').textContent = 'Пароли не совпадают';
                return;
            }
            
            if (password.length < 6) {
                document.getElementById('register-error').textContent = 'Пароль должен содержать минимум 6 символов';
                return;
            }
            
            // Проверяем, не зарегистрирован ли уже такой email
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userExists = users.some(u => u.email === email);
            
            if (userExists) {
                document.getElementById('register-error').textContent = 'Пользователь с таким email уже зарегистрирован';
                return;
            }
            
            // Регистрируем нового пользователя
            const newUser = { name, email, password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Авторизуем пользователя
            localStorage.setItem('user', JSON.stringify(newUser));
            window.location.href = 'profile.html';
        });
    }
}

// Выход из системы
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}