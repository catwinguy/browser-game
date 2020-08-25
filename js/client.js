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


fetch("/")
    .then(function (response) {
        if (response.status != 200) {
            error = true;
        }
        return response;
    })
    .catch(function (error) {
        console.log(error);
    })
    .then(function (data) {
        console.log(data);
    });