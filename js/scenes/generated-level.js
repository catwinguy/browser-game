var GeneratedLevelScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GeneratedLevelScene ()
    {
        Phaser.Scene.call(this, { key: 'generatedlevelscene'})
    },

    preload: function ()
    {
        // Static Images
        this.load.image('village_background', 'assets/village_background.png');
        this.load.image('ground', 'assets/grass_platform_50x1.png');
        this.load.image('dirt_platform50', 'assets/dirt_platform_50x1.png');
        this.load.image('dirt_block', 'assets/dirt_block.png');
        this.load.image('grass_block', 'assets/grass_block.png');
        this.load.image('emerald', 'assets/emerald.png');
        this.load.image('diamond', 'assets/diamond.png');

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
        currentLevel = 'generatedlevelscene';
        let m = createMap();
        let data = convertMapToCoords(m);
        console.log(data);
        let groundData = data.ground;
        let platformData = data.platforms;
        let coinData = data.coins;
        let powerupData = data.powerups;
        let doorData = data.doors;

        this.add.image(0,0,data.backgroundImage).setOrigin(0,0)

        // timer 
        this.start = this.getTime();
        text = this.add.text(32, 32, 'time: 0ms', { font: '20px Arial' });

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

        if (data.sword.image !== undefined){
            swords.create(data.sword.x, data.sword.y, data.sword.image);
        };

        player = this.physics.add.sprite(data.playerStart.x, data.playerStart.y, playerName);
        player.body.setGravityY(200);
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

        // Collision
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

        function enterDoor (player, door) {
            door.anims.play("open");
            this.scene.restart();
        }

        this.physics.add.overlap(player, coins, collectCoin, null, this);
        this.physics.add.overlap(player, powerups, collectPowerup, null, this);
        this.physics.add.overlap(player, doors, enterDoor, null, this);
        this.physics.add.overlap(player, swords, collectSword, null, this);

        cursors = this.input.keyboard.createCursorKeys();

        // Pause screen implementation
        pauseButton = this.input.keyboard.addKey('ESC');
        pauseButton.on('up', function(event){
            console.log('Escape key has been pressed!');
            this.scene.pause();
            this.scene.launch('pausescene');
            startPause = new Date();
        }, this)

        this.events.on('pause', function () {
            console.log('Infinite mode paused');
        })

        this.events.on('resume', function (flag) {
            console.log('Infinite mode resumed');
            // Fixes the issue with cursor input seeing it be saved as isDown when it is not
            cursors.up.isDown = false;
            cursors.left.isDown = false;
            cursors.right.isDown = false;
        })
    },

    getTime() {
        //make a new date object
        let d = new Date();

        //return the number of milliseconds since 1 January 1970 00:00:00. 
        return d.getTime();
    },

    update: function()
    {

        //timer
        if (pElapsed > 0) {
            this.start += pElapsed;
            pElapsed = 0;
        }
        let time = new Date();
        let elapsed = (time.getTime() - this.start)/1000;
        text.setText(elapsed.toString() + ' s');

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

