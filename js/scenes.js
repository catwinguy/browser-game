// Might consider moving this to a Constants-Only File
const playerName = 'girl';
var player;
let score = 0;

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
        this.load.image('menu_background', 'assets/minecraftMenuBackground.jpg')
    },

    create: function ()
    {
        //console.log(this);  -- Debugging purposes
        this.add.image(0,0,'menu_background').setOrigin(0,0)
        
        // Temporary instruction
        let scoreText = this.add.text(16,16,'Press <Space> to Start...', {fontSize: '32px', fill: '#FFF' });
        
        // WILL UPDATE THIS TO BE MOUSE POINT AND CLICK
        cursors = this.input.keyboard.createCursorKeys();
    },

    update: function()
    {
        if (cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown || cursors.space.isDown)
        {
            this.scene.start('easylevelscene');  // Transitions to the next scene
        }
    }
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
        let platforms;

        let data = this.cache.json.get('easy-level');
        this.add.image(0,0,data.backgroundImage).setOrigin(0,0)
        console.log("Onto the next scene!");

        // Platforms group is a grouping for all ground objects
        platforms = this.physics.add.staticGroup();  // static object never moves
        
        let groundData = data.ground;
        let platformData = data.platforms;

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
                default:
                    break;
            }
        }

        this.physics.add.overlap(player, coins, collectCoin, null, this);
        this.physics.add.overlap(player, powerups, collectPowerup, null, this);

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
