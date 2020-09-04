let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: 0x000000,  // Black Background
    parent: 'game',
    scene: [MainMenu, LevelSelectorScene, HelpScene, EasyLevelScene, MediumLevelScene, MediumLevelScene2, HardLevelScene, HardLevelScene2, PauseScene, GeneratedLevelScene, GameOverMenu, PauseInfinite],  // Add your scene here, then follow the template scene
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

let defaultPlayerHealth = 1;
let swordDurability = 5;

// Default Player Data
let playerData = {
    name : 'girl',
    health : defaultPlayerHealth
};

// Default Zombie Data
let zombieData = {
    health : 1,
    attack : 1
};

// Constants
let score = 0;
let easyTime;
let easyScore;
let mediumTime;
let mediumScore;
let mediumTime2;
let mediumScore2;
let hardTime;
let hardScore;
let hardTime2;
let hardScore2;
let generatedTime;
let infiniteScore = 0;
let storyTime = 0;
let currentLevel = null;
let returnMenu = false;
let restartFlag = false;
let text;
let startPause;
let pElapsed;
let pTime;
let doorEnabled;
let infiniteTime = 10000; // milliseconds
