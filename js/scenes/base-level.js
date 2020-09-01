// Base Class that contains our custom functions
class BaseLevel extends Phaser.Scene {
    constructor(key)
    {
        super(key);
    }
    enterDoor (player, door) {
        door.anims.play("open");
        // this.scene.start('hardlevelscene');
        this.scene.transition({
            target: 'hardlevelscene',
            duration: 4000
        })
        player.setVelocityX(0);
        player.setVelocityY(0);
    }
    update()
    {
        if (cursors.left.isDown)
        {
            player.setVelocityX(-160);
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);
            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);
            player.anims.play('turn');
        }

        // Jump
        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-330);
        }
    }
}


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
}