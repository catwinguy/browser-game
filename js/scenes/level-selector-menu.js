class LevelSelectorScene extends Phaser.Scene {
    constructor() {
        super('levelselectorscene');
    }

    preload()
    {
        this.load.json('level_selector', 'json/menu_level_selector.json')
        this.load.image('menu_background', 'assets/village_background.png')
        
        // NOTE: Change these assets in the future
        this.load.image('stages', 'assets/StagesButton.png');
        this.load.image('stage_1_button', 'assets/Stage1_on.png');
        this.load.image('stage_2_button', 'assets/Stage2_on.png');
        this.load.image('stage_3_button', 'assets/Stage3_on.png');
        this.load.image('stage_4_button', 'assets/Stage4_on.png');
        this.load.image('stage_5_button', 'assets/Stage5_on.png');
        this.load.image('return_button', 'assets/BackArrow.png');
    }

    create()
    {
        let data = this.cache.json.get('level_selector');
        
        // Background
        this.add.image(data.background.x, data.background.y, data.background.image);
        this.add.image(data.stageText.x,data.stageText.y, data.stageText.image);

        // Buttons
        let stage1Button = this.add.image(data.buttonS1.x, data.buttonS1.y, data.buttonS1.image);
        let stage2Button = this.add.image(data.buttonS2.x, data.buttonS2.y, data.buttonS2.image);
        let stage3Button = this.add.image(data.buttonS3.x, data.buttonS3.y, data.buttonS3.image);
        let stage4Button = this.add.image(data.buttonS4.x, data.buttonS4.y, data.buttonS4.image);
        let stage5Button = this.add.image(data.buttonS5.x, data.buttonS5.y, data.buttonS5.image);
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
            this.scene.start('mediumlevelscene2');
        })

        stage4Button.setInteractive();
        stage4Button.on("pointerup", () => {
            this.scene.start('hardlevelscene2');
        })

        stage5Button.setInteractive();
        stage5Button.on("pointerup", () => {
            this.scene.start('hardlevelscene');
        })

        returnButton.setInteractive();
        returnButton.on("pointerup", () => {
            this.scene.start('mainmenu');
        })
    }
}