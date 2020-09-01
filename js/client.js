let divider = document.getElementById("player-info");

let table = document.getElementById("highscore-table");

function clearTable() {
	table.textContent='';
    for (child of table.childNodes) {
        child.remove();
    }
}

function updateText(message) {
    textContainer.textContent = '';
	let content = document.createElement("p");
	content.textContent = message;
    textContainer.append(content);
}

function updateTable() {
    fetch("/table")
        .then(function (response) {
            if (response.status === 200) {
                window.location.href = "index.html";
            } else {
                console.log(response);
            }
            return response.json();
        })
        .catch(function (error) {
            console.log("error");
        })
        .then(function (data) {
            console.log(data);
        });
}