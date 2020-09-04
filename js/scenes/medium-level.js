var MediumLevelScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MediumLevelScene ()
    {
        Phaser.Scene.call(this, { key: 'mediumlevelscene'})
    },

    preload: function ()
    {
        // Static Images
        this.load.image('village_background', 'assets/village_background.png')
        this.load.image('ground', 'assets/grass_platform_50x1.png')
        this.load.image('dirt_platform4', 'assets/dirt_platform_4x1.png')
        this.load.image('dirt_platform50', 'assets/dirt_platform_50x1.png')
        this.load.image('emerald', 'assets/emerald.png')
        this.load.image('diamond', 'assets/diamond.png')
        this.load.image('purple_potion', 'assets/potion_purple.png')
        this.load.image('blue_potion', 'assets/potion_blue.png')

        // Levels
        this.load.json('medium-level', 'json/story_level_medium.json')

        // Dynamic Objects
        this.load.spritesheet('girl', 'assets/girl.png', {frameWidth: 16, frameHeight: 32})
        this.load.spritesheet('guy', 'assets/guy.png', {frameWidth: 16, frameHeight: 32})
        this.load.spritesheet('door_left', 'assets/door_left.png', {frameWidth: 16, frameHeight: 32})
    },

    create: function ()
    {
        currentLevel = 'mediumlevelscene'
        let data = this.cache.json.get('medium-level');
        let platformData = data.platforms;
        let coinData = data.coins;
        let powerupData = data.powerups;

        this.add.image(0,0,data.backgroundImage).setOrigin(0,0)
        console.log("Onto the next scene!");

        // timer
        this.start = getCurrentTime();
        text = this.add.text(32, 32, 'time: 0ms', { font: '20px Arial' });

        // Static groups 
        let platforms = this.physics.add.staticGroup();
        let coins = this.physics.add.group();
        let powerups = this.physics.add.staticGroup();
        let doors = this.physics.add.group();

        platformData.forEach(function(platform){
            platforms.create(platform.x, platform.y, platform.image);
        })

        /* Player Information - Start */
        player = this.physics.add.sprite(data.playerStart.x, data.playerStart.y, playerData.name);
        player.body.setGravityY(400);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(playerData.name, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: playerData.name, frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(playerData.name, { start: 5, end: 8 }),
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
        /* Player Information - End */

        /* Door - Start */
        let door = this.physics.add.sprite(data.door.x, data.door.y, data.door.image);
        doors.add(door);

        this.anims.create({
            key: "open",
            frames: this.anims.generateFrameNumbers(data.door.image, {start: 1, end: 1})
        })
        /* Door - End */

        /* Collision Setters */
        player.body.collideWorldBounds = true;
        player.body.onWorldBounds=true;
        this.physics.world.on('worldbounds', (player, up, down, left, right) => {
            if (down)
            {
                this.scene.restart();
            }
        }, this);
        this.physics.add.collider(player, platforms);  // Collider between two game objects
        this.physics.add.collider(coins, platforms);  // make coins land on the ground
        this.physics.add.collider(powerups, platforms);
        this.physics.add.collider(doors, platforms);

        function enterDoor (player, door) {
            console.log('You unlocked the 2nd Medium Stage!');
            door.anims.play("open");
            mediumTime = (getCurrentTime() - this.start) / 1000;
            mediumScore = mediumTime - score;
            score = 0;
            postScore(mediumScore, "level2_fastest_run");
            this.scene.transition({
                target: 'mediumlevelscene2',
                duration: 1000
            });
            // player.setVelocityX(0);
            // player.setVelocityY(0);
        }

        this.physics.add.overlap(player, coins, collectCoin, null, this);
        this.physics.add.overlap(player, powerups, collectPowerup, null, this);
        this.physics.add.overlap(player, doors, enterDoor, null, this);

        cursors = this.input.keyboard.createCursorKeys();

        /* Pause screen implementation */
        pauseButton = this.input.keyboard.addKey('ESC');
        pauseButton.on('up', function(event){
            console.log('Escape key has been pressed!');
            this.scene.pause();
            this.scene.launch('pausescene');
            startPause = new Date();
            mediumTime = (startPause.getTime() - this.start) / 1000;
        }, this)

        this.events.on('pause', function () {
            console.log('Stage 2 paused');
        })

        this.events.on('resume', function () {
            console.log('Stage 2 resumed');
            
            // Fixes the issue with cursor input seeing it be saved as isDown when it is not
            cursors.up.isDown = false;
            cursors.left.isDown = false;
            cursors.right.isDown = false;
        })
        /* Pause screen implementation - End */
    },

    update: function()
    {
        //timer 
        if (pElapsed > 0) {
            this.start += pElapsed;
            pElapsed = 0;
        }
        let elapsed = (getCurrentTime() - this.start) / 1000;
        text.setText(elapsed.toString() + ' s');
         
        if (currentLevel !== 'mediumlevelscene')
        {
            return;
        }

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

        // Restart
        if (restartFlag) {
            this.scene.restart();
            restartFlag = false;
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