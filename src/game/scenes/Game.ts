import { Scene } from 'phaser';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;

    player!: Phaser.Physics.Arcade.Sprite;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    keys!: { W: Phaser.Input.Keyboard.Key, A: Phaser.Input.Keyboard.Key, D: Phaser.Input.Keyboard.Key };

    constructor() {
        super('Game');
    }

    preload() {

    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);
        this.camera.roundPixels = true;
        this.camera.setZoom(2);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.msg_text = this.add.text(512, 100, 'Use W A D to move\nMake something fun!', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        // Add physics
        this.physics.world.setBounds(0, 0, 1024, 768);

        // Create player
        this.player = this.physics.add.sprite(512, 100, 'idle', 0).setScale(1);
        this.player.setCollideWorldBounds(true);

        this.camera.startFollow(this.player);

        // Add keyboard input
        this.keys = this.input.keyboard!.addKeys({
            W: 'W',
            A: 'A',
            D: 'D'
        }) as any;

        // Add animations
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
 
        this.player.play('idle');

        const ground = this.add.rectangle(512, 400, 1024, 50, 0x654321);
        this.physics.add.existing(ground, true); // Static body

        this.physics.add.collider(this.player, ground);
    }

    update() {
        const speed = 350;
        const jumpSpeed = -500;
        const isOnGround = this.player.body!.blocked.down;

        if (this.keys.A.isDown) {
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true);
            if (isOnGround) this.player.play('walk', true);
        } else if (this.keys.D.isDown) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(false);
            if (isOnGround) this.player.play('walk', true);
        } else {
            this.player.setVelocityX(0);
            if (isOnGround) this.player.play('idle', true);
        }

        if (this.keys.W.isDown && isOnGround) {
            this.player.setVelocityY(jumpSpeed);
        }

    }
}
