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
        // this.load.image('restart', 'assets/Restart.png');
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
            pTime = new Date();
            pElapsed = (pTime.getTime() - startPause.getTime());
        })
        
        // Return to Main Menu
        let exitButton = this.add.image(360,300,'exit')
        exitButton.setInteractive();
        exitButton.on("pointerup", () => {
            console.log('Exit button.');
            this.scene.resume(currentLevel);
            this.scene.stop();
            score = 0;
            currentLevel = null;
            returnMenu = true;
        })

        // Save Score
        let saveButton = this.add.image(440,300,'save')
        saveButton.setInteractive();
        saveButton.on("pointerup", () => {
            console.log('Save Level.');

            if (!(easyTime === undefined || mediumTime === undefined || mediumTime2 === undefined || hardTime === undefined || hardTime2 === undefined)) {
                storyTime = (easyTime + mediumTime + mediumTime2 + hardTime + hardTime2);
            }
           
            let data = {
                score: score,
                easyTime: easyTime,
                mediumTime: mediumTime,
                mediumTime2: mediumTime2,
                hardTime: hardTime,
                hardTime2: hardTime2,
                storyTime: storyTime,
                infiniteTime: generatedTime
            }
            fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
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