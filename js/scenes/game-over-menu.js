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
        currentLevel = null;
        this.add.image(data.background.x, data.background.y, data.background.image);
        this.add.text(300, 32, "Game Over", { fontSize: '40px', fill: '#FFF' });
        text = this.add.text(1000, 1000, 'time: 0ms', { font: '20px Arial' });

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
        });
        if (easyScore === undefined &&
            mediumScore === undefined &&
            mediumScore2 === undefined &&
            hardScore === undefined &&
            hardScore2 === undefined)
        {
            //let scoreText = "Score: " + infiniteScore;
            this.add.text(310, 200, "Score: " + infiniteScore, { fontSize: '40px', fill: '#FFF' });
        }
        else {
            let score1 = easyScore || 0;
            let score2 = mediumScore || 0;
            let score3 = mediumScore2 || 0;
            let score4 = hardScore || 0;
            let score5 = hardScore2 || 0;
            let totalScore = score1 + score2 + score3 + score4 + score5;
            this.add.text(275, 96, "Level 1: " + score1, { fontSize: '40px', fill: '#FFF' });
            this.add.text(275, 160, "Level 2: " + score2, { fontSize: '40px', fill: '#FFF' });
            this.add.text(275, 224, "Level 3: " + score3, { fontSize: '40px', fill: '#FFF' });
            this.add.text(275, 288, "Level 4: " + score4, { fontSize: '40px', fill: '#FFF' });
            this.add.text(275, 352, "Level 5: " + score5, { fontSize: '40px', fill: '#FFF' });
            this.add.text(275, 416, "Total: " + totalScore, { fontSize: '40px', fill: '#FFF' });
            this.add.text(30, 575, "Note: Your total does not represent your best time if you have not completed all levels.", { fontSize: '14px', fill: '#FFF' });
        }
    }
});
