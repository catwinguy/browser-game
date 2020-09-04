var PauseScene = new Phaser.Class({

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
        // this.load.image('restart', 'assets/Restart.png'); 
        this.load.image('resume', 'assets/PlayButton.png');
    },

    create: function()
    {
        console.log('Pause Menu Scene has been entered...')
        this.add.image(400,300,'window');
        this.add.image(400,280, 'pause_text');

        // Resumes the level
        let resumeButton = this.add.image(430,310,'resume').setScale(0.85);;
        resumeButton.setInteractive();
        resumeButton.on("pointerup", () => {
            console.log('Game has been resumed.');
            this.scene.resume(currentLevel);
            this.scene.stop();
            pTime = new Date();
            pElapsed = (pTime.getTime() - startPause.getTime());
        })
        
        // Return to Main Menu 
        let exitButton = this.add.image(365,310,'exit').setScale(0.85);; 
        exitButton.setInteractive();
        exitButton.on("pointerup", () => {
            console.log('Exit button.');
            this.scene.resume(currentLevel);
            this.scene.stop();
            score = 0;
            currentLevel = null;
            returnMenu = true;
        })


        pauseButton = this.input.keyboard.addKey('ESC');
        pauseButton.on('up', function(event){
            console.log('Escape key has been pressed!');
            this.scene.resume(currentLevel);
            this.scene.stop();
            pTime = new Date();
            pElapsed = (pTime.getTime() - startPause.getTime());
        }, this)
    }
});