var HardLevelScene2 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function HardLevelScene2 ()
    {
        Phaser.Scene.call(this, { key: 'hardlevelscene2'})
    },

    preload: function ()
    {
        // Static Images
        this.load.image('village_background', 'assets/village_background.png')
        this.load.image('ground', 'assets/grass_platform_50x1.png')
        this.load.image('stone_block', 'assets/stone_block.png')
        this.load.image('dirt_platform4', 'assets/dirt_platform_4x1.png')
        this.load.image('grass_platform4', 'assets/grass_platform_4x1.png')
        this.load.image('dirt_platform50', 'assets/dirt_platform_50x1.png')
        this.load.image('emerald', 'assets/emerald.png')
        this.load.image('diamond', 'assets/diamond.png')
        this.load.image('green_potion', 'assets/potion_green.png')
        this.load.image('purple_potion', 'assets/potion_purple.png')
        this.load.image('blue_potion', 'assets/potion_blue.png')
        this.load.image('sword', 'assets/sword.png');
        this.load.image('durability', 'assets/swordIcon.png')

        // Level
        this.load.json('hard-level2', 'json/story_level_hard2.json')

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
        currentLevel = 'hardlevelscene2'
        let data = this.cache.json.get('hard-level2');
        let groundData = data.ground;
        let platformData = data.platforms;
        let coinData = data.coins;
        let powerupData = data.powerups;
        let doorData = data.doors;
        let zombies = data.zombies;

        this.add.image(0,0,data.backgroundImage).setOrigin(0,0)
        console.log("Onto the next scene!");

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

        // Sword
        if (data.sword.image !== undefined){
            swords.create(data.sword.x, data.sword.y, data.sword.image);
        };

        // Durability
        let sword1 = this.add.image(data.durability[0].x, data.durability[0].y, data.durability[0].image).setScale(0.1);
        let sword2 = this.add.image(data.durability[1].x, data.durability[1].y, data.durability[1].image).setScale(0.1);
        let sword3 = this.add.image(data.durability[2].x, data.durability[2].y, data.durability[2].image).setScale(0.1);
        let sword4 = this.add.image(data.durability[3].x, data.durability[3].y, data.durability[3].image).setScale(0.1);
        let sword5 = this.add.image(data.durability[4].x, data.durability[4].y, data.durability[4].image).setScale(0.1);

        player = this.physics.add.sprite(data.playerStart.x, data.playerStart.y, playerData.name);
        player.body.setGravityY(600);
        player.hasSword = false;
        player.health = playerData.health;
        player.attack = 0;
        player.durabilityList = [sword1, sword2, sword3, sword4, sword5];
        for (i in player.durabilityList) {
            // Initially set visibility of durability to false
            player.durabilityList[i].setVisible(false);
        }

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

        // with sword:

        this.anims.create({
            key: 'left_sword',
            frames: this.anims.generateFrameNumbers(playerData.name + "_sword", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn_sword',
            frames: [ { key: playerData.name + "_sword", frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right_sword',
            frames: this.anims.generateFrameNumbers(playerData.name + "_sword", { start: 5, end: 8 }),
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
                this.scene.restart();
            }
        }, this);
        this.physics.add.collider(player, platforms);  // Collider between two game objects
        this.physics.add.collider(coins, platforms);  // make coins land on the ground
        this.physics.add.collider(powerups, platforms);
        this.physics.add.collider(doors, platforms);
        this.physics.add.collider(swords, platforms);

        function enterDoor (player, door) {
            // TODO: add new scene telling player they won and their times  
            let time = new Date();
            hardTime2 = (time.getTime() - this.start) / 1000;
            console.log('Congratulations! You won the game!');
            door.anims.play("open");
            hardScore2 = hardTime2 - score;
            score = 0;
            postScore(hardScore2, "level5_fastest_run");
            this.scene.transition({
                target: 'gameovermenu',
                duration: 1000
            });
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

        // Zombie 1
        this.zombie1 = this.physics.add.sprite(zombies[0].x, zombies[0].y, 'zombie');
        this.zombie1.health = zombieData.health;
        this.zombie1.attack = zombieData.attack;
        this.zombie1.direction = 'forward';  // Starting zombie move direction
        this.zombie1.body.setGravityY(1000);
        this.zombie1.body.setBounce(0, 0.1);

        // Zombie 2
        this.zombie2 = this.physics.add.sprite(zombies[1].x, zombies[1].y, 'zombie');
        this.zombie2.health = zombieData.health;
        this.zombie2.attack = zombieData.attack;
        this.zombie2.direction = 'forward';  // Starting zombie move direction
        this.zombie2.body.setGravityY(1000);
        this.zombie2.body.setBounce(0, 0.1);

        // Zombie 3
        this.zombie3 = this.physics.add.sprite(zombies[2].x, zombies[2].y, 'zombie');
        this.zombie3.health = zombieData.health;
        this.zombie3.attack = zombieData.attack;
        this.zombie3.direction = 'backward';  // Starting zombie move direction
        this.zombie3.body.setGravityY(1000);
        this.zombie3.body.setBounce(0, 0.1);

        // Zombie 4
        this.zombie4 = this.physics.add.sprite(zombies[3].x, zombies[3].y, 'zombie');
        this.zombie4.health = zombieData.health;
        this.zombie4.attack = zombieData.attack;
        this.zombie4.direction = 'backward';  // Starting zombie move direction
        this.zombie4.body.setGravityY(1000);
        this.zombie4.body.setBounce(0, 0.1);

        // Zombie 5
        this.zombie5 = this.physics.add.sprite(zombies[4].x, zombies[4].y, 'zombie');
        this.zombie5.health = zombieData.health;
        this.zombie5.attack = zombieData.attack;
        this.zombie5.direction = 'forward';  // Starting zombie move direction
        this.zombie5.body.setGravityY(1000);
        this.zombie5.body.setBounce(0, 0.1);

        // Zombie 6
        this.zombie6 = this.physics.add.sprite(zombies[5].x, zombies[5].y, 'zombie');
        this.zombie6.health = zombieData.health;
        this.zombie6.attack = zombieData.attack;
        this.zombie6.direction = 'backward';  // Starting zombie move direction
        this.zombie6.body.setGravityY(1000);
        this.zombie6.body.setBounce(0, 0.1);

        // Zombie 7
        this.zombie7 = this.physics.add.sprite(zombies[6].x, zombies[6].y, 'zombie');
        this.zombie7.health = zombieData.health;
        this.zombie7.attack = zombieData.attack;
        this.zombie7.direction = 'forward';  // Starting zombie move direction
        this.zombie7.body.setGravityY(1000);
        this.zombie7.body.setBounce(0, 0.1);

        this.physics.add.collider(this.zombie1, platforms);
        this.zombie1.body.collideWorldBounds = true;
        this.physics.add.collider(this.zombie2, platforms);
        this.zombie2.body.collideWorldBounds = true;
        this.physics.add.collider(this.zombie3, platforms);
        this.zombie3.body.collideWorldBounds = true;
        this.physics.add.collider(this.zombie4, platforms);
        this.zombie4.body.collideWorldBounds = true;
        this.physics.add.collider(this.zombie5, platforms);
        this.zombie5.body.collideWorldBounds = true;
        this.physics.add.collider(this.zombie6, platforms);
        this.zombie6.body.collideWorldBounds = true;
        this.physics.add.collider(this.zombie7, platforms);
        this.zombie7.body.collideWorldBounds = true;

        this.physics.add.overlap(player, this.zombie1, fight, null, this);
        this.physics.add.overlap(player, this.zombie2, fight, null, this);
        this.physics.add.overlap(player, this.zombie3, fight, null, this);
        this.physics.add.overlap(player, this.zombie4, fight, null, this);
        this.physics.add.overlap(player, this.zombie5, fight, null, this);
        this.physics.add.overlap(player, this.zombie6, fight, null, this);
        this.physics.add.overlap(player, this.zombie7, fight, null, this);
        /* Zombie - End */

        cursors = this.input.keyboard.createCursorKeys();

        // Pause screen implementation
        pauseButton = this.input.keyboard.addKey('ESC');
        pauseButton.on('up', function(event){
            console.log('Escape key has been pressed!');
            this.scene.pause();
            this.scene.launch('pausescene');
            startPause = new Date();
            hardTime2 = (startPause.getTime() - this.start) / 1000;
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

    updateZombieX(zombie,movement)
    {
        zombie.x += movement;
        if (movement > 0)
        {
            zombie.anims.play('zombie_right', true);
        }
        else if (movement < 0)
        {
            zombie.anims.play('zombie_left', true);
        }
        else
        {
            zombie.anims.play('zombie_stand', true);
        }
    },

    moveZombie(zombie, speed, minDist, maxDist)
    {
        if (zombie.x > maxDist && zombie.direction == 'forward')
        {
            this.updateZombieX(zombie, 0);
            zombie.direction = 'backward';
        }
        else if (zombie.x < minDist && zombie.direction == 'backward')
        {
            this.updateZombieX(zombie, 0);
            zombie.direction = 'forward';
        }
        else if (zombie.x <= maxDist && zombie.direction == 'forward')
        {
            this.updateZombieX(zombie, speed);
        }
        else if (zombie.x >= minDist && zombie.direction == 'backward')
        {
            this.updateZombieX(zombie, -speed);
        }
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
        let elapsed = (time.getTime() - this.start) / 1000;
        text.setText(elapsed.toString() + ' s');

        if (currentLevel !== 'hardlevelscene2')
        {
            return;
        }

        // Zombie Movement
        this.moveZombie(this.zombie1, 2, 10, 190);
        this.moveZombie(this.zombie2, 2, 610, 790);
        this.moveZombie(this.zombie3, 2, 185, 575);
        this.moveZombie(this.zombie4, 3, 15, 350);
        this.moveZombie(this.zombie5, 3, 15, 350);
        this.moveZombie(this.zombie6, 3, 450, 785);
        this.moveZombie(this.zombie7, 3, 450, 785);

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

        // Restart
        if (restartFlag) {
            this.scene.restart();
            restartFlag = false;
        }

        // Player Death
        if (player.health == 0)
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