let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
<<<<<<< HEAD
    scene: [MenuScene, EasyLevelScene, MediumLevelScene],  // Add your scene here, then follow the template scene
=======
    scene: [MainMenu, LevelSelectorScene, EasyLevelScene, MediumLevelScene, HardLevelScene],  // Add your scene here, then follow the template scene
>>>>>>> c20b77f8100148552938b0f40f467b9ea9d18417
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

let score = 0;
let playerName = 'girl';