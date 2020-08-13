var MenuScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MenuScene ()
    {
        // This maps this class with the name of the scene so that it can be called by the game
        Phaser.Scene.call(this, { key: 'menuscene'})
    },

    preload: function ()
    {
        this.load.json('menu', 'assets/menu.json')
        this.load.image('menu_background', 'assets/minecraftMenuBackground.jpg');
        this.load.image('story_mode_button', 'assets/StoryModeButton.png');
        this.load.image('versus_mode_button', 'assets/VersusModeButton.png');
    },

    create: function ()
    {
        let data = this.cache.json.get('menu');
        //console.log(this);  -- Debugging purposes
        let background = this.add.image(data.background.x, data.background.y, data.background.image);
        let storyButton = this.add.image(data.button1.x, data.button1.y, data.button1.image);
        let versusButton = this.add.image(data.button2.x, data.button2.y, data.button2.image);
        
        // Temporary instruction
        let scoreText = this.add.text(225,580,'Click on Story Mode to Start!', {fontSize: '20px', fill: '#FFF' });
        let message = this.add.text(430,450, "Under Construction!", {fontSize: '30px', fill: '#FFF'})
        message.setVisible(false);

        storyButton.setInteractive();
        storyButton.on("pointerup", () => {
            message.setVisible(false);
            this.scene.start('easylevelscene');
        })
        versusButton.setInteractive();
        versusButton.on("pointerup", () => {
            //scoreText.setText('Currently under construction!');
            message.setVisible(true);
            console.log("Next menu in progress!");
        })
        background.setInteractive();
        background.on("pointerup", () => {
            message.setVisible(false);
        })
    },
});
