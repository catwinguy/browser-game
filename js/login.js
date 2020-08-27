let usernameInput = document.getElementById("username");
let passwordInput = document.getElementById("password");
let errorDiv = document.getElementById("error-div");
let loginButton = document.getElementById("login");

loginButton.addEventListener("click", login);

function login() {
    console.log("logging in");
    let postData = {
        username: usernameInput.value,
        userPassword: passwordInput.value
    };

    fetch("/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
    })
    .then(function (response) {
        if (response.status === 200) {
            window.location.href = "index.html";
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