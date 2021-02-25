document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#login').addEventListener('click', login);
})


function login() {
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const loginJson = JSON.stringify({email: email, password: password});
    console.log(loginJson);

    fetch('/api/v1/user/login', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: loginJson
    })

    .then(response => response.json())
    .then(result => {
        const success = result['success'];
        const error = result['error'];
        
        if (!success) document.getElementById('error').innerHTML = "Please fill in all the fields";
        if (success) {
            document.cookie = `auth-token=${success}`;
            window.location.href = "/";
        };
    })

}