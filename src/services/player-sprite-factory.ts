export interface ISetPlayerCollision {
	(player: Phaser.Physics.Arcade.Sprite): void;
}

export class PlayerSpriteFactory {
	constructor(private scene: Phaser.Scene) {}

	create(x?: number, y?: number): Phaser.Physics.Arcade.Sprite {
		return this.initBasePlayer(x || 100, y || 450);
	}

	private initBasePlayer(x: number, y: number): Phaser.Physics.Arcade.Sprite {
		const player = this.scene.physics.add.sprite(x, y, 'dude');

		player.setCollideWorldBounds(true);

		this.scene.anims.create({
			key: 'left',
			frames: this.scene.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
			frameRate: 10,
			repeat: -1
		});

		this.scene.anims.create({
			key: 'turn',
			frames: [{key: 'dude', frame: 4}],
			frameRate: 20
		});

		this.scene.anims.create({
			key: 'right',
			frames: this.scene.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
			frameRate: 10,
			repeat: -1
		});

		return player;
	}
}
