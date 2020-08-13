let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    scene: [MenuScene, EasyLevelScene, MediumLevelScene, HardLevelScene],  // Add your scene here, then follow the template scene
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 250
            },
            debug: false
        }
    }
};

let game = new Phaser.Game(config);