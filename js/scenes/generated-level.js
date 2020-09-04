var GeneratedLevelScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GeneratedLevelScene ()
    {
        Phaser.Scene.call(this, { key: 'generatedlevelscene' });
    },

    preload: function ()
    {
        // Static Images 
        this.load.image('village_background', 'assets/village_background.png');
        this.load.image('dirt_block', 'assets/dirt_block.png');
        this.load.image('grass_block', 'assets/grass_block.png');
        this.load.image('emerald', 'assets/emerald.png');
        this.load.image('diamond', 'assets/diamond.png');

        // Dynamic Objects 
        this.load.spritesheet('girl', 'assets/girl.png', {frameWidth: 16, frameHeight: 32})
        this.load.spritesheet('guy', 'assets/guy.png', {frameWidth: 16, frameHeight: 32})
        this.load.spritesheet('door_left', 'assets/door_left.png', {frameWidth: 16, frameHeight: 32})
    },

    create: function ()
    {
        currentLevel = 'generatedlevelscene';
        let m = createMap();
        let data = convertMapToCoords(m);
        let platformData = data.platforms;
        let coinData = data.coins;

        this.add.image(0, 0, data.backgroundImage).setOrigin(0, 0);

        // timer 
        this.start = getCurrentTime();
        this.endTime = this.start + infiniteTime;
        text = this.add.text(32, 32, 'time: 0ms', { font: '20px Arial' });

        let platforms = this.physics.add.staticGroup();
        let coins = this.physics.add.group();
        let doors = this.physics.add.group();

        platformData.forEach(function(platform){
            platforms.create(platform.x, platform.y, platform.image);
        })

        player = this.physics.add.sprite(data.playerStart.x, data.playerStart.y, playerData.name);
        player.body.setGravityY(200);

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
        });

        let door = this.physics.add.sprite(data.door.x, data.door.y, data.door.image);
        doors.add(door);

        this.anims.create({
            key: "open",
            frames: this.anims.generateFrameNumbers(data.door.image, {start: 1, end: 1})
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
        this.physics.add.collider(doors, platforms);

        function enterDoor(player, door) {
            generatedTime = (getCurrentTime() - this.start) / 1000;
            infiniteScore++;
            let postData = {
                score: infiniteScore,
                level: "infinite_high_score"
            };
            fetch("/infinite-highscore", {
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
            door.anims.play("open");
            this.scene.restart();
        }

        this.physics.add.overlap(player, coins, this.updateScore, null, this);
        this.physics.add.overlap(player, doors, enterDoor, null, this);

        cursors = this.input.keyboard.createCursorKeys();

        // Pause screen implementation 
        pauseButton = this.input.keyboard.addKey('ESC');
        pauseButton.on('up', function(event){
            console.log('Escape key has been pressed!');
            this.scene.pause();
            this.scene.launch('pauseinfinite');
            startPause = new Date();
            generatedTime = (startPause.getTime() - this.start) / 1000;
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

    updateScore(player, coin){
        coin.disableBody(true, true);
        switch(coin.name){
            case "emerald":
                this.endTime += 1000;  // add 1 second
                break;
            case "diamond":
                this.endTime += 5000;  // add 5 seconds
                break;
            default:
                break;
        }
    },

    update: function()
    {
        //timer
        if (pElapsed > 0) {
            this.endTime += pElapsed;
            pElapsed = 0;
        }

        let time = new Date();

        if ((time.getTime() >= this.endTime) || (playerData.health == 0)) {
            // lost from running out of time or dying
            this.scene.stop();
            this.scene.start("gameovermenu");
        }
        else {
            let remaining = (this.endTime - time.getTime()) / 1000;
            text.setText(remaining.toString() + ' s');


            // Move
            if (cursors.left.isDown) {
                player.setVelocityX(-160);
                player.anims.play('left', true);
            }
            else if (cursors.right.isDown) {
                player.setVelocityX(160);
                player.anims.play('right', true);
            }
            else {
                player.setVelocityX(0);
                player.anims.play('turn');
            }

            // Jump
            if (cursors.up.isDown && player.body.touching.down) {
                player.setVelocityY(-330);
            }

        }

        // Exit 
        if (returnMenu) {
            this.scene.start('mainmenu');
            returnMenu = false;
        }
    }
});
