var HelpScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function HelpScene()
    {
        Phaser.Scene.call(this, { key: 'helpscene' });
    },

    preload: function()
    {
        // Images
        this.load.image('background','assets/StoneBackground.png');
        this.load.image('emerald', 'assets/emerald.png');
        this.load.image('diamond', 'assets/diamond.png');
        this.load.image('purple_potion', 'assets/potion_purple.png');
        this.load.image('blue_potion', 'assets/potion_blue.png');
        this.load.image('green_potion', 'assets/potion_green.png');
        this.load.image('sword', 'assets/sword.png');
        this.load.image('door', 'assets/door.png');
        this.load.image('return_button', 'assets/BackArrow.png');
        this.load.image('arrowkeys', 'assets/ArrowKeys.png');
        this.load.image('redWarning', 'assets/WarningCircle.png')
        this.load.image('zombie', 'assets/zombieStatic.png')

        // JSON File
        this.load.json('help', 'json/help_scene.json')
    },

    create: function()
    {
        console.log('Information Screen');

        let data = this.cache.json.get('help');
        
        // Images
        this.add.image(400,300,'background');
        let returnButton = this.add.image(data.return_button.x,data.return_button.y,data.return_button.image);
        this.add.image(data.green_potion.x,data.green_potion.y,data.green_potion.image).setScale(2);
        this.add.image(data.blue_potion.x,data.blue_potion.y,data.blue_potion.image).setScale(2);
        this.add.image(data.purple_potion.x,data.purple_potion.y,data.purple_potion.image).setScale(2);
        this.add.image(data.emerald.x,data.emerald.y,data.emerald.image).setScale(2);
        this.add.image(data.diamond.x,data.diamond.y,data.diamond.image).setScale(2);
        this.add.image(data.sword.x,data.sword.y,data.sword.image).setScale(2);
        this.add.image(data.door.x,data.door.y,data.door.image).setScale(2);
        this.add.image(data.zombie.x, data.zombie.y, data.zombie.image).setScale(0.25);
        this.add.image(data.arrows.x,data.arrows.y,data.arrows.image).setScale(0.5);
        this.add.image(data.redWarning.x,data.redWarning.y,data.redWarning.image).setScale(0.05);

        // Text
        let text = data.text;
        for (let j in text)
        {
            this.add.text(text[j].x, text[j].y, text[j].content, {fontSize: text[j].size, fill: text[j].color, fontFamily: 'VT323'});
        }

        returnButton.setInteractive();
        returnButton.on("pointerup", () => {
            this.scene.start('mainmenu');
        })
    }
});