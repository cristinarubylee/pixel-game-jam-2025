import Player from "./Player"
export default class Zombie extends Phaser.Physics.Arcade.Sprite {
    private health = 100;
    private player : Player;
    private speed = 30;
    private attackRange = 60;
    private attackCooldown = 1000;
    private lastAttackTime = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {
        super(scene, x, y, 'zombie_walk', 0);

        this.scene = scene;
        this.player = player;

        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setSize(70, 90);
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
            this.lastAttackTime = currentTime;
            this.setTint(0x0000ff);
            const dir = this.flipX ? 1 : -1;
            this.player.takeDamage(10, dir);
            this.scene.time.delayedCall(200, () => {
                this.clearTint();
            })
        }
    }

    takeDamage(damage: number, knockbackDir: number) {
        const knockbackForce = 500;
        this.setVelocityX(knockbackForce * knockbackDir);
        this.scene.cameras.main.shake(100, 0.01);

        if (this.health - damage <= 0) {
            // Play death animation
            this.destroy(true);
        } else {
            this.health -= damage;
            this.setTint(0xd0312d);
            this.scene.time.delayedCall(200, () => {
                this.clearTint();
            })
        }
    }


}