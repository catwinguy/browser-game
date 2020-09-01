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
    fetch("/users")
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            rows = response.rows;
            for (let i = 0; i < rows.length; i++) {
                let row = document.createElement("tr");
                let u = document.createTextNode(rows[i].username);
                let hs = document.createTextNode(rows[i].high_score);
                let username = document.createElement("td");
                username.appendChild(u);
                row.append(username);
                let highscore = document.createElement("td");
                highscore.appendChild(hs);
                row.append(highscore);
                table.append(row);
            }


        })
        .catch(function (error) {
            console.log(error);
        });
}