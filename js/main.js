

let phaserConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game",  // id of DOM element parent
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 500
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

function preload() {
    // Static Images
    this.load.image('background', 'assets/background.png')
    this.load.image('ground', 'assets/platform.png')
    this.load.image('star', 'assets/star.png')
    this.load.image('bomb', 'assets/bomb.png')

    // Levels
    this.load.json('easy-level', 'assets/story_level_easy.json')

    // Dynamic Objects
    this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48})
}

function create() {

    this.add.image(0,0,'background').setOrigin(0,0)

    // Platforms group is a grouping for all ground objects
    platforms = this.physics.add.staticGroup();  // static object never moves

    let data = this.cache.json.get('easy-level');
    let groundData = data.ground;
    let platformData = data.platforms;

    platforms.create(groundData.x, groundData.y, groundData.image).setScale(2).refreshBody();  // setScale scales the size of this object
    platformData.forEach(function(platform){
        platforms.create(platform.x, platform.y, platform.image);
    })

    player = this.physics.add.sprite(100, 450, 'dude');

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //player.setBounce(0.2);
    player.setCollideWorldBounds(true);  // Collides with window edges

    this.physics.add.collider(player, platforms);  // Collider between two game objects

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
