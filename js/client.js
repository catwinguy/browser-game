let divider = document.getElementById("player-info");
let storyTable = document.getElementById("story-mode");
let infiniteTable = document.getElementById("infinite-mode");
let storyButton = document.getElementById("show-story");
let infiniteButton = document.getElementById("show-infinite");
let storyScoreboard = document.getElementById("story-scoreboard");
let infiniteScoreboard = document.getElementById("infinite-scoreboard");

storyButton.addEventListener('click', showStoryHighScores);
infiniteButton.addEventListener('click', showInfiniteHighScores);

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

function updateStoryTable() {
    while (storyTable.rows.length > 1){
		storyTable.deleteRow(1);
	}
    fetch("/users")
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            let i;
            let currentRank = 1;
            let users = response.rows;
            users.sort((x, y) => (x.story_high_score > y.story_high_score) ? 1 : -1);
            for (i = 0; i < users.length; i++) {
                if (users[i]["story_high_score"] === null) {
                    continue;
                }
                let currentUser = users[i];
                console.log(currentUser);

                let newRow = document.createElement("tr");
                let rank = document.createElement("td");
                let username = document.createElement("td");
                let storyScore = document.createElement("td");

                rank.textContent = currentRank;
                username.textContent = currentUser.username;
                storyScore.textContent = parseFloat(currentUser.story_high_score).toFixed(3) + "s";

                newRow.append(rank);
                newRow.append(username);
                newRow.append(storyScore);
                storyTable.append(newRow);
                currentRank++;
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function updateInfiniteTable() {
    while (infiniteTable.rows.length > 1){
		infiniteTable.deleteRow(1);
	}
    fetch("/users")
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            let i;
            let currentRank = 1;
            let users = response.rows;
            users.sort((x, y) => (x.infinite_high_score < y.infinite_high_score) ? 1 : -1);
            for (i = 0; i < users.length; i++) {
                if (users[i]["infinite_high_score"] === null) {
                    continue;
                }
                let currentUser = users[i];
                console.log(currentUser);

                let newRow = document.createElement("tr");
                let rank = document.createElement("td");
                let username = document.createElement("td");
                let infiniteScore = document.createElement("td");

                rank.textContent = currentRank;
                username.textContent = currentUser.username;
                infiniteScore.textContent = currentUser.infinite_high_score;

                newRow.append(rank);
                newRow.append(username);
                newRow.append(infiniteScore);
                infiniteTable.append(newRow);
                currentRank++;
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function showStoryHighScores() {
    infiniteScoreboard.style.display = "none";
    storyScoreboard.style.display = "block";
    updateStoryTable();
}

function showInfiniteHighScores() {
    infiniteScoreboard.style.display = "block";
    storyScoreboard.style.display = "none";
    updateInfiniteTable();
}
