import Player from "./Player"
export default class Zombie extends Phaser.Physics.Arcade.Sprite {
    private health = 100;
    private player : Player;
    private speed = Phaser.Math.Between(30,50);

    private attackRange = 60;
    private attackCooldown = 1000;
    private lastAttackTime = 0;
    isAttacking = false;
    isTouchingPlayer = false;

    private stunnedUntil = 0;

    punchHitBox : any;
    private punchOffsets : {[key: number]: {x: number, y: number}} = {
        4: {x : 20, y : 0},
        5: {x : 20, y : -10}
    }

    constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {
        super(scene, x, y, 'zombie_walk', 0);

        this.scene = scene;
        this.player = player;

        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setDrag(1000);
        this.setSize(50, 80);

        this.punchHitBox = scene.add.rectangle(this.x, this.y, 40, 25, 0xffffff, 0) as Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
        scene.add.existing(this.punchHitBox);
        scene.physics.add.existing(this.punchHitBox);
        this.punchHitBox.body.setAllowGravity(false);
        this.punchHitBox.body.setImmovable(true);
        this.punchHitBox.body.enable = false;
        this.punchHitBox.body.debugShowBody = false;

        this.play('zombie_walk');

        this.on(Phaser.Animations.Events.ANIMATION_UPDATE, (anim : Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
            if (anim.key === 'zombie_attack' && (frame.index == 4 || frame.index == 5)) {
                // Enable punchHitBox only at second half of animation
                this.punchHitBox.body.enable = true;
                this.punchHitBox.body.debugShowBody = true;
                const offset = this.punchOffsets[frame.index] || { x: 20, y: 10};
                const dir = this.flipX ? -1 : 1;
                this.punchHitBox.setPosition(this.x + dir * offset.x, this.y + offset.y);
            }
        });
    }

    update(time: number) {
        if (!this.active || !this.player.active) return;

        if (time < this.stunnedUntil) {
            return;
        }

        const distance = Phaser.Math.Distance.Between(
            this.x, this.y,
            this.player.x, this.player.y
        )

        if (this.player.x < this.x) {
            this.setFlipX(true);
        } else {
            this.setFlipX(false); 
        }

        if (distance > this.attackRange && !this.isAttacking) {
            this.punchHitBox.body.debugShowBody = false;
            this.punchHitBox.body.enable = false;
            this.isTouchingPlayer = false;
            this.play('zombie_walk', true);
            this.scene.physics.moveToObject(this, this.player, this.speed);
            this.setVelocityY(0);
        } else {
            this.setVelocity(0);
            this.attack(time);
        }
    }

    attack(currentTime: number) {
        if (currentTime - this.lastAttackTime >= this.attackCooldown) {
            this.isAttacking = true;
            this.play('zombie_attack', true);
            this.lastAttackTime = currentTime;
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.punchHitBox.body.debugShowBody = false;
                this.punchHitBox.body.enable = false;
                this.isTouchingPlayer = false;
                this.isAttacking = false;
            });
        }
    }

    takeDamage(damage: number, knockbackDir: number) {
        const knockbackForce = 200;
        const stunDuration = 1000;

        this.setVelocityX(knockbackForce * knockbackDir);
        this.scene.cameras.main.shake(100, 0.01);
        this.stunnedUntil = this.scene.time.now + stunDuration;

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