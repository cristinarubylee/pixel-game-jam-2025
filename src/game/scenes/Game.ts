import { Scene } from 'phaser';
import Player from '../models/Player';
import Zombie from '../models/Zombie';

export class Game extends Scene {
    camera!: Phaser.Cameras.Scene2D.Camera;
    background!: Phaser.GameObjects.TileSprite;
    msg_text: Phaser.GameObjects.Text;
    player!: Player;
    zombies!: Array<Zombie>;

    world_width = 2000;
    world_height = 768;
    camera_pad = 100;

    constructor() {
        super('Game');
    }

    preload() {

    }

    create() {
        this.camera = this.cameras.main;
        this.camera.roundPixels = true;
        this.camera.setZoom(2);
        this.camera.setBounds(
            -this.camera_pad,
            this.camera_pad,
            this.world_width + this.camera_pad * 2,
            this.world_height + this.camera_pad * 2
        )

        this.background = this.add.tileSprite(512, 525, 1024, 768, 'background');

        this.msg_text = this.add.text(512, 100, 'Use W A D to move\nMake something fun!', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        this.physics.world.setBounds(0, 0, this.world_width, this.world_height);

        // Create player
        this.player = new Player(this, 512, 600);
        this.camera.startFollow(this.player);

        // Create zombies 
        this.zombies = [];

        const zombie1 = new Zombie(this, 600, 768, this.player);
        this.zombies.push(zombie1);
    }

    update(time: any) {
        this.player.update();
        this.zombies.forEach(zombie => {
            zombie.update(time);
        })

        this.background.tilePositionX = this.player.x;
        this.background.setX(this.player.x);
    }
}
