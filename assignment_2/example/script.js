document.getElementById('login-button').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const adminInterface = document.getElementById('admin-interface');
    const userInterface = document.getElementById('user-interface');
    const loginContainer = document.getElementById('login-container');

    if (email === 'admin@admin.com') {
        adminInterface.style.display = 'block';
        userInterface.style.display = 'none';
    } else {
        userInterface.style.display = 'block';
        adminInterface.style.display = 'none';
    }
    loginContainer.style.display = 'none';
});
