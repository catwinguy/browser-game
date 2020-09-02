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
    },

    create: function ()
    {
        let data = this.cache.json.get('gameovermenu');
        console.log("Game Over Menu...");  //-- Debugging purposes
        this.add.image(data.background.x, data.background.y, data.background.image);


        console.log(easyScore);
        console.log(mediumScore);
        console.log(mediumScore2);
        console.log(hardScore);
        console.log(hardScore2);

        // let totalTime = easyTime + mediumTime + mediumTime2 + hardTime + hardTime2;
        // let finalScore = totalTime - score;
        // finalScore = finalScore.toFixed(3);
        // console.log(finalScore);
    },
});
