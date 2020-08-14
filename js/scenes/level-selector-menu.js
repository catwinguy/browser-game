var LevelSelectorScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function LevelSelectorScene ()
    {
        // This maps this class with the name of the scene so that it can be called by the game
        Phaser.Scene.call(this, { key: 'levelselectorscene'})
    },

    preload: function ()
    {
        this.load.json('level_selector', 'json/level_selector.json')
        this.load.image('menu_background', 'assets/village_background.png')
        
        // NOTE: Change these assets in the future
        this.load.image('stage_1_button', 'assets/StoryModeButton.png');
        this.load.image('stage_2_button', 'assets/VersusModeButton.png');
        this.load.image('stage_3_button', 'assets/VersusModeButton.png');
        this.load.image('return_button', 'assets/VersusModeButton.png');
    },

    create: function ()
    {
        let data = this.cache.json.get('level_selector');
        
        // Background
        this.add.image(data.background.x, data.background.y, data.background.image);

        // Buttons
        let stage1Button = this.add.image(data.buttonS1.x, data.buttonS1.y, data.buttonS1.image);
        let stage2Button = this.add.image(data.buttonS2.x, data.buttonS2.y, data.buttonS2.image);
        let stage3Button = this.add.image(data.buttonS3.x, data.buttonS3.y, data.buttonS3.image);
        let returnButton = this.add.image(data.returnButton.x, data.returnButton.y, data.returnButton.image);

        stage1Button.setInteractive();
        stage1Button.on("pointerup", () => {
            this.scene.start('easylevelscene');
        })

        stage2Button.setInteractive();
        stage2Button.on("pointerup", () => {
            this.scene.start('mediumlevelscene');
        })

        stage3Button.setInteractive();
        stage3Button.on("pointerup", () => {
            this.scene.start('hardlevelscene');
        })

        returnButton.setInteractive();
        returnButton.on("pointerup", () => {
            this.scene.start('mainmenu');
        })
    },
});
