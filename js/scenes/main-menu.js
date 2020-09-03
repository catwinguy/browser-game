var MainMenu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MainMenu ()
    {
        // This maps this class with the name of the scene so that it can be called by the game
        Phaser.Scene.call(this, { key: 'mainmenu'})
    },

    preload: function ()
    {
        this.load.json('menu', 'json/menu.json')
        this.load.image('menu_background', 'assets/minecraftMenuBackground.jpg');
        this.load.image('story_button', 'assets/StoryModeButton.png');
        this.load.image('infinite_button', 'assets/InfiniteMode.png')
    },

    create: function ()
    {
        let data = this.cache.json.get('menu');
        console.log("Main Menu...");  //-- Debugging purposes  
        this.add.image(data.background.x, data.background.y, data.background.image);
        let storyButton = this.add.image(data.button1.x, data.button1.y, data.button1.image);
        let infiniteButton = this.add.image(data.button2.x, data.button2.y, data.button2.image);

        score = 0;
        currentLevel = null;
        returnMenu = false;

        // Temporary instruction   
        this.add.text(275,570,'Click Any Mode to Start!', {fontSize: '20px', fill: '#FFF' });

        storyButton.setInteractive();
        storyButton.on("pointerup", () => {
            this.scene.start('levelselectorscene');
        })

        infiniteButton.setInteractive();
        infiniteButton.on("pointerup", () => {
            this.scene.start('generatedlevelscene');
        })
    },
});
