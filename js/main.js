let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: 0x000000,  // Black Background
    parent: 'game',
    scene: [MainMenu, LevelSelectorScene, PauseScene, EasyLevelScene, EasyLevelScene2, MediumLevelScene, MediumLevelScene2, HardLevelScene, HardLevelScene2],  // Add your scene here, then follow the template scene
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
let currentLevel = null;
let returnMenu = false;