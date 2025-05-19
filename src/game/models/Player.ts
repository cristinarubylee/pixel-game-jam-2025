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
    
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'idle', 0)
        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        // this.setScale(2);

        this.keys = scene.input.keyboard!.addKeys({
            up: 'W',
            left: 'A',
            right: 'D',
            punch: 'J'
        }) as any;

        this.play('idle')

        // Camera shake
        this.on(Phaser.Animations.Events.ANIMATION_UPDATE, (anim : Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
            if (anim.key === 'punch' && frame.index === 3) {
                this.scene.cameras.main.shake(100, 0.01);
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

}