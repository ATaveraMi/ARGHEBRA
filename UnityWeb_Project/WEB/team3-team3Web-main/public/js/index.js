const dashboard = document.getElementById('dashboard_btn');
const login = document.getElementById('login_btn');
const signup = document.getElementById('signup_btn');

dashboard.addEventListener('click', function() {
    location.replace("/dashboard");
});
login.addEventListener('click', function() {
    location.replace("/login");
});
signup.addEventListener('click', function() {
    location.replace("/signup");
});

