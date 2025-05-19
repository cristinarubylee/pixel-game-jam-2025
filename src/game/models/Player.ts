import Zombie from "./Zombie";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    keys: {
        up: Phaser.Input.Keyboard.Key,
        left: Phaser.Input.Keyboard.Key,
        right: Phaser.Input.Keyboard.Key,
        punch: Phaser.Input.Keyboard.Key
    }
    scene: Phaser.Scene;
    
    private speed = 350;
    private jumpSpeed = -500;
    private isPunching = false;

    punchHitBox : any;
    hitEnemies = new Set<Zombie>();
    health = 100;
    private punchOffsets : {[key: number]: {x: number, y: number}} = {
        0: {x : 20, y : 10},
        1: {x : 20, y : 10},
        2: {x : 22, y : 10},
        3: {x : 25, y : 10}
    }
    
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'idle', 0)
        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        // this.setScale(2);
        this.setSize(60, 90);

        this.punchHitBox = scene.add.rectangle(this.x, this.y, 40, 25, 0xffffff, 0) as Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
        scene.add.existing(this.punchHitBox);
        scene.physics.add.existing(this.punchHitBox);
        this.punchHitBox.body.setAllowGravity(false);
        this.punchHitBox.body.setImmovable(true);
        this.punchHitBox.body.enable = false;
        this.punchHitBox.body.debugShowBody = false;

        this.keys = scene.input.keyboard!.addKeys({
            up: 'W',
            left: 'A',
            right: 'D',
            punch: 'J'
        }) as any;

        this.play('idle')

        // Camera shake and hitbox adjustments
        this.on(Phaser.Animations.Events.ANIMATION_UPDATE, (anim : Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
            if (anim.key === 'punch') {
                // Enable punchHitBox only when animation is playing
                this.punchHitBox.body.enable = true;
                this.punchHitBox.body.debugShowBody = true;
                const offset = this.punchOffsets[frame.index] || { x: 20, y: 10};
                const dir = this.flipX ? -1 : 1;
                this.punchHitBox.setPosition(this.x + dir * offset.x, this.y + offset.y);
            }
        });
    }

    update() {
        const isOnGround = this.body!.blocked.down;

        // Punching
        if (Phaser.Input.Keyboard.JustDown(this.keys.punch) && !this.isPunching) {
            this.play('punch', true);
            this.setVelocityX(0);
            this.isPunching = true;

            // Reset punching flag when animation completes
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.isPunching = false;
                this.punchHitBox.body.debugShowBody = false;
                this.punchHitBox.body.enable = false;

                this.hitEnemies.clear();
            });

            return;
        }

        // Prevent other animations during punching
        if (this.isPunching) {
            this.setVelocityX(0);
            return;
        } 

        // Horizontal movement
        if (this.keys.left.isDown) {
            this.setVelocityX(-this.speed);
            this.setFlipX(true);
            if (isOnGround) this.play('walk', true);
        } else if (this.keys.right.isDown) {
            this.setVelocityX(this.speed);
            this.setFlipX(false);
            if (isOnGround) this.play('walk', true);
        } else {
            this.setVelocityX(0);
            if (isOnGround) this.play('idle', true);
        }

        // Jumping
        if (this.keys.up.isDown && isOnGround) {
            this.play('jump_start', true);
            this.setVelocityY(this.jumpSpeed);
        }

        // Falling
        if (!isOnGround && this.body!.velocity.y > 0 && this.anims.currentAnim?.key !== 'jump_end') {
            this.play('jump_end', true);
        }
    }

    takeDamage(damage: number, knockbackDir: number) {
        const knockbackForce = 200;
        this.setVelocityX(knockbackForce * knockbackDir);
        this.scene.cameras.main.shake(10, 0.05);

        if (this.health - damage <= 0) {
            // Play death animation
            this.health = 0;
            this.setVisible(false);
            this.setActive(false);
        } else {
            this.health -= damage;
            this.setTint(0xd0312d);
            this.scene.time.delayedCall(200, () => {
                this.clearTint();
            })
        }
    }

}