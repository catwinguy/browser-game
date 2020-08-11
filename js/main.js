let currentLevel = 'easy-level';
const playerName = 'zombie';

let phaserConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game",  // id of DOM element parent
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 250
            },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

let game = new Phaser.Game(phaserConfig);
let platforms;
var player;
var cursors;
let score = 0;

function preload() {
    // Static Images
    this.load.image('background', 'assets/background.png')
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

    // Levels
    this.load.json('easy-level', 'assets/story_level_easy.json')
    this.load.json('medium-level', 'assets/story_level_medium.json')
    this.load.json('hard-level', 'assets/story_level_hard.json')

    // Dynamic Objects
    this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48})
    this.load.spritesheet('zombie', 'assets/zombie.png', {frameWidth: 16, frameHeight: 32})
    this.load.spritesheet('girl', 'assets/girl.png', {frameWidth: 16, frameHeight: 32})
    this.load.spritesheet('guy', 'assets/guy.png', {frameWidth: 16, frameHeight: 32})
}

function create() {
    let data = this.cache.json.get(currentLevel);

    this.add.image(0,0,data.backgroundImage).setOrigin(0,0)

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
}

function update() {
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
