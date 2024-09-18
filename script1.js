const { json } = require("body-parser");

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const formData = new FormData(registerForm);
        const username = formData.get('username');
        const full_name = formData.get('full_name');
        const email = formData.get('email');
        const password = formData.get('password');

        try{
            const response = await fetch('/plp/users/registration', {
                method: 'POST',
                headers: {
                    'Content-type' : 'appliction/json'
                },
                body: JSON.stringify({username, email, password, full_name})
            });
            if(response.ok){
                alert('Registration successful');
            } else {
                alert('Registration failed');
            }
        } catch(error) {
            console.error('error occured', error);
        }

    });
});