var HardLevelScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function HardLevelScene ()
    {
        Phaser.Scene.call(this, { key: 'hardlevelscene'})
    },

    preload: function ()
    {
        // Static Images
        this.load.image('village_background', 'assets/village_background.png')
        this.load.image('ground', 'assets/grass_platform_50x1.png')
        this.load.image('dirt_platform4', 'assets/dirt_platform_4x1.png')
        this.load.image('dirt_platform50', 'assets/dirt_platform_50x1.png')
        this.load.image('grass_block', 'assets/grass_block.png')
        this.load.image('grass_platform4', 'assets/grass_platform_4x1.png')
        this.load.image('emerald', 'assets/emerald.png')
        this.load.image('diamond', 'assets/diamond.png')
        this.load.image('purple_potion', 'assets/potion_purple.png')
        this.load.image('blue_potion', 'assets/potion_blue.png')

        // Level
        this.load.json('hard-level', 'json/story_level_hard.json')

        // Dynamic Objects
        this.load.spritesheet('zombie', 'assets/zombie.png', {frameWidth: 16, frameHeight: 32})
        this.load.spritesheet('girl', 'assets/girl.png', {frameWidth: 16, frameHeight: 32})
        this.load.spritesheet('guy', 'assets/guy.png', {frameWidth: 16, frameHeight: 32})
        this.load.spritesheet('door_left', 'assets/door_left.png', {frameWidth: 16, frameHeight: 32})
    },

    create: function ()
    {
        let data = this.cache.json.get('hard-level');
        let groundData = data.ground;
        let platformData = data.platforms;
        let coinData = data.coins;
        let powerupData = data.powerups;
        let doorData = data.doors;

        this.add.image(0,0,data.backgroundImage).setOrigin(0,0)
        console.log("Onto the next scene!");

        // Static groups
        let platforms = this.physics.add.staticGroup();
        let coins = this.physics.add.group();
        let powerups = this.physics.add.staticGroup();
        let doors = this.physics.add.group();

        // ground and platforms are separate for now but we can combine them if not needed
        groundData.forEach(function(ground){
            platforms.create(ground.x, ground.y, ground.image);
        })
        platformData.forEach(function(platform){
            platforms.create(platform.x, platform.y, platform.image);
        })

        player = this.physics.add.sprite(data.playerStart.x, data.playerStart.y, playerName);
        player.body.setGravityY(400);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(playerName, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: playerName, frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(playerName, { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        coinData.forEach(function(coin){
            let cc = coins.create(coin.x, coin.y, coin.image);
            cc.setBounceY(Phaser.Math.FloatBetween(0.2, 0.6));
            cc.name = coin.image;
        })

        powerupData.forEach(function(powerup){
            let powerupChild = powerups.create(powerup.x, powerup.y, powerup.image);
            powerupChild.name = powerup.name;
        })

        // currently only works for one door
        let door = this.physics.add.sprite(doorData[0].x, doorData[0].y, doorData[0].image);
        doors.add(door);

        this.anims.create({
            key: "open",
            frames: this.anims.generateFrameNumbers(doorData[0].image, {start: 1, end: 1})
        })

        //player.setBounce(0.2);
        player.setCollideWorldBounds(true);  // Collides with window edges

        this.physics.add.collider(player, platforms);  // Collider between two game objects
        this.physics.add.collider(coins, platforms);  // make coins land on the ground
        this.physics.add.collider(powerups, platforms);
        this.physics.add.collider(doors, platforms);

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
        }

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

        function enterDoor (player, door) {
            // TODO: add new scene telling player they won and their times
            door.anims.play("open");
        }

        this.physics.add.overlap(player, coins, collectCoin, null, this);
        this.physics.add.overlap(player, powerups, collectPowerup, null, this);
        this.physics.add.overlap(player, doors, enterDoor, null, this);

        cursors = this.input.keyboard.createCursorKeys();
    },

    update: function()
    {
        // Move
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
});