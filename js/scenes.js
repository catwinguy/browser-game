// Might consider moving this to a Constants-Only File
const playerName = 'girl';
var player;
let score = 0;
let sceneTransition = false;

var MenuScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MenuScene ()
    {
        // This maps this class with the name of the scene so that it can be called by the game
        Phaser.Scene.call(this, { key: 'menuscene'})
    },

    preload: function ()
    {
        this.load.json('menu', 'assets/menu.json')
        this.load.image('menu_background', 'assets/minecraftMenuBackground.jpg');
        this.load.image('story_mode_button', 'assets/StoryModeButton.png');
        this.load.image('versus_mode_button', 'assets/VersusModeButton.png');
    },

    create: function ()
    {
        let data = this.cache.json.get('menu');
        //console.log(this);  -- Debugging purposes
        let background = this.add.image(data.background.x, data.background.y, data.background.image);
        let storyButton = this.add.image(data.button1.x, data.button1.y, data.button1.image);
        let versusButton = this.add.image(data.button2.x, data.button2.y, data.button2.image);
        
        // Temporary instruction
        let scoreText = this.add.text(225,580,'Click on Story Mode to Start!', {fontSize: '20px', fill: '#FFF' });
        let message = this.add.text(430,450, "Under Construction!", {fontSize: '30px', fill: '#FFF'})
        message.setVisible(false);

        storyButton.setInteractive();
        storyButton.on("pointerup", () => {
            message.setVisible(false);
            this.scene.start('easylevelscene');
        })
        versusButton.setInteractive();
        versusButton.on("pointerup", () => {
            //scoreText.setText('Currently under construction!');
            message.setVisible(true);
            console.log("Next menu in progress!");
        })
        background.setInteractive();
        background.on("pointerup", () => {
            message.setVisible(false);
        })
    },
});

var EasyLevelScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function EasyLevelScene ()
    {
        Phaser.Scene.call(this, { key: 'easylevelscene'})
    },

    preload: function ()
    {
        // Static Images
        this.load.image('village_background', 'assets/village_background.png')
        this.load.image('ground', 'assets/grass_platform_50x1.png')
        this.load.image('dirt_block', 'assets/dirt_block.png')
        this.load.image('dirt_platform4', 'assets/dirt_platform_4x1.png')
        this.load.image('dirt_platform50', 'assets/dirt_platform_50x1.png')
        this.load.image('grass_block', 'assets/grass_block.png')
        this.load.image('grass_platform4', 'assets/grass_platform_4x1.png')
        this.load.image('stone_block', 'assets/stone_block.png')
        this.load.image('stone_platform4', 'assets/stone_platform_4x1.png')
        this.load.image('star', 'assets/star.png')
        this.load.image('bomb', 'assets/bomb.png')
        this.load.image('emerald', 'assets/emerald.png')
        this.load.image('diamond', 'assets/diamond.png')
        this.load.image('door', 'assets/door.png')
        this.load.image('green_potion', 'assets/potion_green.png')
        this.load.image('purple_potion', 'assets/potion_purple.png')
        this.load.image('blue_potion', 'assets/potion_blue.png')

        // Levels
        this.load.json('easy-level', 'assets/story_level_easy.json')
        this.load.json('medium-level', 'assets/story_level_medium.json')
        this.load.json('hard-level', 'assets/story_level_hard.json')

        // Dynamic Objects
        this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48})
        this.load.spritesheet('zombie', 'assets/zombie.png', {frameWidth: 16, frameHeight: 32})
        this.load.spritesheet('girl', 'assets/girl.png', {frameWidth: 16, frameHeight: 32})
        this.load.spritesheet('guy', 'assets/guy.png', {frameWidth: 16, frameHeight: 32})
    },

    create: function ()
    {
        let data = this.cache.json.get('easy-level');
        this.add.image(0,0,data.backgroundImage).setOrigin(0,0)
        console.log("Onto the next scene!");

        // Platforms group is a grouping for all ground objects
        let platforms = this.physics.add.staticGroup();  // static object never moves
        
        let groundData = data.ground;
        let platformData = data.platforms;
        let doorData = data.doors;

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

        coins = this.physics.add.group();
        powerups = this.physics.add.staticGroup();
        doors = this.physics.add.staticGroup();
        let coinData = data.coins;
        let powerupData = data.powerups;

        coinData.forEach(function(coin){
            coins.create(coin.x, coin.y, coin.image)
        });

        //coins.create returns the element, so this loop is unnecessary
        coins.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.6));
        });

        powerupData.forEach(function(powerup){
            let powerupChild = powerups.create(powerup.x, powerup.y, powerup.image);
            powerupChild.name = powerup.name;
        });

        doorData.forEach(function(door){
            doors.create(door.x, door.y, door.image);
        });

        //player.setBounce(0.2);
        player.setCollideWorldBounds(true);  // Collides with window edges

        this.physics.add.collider(player, platforms);  // Collider between two game objects
        this.physics.add.collider(coins, platforms);  // make coins land on the ground
        this.physics.add.collider(powerups, platforms);
        this.physics.add.collider(doors, platforms);

        function collectCoin (player, coin){
            coin.disableBody(true, true);
            score++;
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
            sceneTransition = true;
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

        if (cursors.space.isDown && sceneTransition) {
            sceneTransitition = false;
            this.scene.start('mediumlevelscene');  // Transitions to the next scene
        }
    }
});










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
        this.load.image('dirt_block', 'assets/dirt_block.png')
        this.load.image('dirt_platform4', 'assets/dirt_platform_4x1.png')
        this.load.image('dirt_platform50', 'assets/dirt_platform_50x1.png')
        this.load.image('grass_block', 'assets/grass_block.png')
        this.load.image('grass_platform4', 'assets/grass_platform_4x1.png')
        this.load.image('stone_block', 'assets/stone_block.png')
        this.load.image('stone_platform4', 'assets/stone_platform_4x1.png')
        this.load.image('star', 'assets/star.png')
        this.load.image('bomb', 'assets/bomb.png')
        this.load.image('emerald', 'assets/emerald.png')
        this.load.image('diamond', 'assets/diamond.png')
        this.load.image('door', 'assets/door.png')
        this.load.image('green_potion', 'assets/potion_green.png')
        this.load.image('purple_potion', 'assets/potion_purple.png')
        this.load.image('blue_potion', 'assets/potion_blue.png')

        // Levels
        this.load.json('easy-level', 'assets/story_level_easy.json')
        this.load.json('medium-level', 'assets/story_level_medium.json')
        this.load.json('hard-level', 'assets/story_level_hard.json')

        // Dynamic Objects
        this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48})
        this.load.spritesheet('zombie', 'assets/zombie.png', {frameWidth: 16, frameHeight: 32})
        this.load.spritesheet('girl', 'assets/girl.png', {frameWidth: 16, frameHeight: 32})
        this.load.spritesheet('guy', 'assets/guy.png', {frameWidth: 16, frameHeight: 32})
    },

    create: function ()
    {
        let platforms;

        let data = this.cache.json.get('medium-level');
        this.add.image(0,0,data.backgroundImage).setOrigin(0,0)
        console.log("Onto the next scene!");

        // Platforms group is a grouping for all ground objects
        platforms = this.physics.add.staticGroup();  // static object never moves
        
        let groundData = data.ground;
        let platformData = data.platforms;
        let doorData = data.doors;

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

        coins = this.physics.add.group();
        powerups = this.physics.add.staticGroup();
        doors = this.physics.add.staticGroup();
        let coinData = data.coins;
        let powerupData = data.powerups;

        coinData.forEach(function(coin){
            coins.create(coin.x, coin.y, coin.image)
        })

        //coins.create returns the element, so this loop is unnecessary
        coins.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.6));
        });

        powerupData.forEach(function(powerup){
            let powerupChild = powerups.create(powerup.x, powerup.y, powerup.image);
            powerupChild.name = powerup.name;
        })


        //player.setBounce(0.2);
        player.setCollideWorldBounds(true);  // Collides with window edges

        this.physics.add.collider(player, platforms);  // Collider between two game objects
        this.physics.add.collider(coins, platforms);  // make coins land on the ground
        this.physics.add.collider(powerups, platforms);

        function collectCoin (player, coin){
            coin.disableBody(true, true);
            score++;
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
                case "exit":
                    this.scene.start('mediumlevelscene');
                    break;
                default:
                    break;
            }
        }

        function enterDoor (player, door) {
            this.scene.start('mediumlevelscene');
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

<<<<<<< HEAD
        // if (sceneTransitition) {
        //     sceneTransitition = false;
        //     this.scene.start('mediumlevelscene');  // Transitions to the next scene
        // }
    }
=======
    }
});


var MediumLevelScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function MediumLevelScene() {
            Phaser.Scene.call(this, { key: 'mediumlevelscene' })
        },

    preload: function () {
        // Static Images
        this.load.image('village_background', 'assets/village_background.png')
        this.load.image('ground', 'assets/grass_platform_50x1.png')
        this.load.image('dirt_block', 'assets/dirt_block.png')
        this.load.image('dirt_platform4', 'assets/dirt_platform_4x1.png')
        this.load.image('dirt_platform50', 'assets/dirt_platform_50x1.png')
        this.load.image('grass_block', 'assets/grass_block.png')
        this.load.image('grass_platform4', 'assets/grass_platform_4x1.png')
        this.load.image('stone_block', 'assets/stone_block.png')
        this.load.image('stone_platform4', 'assets/stone_platform_4x1.png')
        this.load.image('star', 'assets/star.png')
        this.load.image('bomb', 'assets/bomb.png')
        this.load.image('emerald', 'assets/emerald.png')
        this.load.image('diamond', 'assets/diamond.png')
        this.load.image('door', 'assets/door.png')
        this.load.image('green_potion', 'assets/potion_green.png')
        this.load.image('purple_potion', 'assets/potion_purple.png')
        this.load.image('blue_potion', 'assets/potion_blue.png')

        // Levels
        this.load.json('easy-level', 'assets/story_level_easy.json')
        this.load.json('medium-level', 'assets/story_level_medium.json')
        this.load.json('hard-level', 'assets/story_level_hard.json')

        // Dynamic Objects
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 })
        this.load.spritesheet('zombie', 'assets/zombie.png', { frameWidth: 16, frameHeight: 32 })
        this.load.spritesheet('girl', 'assets/girl.png', { frameWidth: 16, frameHeight: 32 })
        this.load.spritesheet('guy', 'assets/guy.png', { frameWidth: 16, frameHeight: 32 })
    },

    create: function () {
        let platforms;

        let data = this.cache.json.get('medium-level');
        this.add.image(0, 0, data.backgroundImage).setOrigin(0, 0)
        console.log("Onto the next scene!");

        // Platforms group is a grouping for all ground objects
        platforms = this.physics.add.staticGroup();  // static object never moves

        let groundData = data.ground;
        let platformData = data.platforms;

        // ground and platforms are separate for now but we can combine them if not needed
        groundData.forEach(function (ground) {
            platforms.create(ground.x, ground.y, ground.image);
        })
        platformData.forEach(function (platform) {
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
            frames: [{ key: playerName, frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(playerName, { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        coins = this.physics.add.group();
        powerups = this.physics.add.staticGroup();
        let coinData = data.coins;
        let powerupData = data.powerups;

        coinData.forEach(function (coin) {
            coins.create(coin.x, coin.y, coin.image)
        })

        //coins.create returns the element, so this loop is unnecessary
        coins.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.6));
        });

        powerupData.forEach(function (powerup) {
            let powerupChild = powerups.create(powerup.x, powerup.y, powerup.image);
            powerupChild.name = powerup.name;
        })


        //player.setBounce(0.2);
        player.setCollideWorldBounds(true);  // Collides with window edges

        this.physics.add.collider(player, platforms);  // Collider between two game objects
        this.physics.add.collider(coins, platforms);  // make coins land on the ground
        this.physics.add.collider(powerups, platforms);

        function collectCoin(player, coin) {
            coin.disableBody(true, true);
            score++;
            console.log("Current score:", score);
        }

        function collectPowerup(player, powerup) {
            powerup.disableBody(true, true);
            let powerupType = powerup.name;
            switch (powerupType) {
                case "lower-gravity":
                    player.body.setGravityY(player.body.gravity.y / 2);
                    break;
                case "raise-gravity":
                    player.body.setGravityY(player.body.gravity.y * 2);
                    break;
                case "hop":
                    player.setVelocityY(-330);
                    break;
                case "exit":
                    this.scene.start('hardlevelscene');
                    break;
                default:
                    break;
            }
        }

        this.physics.add.overlap(player, coins, collectCoin, null, this);
        this.physics.add.overlap(player, powerups, collectPowerup, null, this);

        cursors = this.input.keyboard.createCursorKeys();
    },

    update: function () {
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
});

var HardLevelScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function HardLevelScene() {
            Phaser.Scene.call(this, { key: 'hardlevelscene' })
        },

    preload: function () {
        // Static Images
        this.load.image('village_background', 'assets/village_background.png')
        this.load.image('ground', 'assets/grass_platform_50x1.png')
        this.load.image('dirt_block', 'assets/dirt_block.png')
        this.load.image('dirt_platform4', 'assets/dirt_platform_4x1.png')
        this.load.image('dirt_platform50', 'assets/dirt_platform_50x1.png')
        this.load.image('grass_block', 'assets/grass_block.png')
        this.load.image('grass_platform4', 'assets/grass_platform_4x1.png')
        this.load.image('stone_block', 'assets/stone_block.png')
        this.load.image('stone_platform4', 'assets/stone_platform_4x1.png')
        this.load.image('star', 'assets/star.png')
        this.load.image('bomb', 'assets/bomb.png')
        this.load.image('emerald', 'assets/emerald.png')
        this.load.image('diamond', 'assets/diamond.png')
        this.load.image('door', 'assets/door.png')
        this.load.image('green_potion', 'assets/potion_green.png')
        this.load.image('purple_potion', 'assets/potion_purple.png')
        this.load.image('blue_potion', 'assets/potion_blue.png')

        // Levels
        this.load.json('easy-level', 'assets/story_level_easy.json')
        this.load.json('medium-level', 'assets/story_level_medium.json')
        this.load.json('hard-level', 'assets/story_level_hard.json')

        // Dynamic Objects
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 })
        this.load.spritesheet('zombie', 'assets/zombie.png', { frameWidth: 16, frameHeight: 32 })
        this.load.spritesheet('girl', 'assets/girl.png', { frameWidth: 16, frameHeight: 32 })
        this.load.spritesheet('guy', 'assets/guy.png', { frameWidth: 16, frameHeight: 32 })
    },

    create: function () {
        let platforms;

        let data = this.cache.json.get('hard-level');
        this.add.image(0, 0, data.backgroundImage).setOrigin(0, 0)
        console.log("Onto the next scene!");

        // Platforms group is a grouping for all ground objects
        platforms = this.physics.add.staticGroup();  // static object never moves

        let groundData = data.ground;
        let platformData = data.platforms;

        // ground and platforms are separate for now but we can combine them if not needed
        groundData.forEach(function (ground) {
            platforms.create(ground.x, ground.y, ground.image);
        })
        platformData.forEach(function (platform) {
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
            frames: [{ key: playerName, frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(playerName, { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        coins = this.physics.add.group();
        powerups = this.physics.add.staticGroup();
        let coinData = data.coins;
        let powerupData = data.powerups;

        coinData.forEach(function (coin) {
            coins.create(coin.x, coin.y, coin.image)
        })

        //coins.create returns the element, so this loop is unnecessary
        coins.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.6));
        });

        powerupData.forEach(function (powerup) {
            let powerupChild = powerups.create(powerup.x, powerup.y, powerup.image);
            powerupChild.name = powerup.name;
        })


        //player.setBounce(0.2);
        player.setCollideWorldBounds(true);  // Collides with window edges

        this.physics.add.collider(player, platforms);  // Collider between two game objects
        this.physics.add.collider(coins, platforms);  // make coins land on the ground
        this.physics.add.collider(powerups, platforms);

        function collectCoin(player, coin) {
            coin.disableBody(true, true);
            score++;
            console.log("Current score:", score);
        }

        function collectPowerup(player, powerup) {
            powerup.disableBody(true, true);
            let powerupType = powerup.name;
            switch (powerupType) {
                case "lower-gravity":
                    player.body.setGravityY(player.body.gravity.y / 2);
                    break;
                case "raise-gravity":
                    player.body.setGravityY(player.body.gravity.y * 2);
                    break;
                case "hop":
                    player.setVelocityY(-330);
                    break;
                case "exit":
                    this.scene.start('menuscene');
                    break;
                default:
                    break;
            }
        }

        this.physics.add.overlap(player, coins, collectCoin, null, this);
        this.physics.add.overlap(player, powerups, collectPowerup, null, this);

        cursors = this.input.keyboard.createCursorKeys();
    },

    update: function () {
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
>>>>>>> 1c21b1f8f944101b7d83d14dedf535d080a7c0aa
});