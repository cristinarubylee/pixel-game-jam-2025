import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

        //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
        bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');

        this.load.spritesheet('idle', 'rabbeat_idle.png', { frameWidth: 90, frameHeight: 90 });
        this.load.spritesheet('walk', 'rabbeat_walk.png', { frameWidth: 90, frameHeight: 90 });
        this.load.spritesheet('jump', 'rabbeat_jump.png', { frameWidth: 90, frameHeight: 100 });
        this.load.spritesheet('punch', 'rabbeat_punch.png', { frameWidth: 90, frameHeight: 90 });

        this.load.spritesheet('zombie_walk', 'zombie_walk.png', { frameWidth: 90, frameHeight: 80});


    }

    create ()
    {
        //  Player Spritesheets
        this.textures.get('idle').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('walk').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('jump').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('punch').setFilter(Phaser.Textures.FilterMode.NEAREST);

        // Player Animations
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('walk', { start: 0, end: 7 }),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'jump_start',
            frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 2 }),
            frameRate: 12,
            repeat: 0
        });
        this.anims.create({
            key: 'jump_end',
            frames: this.anims.generateFrameNumbers('jump', { start: 2, end: 4 }),
            frameRate: 12,
            repeat: 0
        });
        this.anims.create({
            key: 'punch',
            frames: this.anims.generateFrameNumbers('punch', { start: 1, end: 3 }),
            frameRate: 12,
            repeat: 0
        });

        // Zombie Spritesheets
        this.textures.get('zombie_walk').setFilter(Phaser.Textures.FilterMode.NEAREST);

        // Zombie Animations
        this.anims.create({
            key: 'zombie_walk',
            frames: this.anims.generateFrameNumbers('zombie_walk', { start: 0, end: 1 }),
            frameRate: 1,
            repeat: -1
        });

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
