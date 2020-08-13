let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
<<<<<<< HEAD
    scene: [MenuScene, EasyLevelScene, MediumLevelScene],  // Add your scene here, then follow the template scene
=======
    scene: [MenuScene, EasyLevelScene, MediumLevelScene, HardLevelScene],  // Add your scene here, then follow the template scene
>>>>>>> 1c21b1f8f944101b7d83d14dedf535d080a7c0aa
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