let PauseScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function PauseScene()
    {
        Phaser.Scene.call(this, { key: 'pausescene' });
    },

    preload: function()
    {
        this.load.image('window','assets/ButtonBackground.png');
        this.load.image('pause_text', 'assets/GamePausedText.png');
        this.load.image('exit', 'assets/ExitButton.png');
        this.load.image('save', 'assets/SaveButton.png');
        this.load.image('resume', 'assets/ResumeButton.png');
    },

    create: function()
    {
        console.log('Pause Menu Scene has been entered...')
        this.add.image(400,300,'window');
        this.add.image(400,275, 'pause_text');

        // Resumes the level
        let resumeButton = this.add.image(400,325,'resume');
        resumeButton.setInteractive();
        resumeButton.on("pointerup", () => {
            console.log('Game has been resumed.');
            this.scene.resume(currentLevel);
            this.scene.stop();
        })
        
        // Return to Main Menu
        let exitButton = this.add.image(360,300,'exit')
        exitButton.setInteractive();
        exitButton.on("pointerup", () => {
            console.log('Exit button.');
            this.scene.resume(currentLevel);
            this.scene.stop();
            returnMenu = true;
        })

        // Save Score
        let saveButton = this.add.image(440,300,'save')
        saveButton.setInteractive();
        saveButton.on("pointerup", () => {
            console.log('Save score.');
            // INSERT CODE TO SAVE SCORE
        })

        pauseButton = this.input.keyboard.addKey('ESC');
        pauseButton.on('up', function(event){
            console.log('Escape key has been pressed!');
            this.scene.resume(currentLevel);
            this.scene.stop();
        }, this)
    }
});