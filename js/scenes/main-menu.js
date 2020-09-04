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
        this.load.image('infinite_button', 'assets/InfiniteMode.png');
        this.load.image('girl_face', 'assets/girl_face.png');
        this.load.image('guy_face', 'assets/guy_face.png');
    },

    create: function ()
    {
        let data = this.cache.json.get('menu');
        console.log("Main Menu...");  //-- Debugging purposes  
        this.add.image(data.background.x, data.background.y, data.background.image);
        let storyButton = this.add.image(data.button1.x, data.button1.y, data.button1.image);
        let infiniteButton = this.add.image(data.button2.x, data.button2.y, data.button2.image);
        let girlButton = this.add.image(data.girlFace.x, data.girlFace.y, data.girlFace.image);
        let guyButton = this.add.image(data.guyFace.x, data.guyFace.y, data.guyFace.image);

        score = 0;
        currentLevel = null;
        returnMenu = false;

        // Temporary instruction   
        this.add.text(260,570,'Click Any Mode to Start!', {fontSize: '20px', fill: '#FFF' });

        storyButton.setInteractive();
        storyButton.on("pointerup", () => {
            this.scene.start('levelselectorscene');
        })

        infiniteButton.setInteractive();
        infiniteButton.on("pointerup", () => {
            this.scene.start('generatedlevelscene');
        })

        guyButton.setVisible(false);

        girlButton.setInteractive();
        girlButton.on("pointerup", () => {
            playerData.name = 'guy';
            girlButton.setVisible(false);
            guyButton.setVisible(true);
            console.log("You are now the " + playerData.name);
        })

        guyButton.setInteractive();
        guyButton.on("pointerup", () => {
            playerData.name = 'girl';
            guyButton.setVisible(false);
            girlButton.setVisible(true);
            console.log("You are now the " + playerData.name);
        })

    },
});
