// common functions for scenes
function collectCoin (player, coin){
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
    sword.disableBody(true, true);
    player.hasSword = true;
    player.attack = 1;
}


function postScore(levelScore, levelKey) {
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
    zombie.health -= player.attack;
    if (!player.hasSword)
    {
        player.health--;
    }
    if (!zombie.health)
    {
        zombie.disableBody(true, true);
    }
    console.log(zombie.health);
    console.log(player.health);
    console.log(player.hasSword);
    zombie.body.velocity.x *= -1.0001;
    player.body.velocity.x *= -1.0001;
}