import Player from "./Player"
export default class Zombie extends Phaser.Physics.Arcade.Sprite {
    private player : Player;
    private speed = 30;
    private attackRange = 30;
    private attackCooldown = 1000;
    private lastAttackTime = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {
        super(scene, x, y, 'zombie_walk', 0);

        this.scene = scene;
        this.player = player;

        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.setCollideWorldBounds(true);
    }

    update(time: number) {
        if (!this.active || !this.player.active) return;

        const distance = Phaser.Math.Distance.Between(
            this.x, this.y,
            this.player.x, this.player.y
        )

        if (this.player.x > this.x) {
            this.setFlipX(true);
        } else {
            this.setFlipX(false); 
        }

        if (distance > this.attackRange) {
            this.scene.physics.moveToObject(this, this.player, this.speed);
            this.setVelocityY(0);
        } else {
            this.setVelocity(0);
            this.attack(time);
        }
    }

    attack(currentTime: number) {
        if (currentTime - this.lastAttackTime >= this.attackCooldown) {
            this.setTint(0x0000ff);
            this.scene.time.delayedCall(200, () => {
                this.clearTint();
            })
        }
    }
}