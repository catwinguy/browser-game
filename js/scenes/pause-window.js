let PauseScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function PauseScene()
    {
        Phaser.Scene.call(this, { key: 'pausescene' });
    },

    preload: function()
    {
        this.load.image('return_button', 'assets/ReturnButton.png');
    },

    create: function()
    {
        console.log('Pause Menu Scene has been entered...')
        let returnButton = this.add.image(400,300,'return_button');
        returnButton.setInteractive();
        returnButton.on("pointerup", () => {
            console.log('Return button has been pressed...');
            this.scene.resume(currentLevel);
            this.scene.stop();
        })

        pauseButton = this.input.keyboard.addKey('ESC');
        pauseButton.on('up', function(event){
            console.log('Escape key has been pressed!');
            this.scene.resume(currentLevel);
            this.scene.stop();
        }, this)
    }
});