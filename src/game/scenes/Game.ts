import { Scene } from 'phaser';
import Player from '../models/Player';
import Zombie from '../models/Zombie';

export class Game extends Scene {
    camera!: Phaser.Cameras.Scene2D.Camera;
    background!: Phaser.GameObjects.TileSprite;
    msg_text: Phaser.GameObjects.Text;

    player_health_bar: Phaser.GameObjects.Rectangle;

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
        // Camera settings
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
        this.physics.world.setBounds(0, 0, this.world_width, this.world_height);

        this.msg_text = this.add.text(512, 100, 'Use W A D to move\nMake something fun!', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        // HUD
        this.add.rectangle(512, 200, 468, 32).setStrokeStyle(1, 0xffffff).setScrollFactor(0);
        this.player_health_bar = this.add.rectangle(512-230, 200, 0, 28, 0xffffff).setScrollFactor(0);

        // Create player
        this.player = new Player(this, 512, 600);
        this.camera.startFollow(this.player);

        // Create zombies 
        this.zombies = [];
        this.createZombie(600, 768);
        this.createZombie(100, 768);
        this.createZombie(200, 768);
    }

    update(time: any) {
        this.player.update();
        this.zombies.forEach(zombie => {
            zombie.update(time);
        })

        this.background.tilePositionX = this.player.x;
        this.background.setX(this.player.x);

        // Update HUD
        this.player_health_bar.width = (460 * this.player.health/100);
        
    }

    private createZombie(x: number, y: number){
        const zombie = new Zombie(this, x, y, this.player);
        this.zombies.push(zombie);
        this.physics.add.overlap(
            this.player.punchHitBox, zombie, () => {
                if (!this.player.hitEnemies.has(zombie)) {
                    const dir = this.player.flipX ? -1 : 1;
                    this.player.hitEnemies.add(zombie);
                    zombie.takeDamage(10, dir);
                }
            }
        )
    }
}
