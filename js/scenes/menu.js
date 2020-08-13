const playerName = 'girl';
var player;
let score = 0;

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
        this.load.image('menu_background', 'assets/minecraftMenuBackground.jpg')
    },

    create: function ()
    {
        //console.log(this);  -- Debugging purposes
        this.add.image(0,0,'menu_background').setOrigin(0,0)
        
        // Temporary instruction
        let scoreText = this.add.text(16,16,'Press <Space> to Start...', {fontSize: '32px', fill: '#FFF' });
        
        // WILL UPDATE THIS TO BE MOUSE POINT AND CLICK
        cursors = this.input.keyboard.createCursorKeys();
    },

    update: function()
    {
        if (cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown || cursors.space.isDown)
        {
            this.scene.start('easylevelscene');  // Transitions to the next scene
        }
    }
});