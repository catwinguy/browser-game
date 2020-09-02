// const { NONE } = require("phaser");

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: 0x000000,  // Black Background
    parent: 'game', 
    scene: [MainMenu, LevelSelectorScene, EasyLevelScene, MediumLevelScene, MediumLevelScene2, HardLevelScene, HardLevelScene2, PauseScene, GeneratedLevelScene, GameOverMenu],  // Add your scene here, then follow the template scene
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

let playerName = 'girl';

let playerData = {
    name : 'girl',
    health : 5,
    weapon : {
        equipment : null,
        attack : 0
    }
};

let zombieData = {
    health : 3,
    attack : 1
};

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
let storyTime = 0;
let currentLevel = null;
let returnMenu = false;
let text;
let startPause;
let pElapsed;
let pTime;
let doorEnabled;