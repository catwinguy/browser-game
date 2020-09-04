var HelpScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function HelpScene()
    {
        Phaser.Scene.call(this, { key: 'helpscene' });
    },

    preload: function()
    {
        this.load.image('background','assets/StoneBackground.png');
        this.load.image('emerald', 'assets/emerald.png');
        this.load.image('diamond', 'assets/diamond.png');
        this.load.image('purple_potion', 'assets/potion_purple.png');
        this.load.image('blue_potion', 'assets/potion_blue.png');
        this.load.image('green_potion', 'assets/potion_green.png');
        this.load.image('sword', 'assets/sword.png');
        this.load.image('door', 'assets/dor.png');
        this.load.image('return_button', 'assets/BackArrow.png');

        this.load.json('help', 'json/help_scene.json')

        this.load.spritesheet('zombie', 'assets/zombie.png', {frameWidth: 16, frameHeight: 32});
        this.load.spritesheet('girl', 'assets/girl.png', {frameWidth: 16, frameHeight: 32});
        this.load.spritesheet('guy', 'assets/guy.png', {frameWidth: 16, frameHeight: 32});

        // this.load.image('pause_text', 'assets/GamePausedText.png');
        // this.load.image('exit', 'assets/ExitButton.png');
        // this.load.image('restart', 'assets/Restart.png'); 
        // this.load.image('resume', 'assets/PlayButton.png');
    },

    create: function()
    {
        console.log('Information Screen');
        let data = this.cache.json.get('help');
        this.add.image(400,300,'background');
        this.add.image(data.return_button.x,data.return_button.y,data.return_button.image);
        this.add.image(data.green_potion.x,data.green_potion.y,data.green_potion.image);
        this.add.image(data.blue_potion.x,data.blue_potionn.y,data.blue_potion.image);
        this.add.image(data.purple_potion.x,data.purple_potion.y,data.purple_potion.image);
        this.add.image(data.emerald.x,data.emerald.y,data.emerald.image);
        this.add.image(data.diamond.x,data.diamond.y,data.diamond.image);
        this.add.image(data.sword.x,data.sword.y,data.sword.image);
        this.add.image(data.door.x,data.door.y,data.door.image);
        
        // // Return to Main Menu 
        // let exitButton = this.add.image(325, 315, 'exit').setScale(0.75);
        // exitButton.setInteractive();
        // exitButton.on("pointerup", () => {
        //     console.log('Exit button.');
        //     this.scene.resume(currentLevel);
        //     this.scene.stop();
        //     score = 0;
        //     currentLevel = null;
        //     returnMenu = true;
        // })

        // // Restart Level
        // let restartButton = this.add.image(470,315,'restart').setScale(0.75);
        // restartButton.setInteractive();
        // restartButton.on("pointerup", () => {
        //     console.log('Restart button.');
        //     this.scene.resume(currentLevel);
        //     this.scene.stop();
        //     score = 0;
        //     currentLevel = null;
        //     restartFlag = true;
        // })
    }
});