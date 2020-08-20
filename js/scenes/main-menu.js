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
        this.load.image('play_button', 'assets/PlayButton.png');
    },

    create: function ()
    {
        let data = this.cache.json.get('menu');
        console.log("Main Menu...");  //-- Debugging purposes
        this.add.image(data.background.x, data.background.y, data.background.image);
        let storyButton = this.add.image(data.button1.x, data.button1.y, data.button1.image);
        storyButton.setScale(2);
        
        // Temporary instruction
        this.add.text(275,570,'Click Play to Start!', {fontSize: '20px', fill: '#FFF' });

        storyButton.setInteractive();
        storyButton.on("pointerup", () => {
            this.scene.start('levelselectorscene');
        })
    },
});
