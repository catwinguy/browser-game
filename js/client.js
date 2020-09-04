let divider = document.getElementById("player-info");
let storyTable = document.getElementById("story-mode");
let infiniteTable = document.getElementById("infinite-mode");
let storyButton = document.getElementById("show-story");
let infiniteButton = document.getElementById("show-infinite");
let storyScoreboard = document.getElementById("story-scoreboard");
let infiniteScoreboard = document.getElementById("infinite-scoreboard");
let currentUser = document.getElementById("current-user-info");
let logoutButton = document.getElementById("logout-button");
let usernameDisplay = document.getElementById("username-display");

storyButton.addEventListener('click', showStoryHighScores);
infiniteButton.addEventListener('click', showInfiniteHighScores);
logoutButton.addEventListener('click', logout);

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
            users.sort((x, y) => (parseFloat(x.story_high_score) > parseFloat(y.story_high_score)) ? 1 : -1);
            for (i = 0; i < users.length; i++) {
                if (users[i]["story_high_score"] === null) {
                    continue;
                }
                let currentUser = users[i];

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
            users.sort((x, y) => (parseInt(x.infinite_high_score) < parseInt(y.infinite_high_score)) ? 1 : -1);
            for (i = 0; i < users.length; i++) {
                if (users[i]["infinite_high_score"] === null) {
                    continue;
                }
                let currentUser = users[i];

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

function logout() {
    fetch("/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response) {
        showUserInfo();
    }).catch(function (error) {
        console.log(error);
    });
}

function onLoadFunc() {
    showStoryHighScores();
    showUserInfo();
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

function showUserInfo() {
    fetch("/current-user").then(function (response) {
        return response.json();
    }).then(function (data) {
        if (data.user === null) {
            divider.style.display = "block";
            currentUser.style.display = "none";
        } else {
            usernameDisplay.textContent = "User: " + data.user;
            divider.style.display = "none";
            currentUser.style.display = "block";
        }
    }).catch(function (error) {
        console.log(error);
    });
}
