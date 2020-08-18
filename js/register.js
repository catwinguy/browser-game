let usernameInput = document.getElementById("username");
let passwordInput = document.getElementById("password");
let confirmPasswordInput = document.getElementById("confirm-password");
let errorDiv = document.getElementById("error-div");
let signupButton = document.getElementById("sign-up");

signupButton.addEventListener("click", signUp);

function signUp() {
    let postData = {
        username: usernameInput.value,
        userPassword: passwordInput.value,
        userConfirmPassword: confirmPasswordInput.value
    };

    fetch("/create-user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
    })
    .then(function (response) {
        if (response.status === 200) {
            window.location.href = "login.html";
        } else {
            console.log(response);
        }
        return response.json();
    })
    .then(function (data) {
        if (data.hasOwnProperty("error")) {
            errorDiv.textContent = data.error;
        }
    });
}
