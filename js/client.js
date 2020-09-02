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
                let r = document.createTextNode(i + 1);
                let u = document.createTextNode(rows[i].username);
                let t = document.createTextNode(rows[i].story_time);
                console.log(rows[i].story_time);
                let hs = document.createTextNode(rows[i].high_score);
                let rank = document.createElement("td");
                rank.appendChild(r);
                row.append(rank);
                let username = document.createElement("td");
                username.appendChild(u);
                row.append(username);
                let time = document.createElement("td");
                time.appendChild(t);
                row.append(time);
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