var MediumLevelScene2 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MediumLevelScene2 ()
    {
        Phaser.Scene.call(this, { key: 'mediumlevelscene2'})
    },

    preload: function ()
    {
        // Static Images
        this.load.image('village_background', 'assets/village_background.png')
        this.load.image('ground', 'assets/grass_platform_50x1.png')
        this.load.image('dirt_platform4', 'assets/dirt_platform_4x1.png')
        this.load.image('grass_platform4', 'assets/grass_platform_4x1.png')
        this.load.image('dirt_platform50', 'assets/dirt_platform_50x1.png')
        this.load.image('emerald', 'assets/emerald.png')
        this.load.image('diamond', 'assets/diamond.png')
        this.load.image('green_potion', 'assets/potion_green.png')
        this.load.image('purple_potion', 'assets/potion_purple.png')
        this.load.image('blue_potion', 'assets/potion_blue.png')
        this.load.image('sword', 'assets/sword.png');

        // Level
        this.load.json('medium-level2', 'json/story_level_medium2.json')

        // Dynamic Objects
        this.load.spritesheet('zombie', 'assets/zombie.png', {frameWidth: 16, frameHeight: 32})
        this.load.spritesheet('girl', 'assets/girl.png', {frameWidth: 16, frameHeight: 32})
        this.load.spritesheet('girl_sword', 'assets/girl_sword.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('guy', 'assets/guy.png', {frameWidth: 16, frameHeight: 32})
        this.load.spritesheet('guy_sword', 'assets/guy_sword.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('door_left', 'assets/door_left.png', {frameWidth: 16, frameHeight: 32})
    },

    create: function ()
    {
        currentLevel = 'mediumlevelscene2'
        let data = this.cache.json.get('medium-level2');
        let groundData = data.ground;
        let platformData = data.platforms;
        let coinData = data.coins;
        let powerupData = data.powerups;
        let doorData = data.doors;

        this.add.image(0,0,data.backgroundImage).setOrigin(0,0)

        // Static groups
        let platforms = this.physics.add.staticGroup();
        let coins = this.physics.add.group();
        let powerups = this.physics.add.staticGroup();
        let doors = this.physics.add.group();
        let swords = this.physics.add.staticGroup();

        // ground and platforms are separate for now but we can combine them if not needed
        groundData.forEach(function(ground){
            platforms.create(ground.x, ground.y, ground.image);
        })
        platformData.forEach(function(platform){
            platforms.create(platform.x, platform.y, platform.image);
        })

        swords.create(data.sword.x, data.sword.y, data.sword.image);

        player = this.physics.add.sprite(data.playerStart.x, data.playerStart.y, playerName);
        player.body.setGravityY(400);
        player.hasSword = false;

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

        // with sword:
        this.anims.create({
            key: 'left_sword',
            frames: this.anims.generateFrameNumbers(playerName + "_sword", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn_sword',
            frames: [ { key: playerName + "_sword", frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right_sword',
            frames: this.anims.generateFrameNumbers(playerName + "_sword", { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        coinData.forEach(function(coin){
            let cc = coins.create(coin.x, coin.y, coin.image);
            cc.setBounceY(Phaser.Math.FloatBetween(0.2, 0.6));
            cc.name = coin.image;
        });

        powerupData.forEach(function(powerup){
            let powerupChild = powerups.create(powerup.x, powerup.y, powerup.image);
            powerupChild.name = powerup.name;
        });

        // currently only works for one door
        let door = this.physics.add.sprite(doorData[0].x, doorData[0].y, doorData[0].image);
        doors.add(door);

        this.anims.create({
            key: "open",
            frames: this.anims.generateFrameNumbers(doorData[0].image, {start: 1, end: 1})
        })

        // Collisions
        player.body.collideWorldBounds = true;
        player.body.onWorldBounds=true;
        this.physics.world.on('worldbounds', (player, up, down, left, right) => {
            if (down)
            {
                playerData.health = 0;
            }
        }, this);
        this.physics.add.collider(player, platforms);  // Collider between two game objects
        this.physics.add.collider(coins, platforms);  // make coins land on the ground
        this.physics.add.collider(powerups, platforms);
        this.physics.add.collider(doors, platforms);
        this.physics.add.collider(swords, platforms);

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
            console.log('You unlocked the Hard Stage!');
            door.anims.play("open");
            this.scene.transition({
                target: 'hardlevelscene',
                duration: 4000
            });
            // player.setVelocityX(0);
            // player.setVelocityY(0);
        }

        function collectSword(player, sword){
            sword.disableBody(true, true);
            player.hasSword = true;
        }

        this.physics.add.overlap(player, coins, collectCoin, null, this);
        this.physics.add.overlap(player, powerups, collectPowerup, null, this);
        this.physics.add.overlap(player, doors, enterDoor, null, this);
        this.physics.add.overlap(player, swords, collectSword, null, this);

        /* Zombie - Start */
        this.anims.create({
            key: 'zombie_left',
            frames: this.anims.generateFrameNumbers('zombie', { start: 0, end: 3 }),
            framerate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'zombie_stand',
            frames: [ { key: 'zombie', frame: 4 } ],
            frameRate: 15
        });
        this.anims.create({
            key: 'zombie_right',
            frames: this.anims.generateFrameNumbers('zombie', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        })
        let zombie = this.physics.add.sprite(100, 350, 'zombie');
        zombie.body.setGravityY(1000);
        zombie.body.setBounceY(0.1);

        this.physics.add.collider(zombie, platforms);  // Collider between two game objects
        this.physics.add.collider(zombie, player);  // make coins land on the ground

        zombie.play('zombie_right');
        zombie.anims.setRepeat(-1);
        this.tweens.add({
            targets: zombie,
            x: -750,
            duration: 8800,
            ease: 'Linear'
        })
        /* Zombie - End */

        cursors = this.input.keyboard.createCursorKeys();

        // Pause screen implementation
        pauseButton = this.input.keyboard.addKey('ESC');
        pauseButton.on('up', function(event){
            console.log('Escape key has been pressed!');
            this.scene.pause();
            this.scene.launch('pausescene');
        }, this)

        this.events.on('pause', function () {
            console.log('Easy level paused');
        })

        this.events.on('resume', function (flag) {
            console.log('Easy level resumed');
            // Fixes the issue with cursor input seeing it be saved as isDown when it is not
            cursors.up.isDown = false;
            cursors.left.isDown = false;
            cursors.right.isDown = false;
        })
    },

    update: function()
    {
        // Move
        if (cursors.left.isDown)
        {
            player.setVelocityX(-160);
            if (player.hasSword){
                player.anims.play('left_sword', true);
            } else {
                player.anims.play('left', true);
            }
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);
            if (player.hasSword){
                player.anims.play('right_sword', true);
            } else{
                player.anims.play('right', true);
            }
            
        }
        else
        {
            player.setVelocityX(0);
            if (player.hasSword){
                player.anims.play('turn_sword');
            } else {
                player.anims.play('turn');
            }
            
        }

        // Jump
        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-330);
        }

        // Player Death
        if (playerData.health == 0)
        {
            this.scene.restart();
        }

        // Exit
        if (returnMenu) {
            this.scene.start('mainmenu');
            returnMenu = false;
        }
    }
});