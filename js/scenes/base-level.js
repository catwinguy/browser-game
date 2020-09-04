/* Common functions for scenes */

function collectCoin (player, coin){
    /* Collect coins when the player collides with them and update the score. */
    coin.disableBody(true, true);
    switch(coin.name){
        case "emerald":
            score++;
            break;
        case "diamond":
            score += 5;
            break;
        default:
            break;
    }
    console.log("Current score:", score);
    let time = new Date();
    easyTime = (time.getTime() - this.start) / 1000;
    console.log(easyTime);
};

function collectPowerup(player, powerup){
    /* Collect powerups when the player collides with them and update gravity or velocity. */
    powerup.disableBody(true, true);
    let powerupType = powerup.name;
    switch (powerupType){
        case "lower-gravity":
            player.body.setGravityY(player.body.gravity.y/2);
            break;
        case "raise-gravity":
            player.body.setGravityY(player.body.gravity.y*2);
            break;
        case "hop":
            player.setVelocityY(-330);
            break;
        default:
            break;
    }
}

function collectSword(player, sword){
    /* Collect the sword when the player collides with it. */
    sword.disableBody(true, true);
    player.hasSword = true;
    player.attack = 1;
    player.swordDurability = 5;
    
    for (let i in player.durabilityList) {
        // Initially set visibility of durability to false
        player.durabilityList[i].setVisible(true);
    }
}


function postScore(levelScore, levelKey) {
    /* Post the score to the database. */
    let postData = {
        score: levelScore,
        level: levelKey
    }

    fetch("/story-highscore", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
    })
    .then(function (response) {
        if (response.status !== 200) {
            console.log(response.json);
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}

function fight (player, zombie) {
    /* Update the zombie and player health when fighting. */
    zombie.health -= player.attack;
    if (!player.hasSword)
    {
        player.health--;
    }
    if (!zombie.health)
    {
        zombie.disableBody(true, true);
    }

    player.swordDurability--;
    if (player.swordDurability >= 0 && player.durabilityList)
    {
        player.durabilityList[player.swordDurability].setVisible(false);
    }

    if (!player.swordDurability)
    {
        player.hasSword = false;
        player.attack =  0;
    }

    console.log("Zombie Health: " + zombie.health);
    console.log("Player Health: " + player.health);
    console.log("Sword: " + player.hasSword);
}

function getCurrentTime() {
    /* Get the current time in milliseconds since epoch (1 January 1970 00:00:00). */
    let d = new Date();
    return d.getTime();
}