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
                let t1 = document.createTextNode(rows[i].level1_time);
                let t2 = document.createTextNode(rows[i].level2_time);
                let t3 = document.createTextNode(rows[i].level3_time);
                let t4 = document.createTextNode(rows[i].level4_time);
                let t5 = document.createTextNode(rows[i].level5_time);
                let shs = document.createTextNode(rows[i].story_highscore);
                let ihs = document.createTextNode(rows[i].infinite_highscore);
                let rank = document.createElement("td");
                rank.appendChild(r);
                row.append(rank);
                let username = document.createElement("td");
                username.appendChild(u);
                row.append(username);
                let time1 = document.createElement("td");
                time1.appendChild(t1);
                row.append(time1);
                let time2 = document.createElement("td");
                time2.appendChild(t2);
                row.append(time2);
                let time3 = document.createElement("td");
                time3.appendChild(t3);
                row.append(time3);
                let time4 = document.createElement("td");
                time4.appendChild(t4);
                row.append(time4);
                let time5 = document.createElement("td");
                time5.appendChild(t5);
                row.append(time5);
                let story_highscore = document.createElement("td");
                story_highscore.appendChild(shs);
                row.append(story_highscore);
                let infinite_highscore = document.createElement("td");
                infinite_highscore.appendChild(ihs);
                row.append(infinite_highscore);
                table.append(row);
            }


        })
        .catch(function (error) {
            console.log(error);
        });
}