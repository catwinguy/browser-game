var GameOverMenu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameOverMenu ()
    {
        // This maps this class with the name of the scene so that it can be called by the game
        Phaser.Scene.call(this, { key: 'gameovermenu'})
    },

    preload: function ()
    {
        this.load.json('gameovermenu', 'json/game_over_menu.json')
        this.load.image('menu_background', 'assets/minecraftMenuBackground.jpg');
        this.load.image('exit', 'assets/ExitButton.png');
        this.load.image('window', 'assets/ButtonBackground.png');
    },

    create: function ()
    {
        let data = this.cache.json.get('gameovermenu');
        console.log("Game Over Menu...");  //-- Debugging purposes 
        this.add.image(data.background.x, data.background.y, data.background.image);
        this.add.text(300, 32, "Game Over", { fontSize: '40px', fill: '#FFF' });

        let exitWindow = this.add.image(data.exit.x, data.exit.y, 'window');
        exitWindow.setScale(0.5);
        let exitButton = this.add.image(data.exit.x, data.exit.y, data.exit.image);
        
        exitWindow.setInteractive();
        exitWindow.on("pointerup", () => {
            console.log('Exit button.');
            this.scene.restart();
            this.scene.start("mainmenu");
            score = 0;
            currentLevel = null;
            playerData.health = defaultPlayerHealth;
        })
    }
});
