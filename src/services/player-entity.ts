import {IFrameAction} from '../dtos/frame-action';
import {PlayerAction} from '../enums/palyer-action';
import {MoveType} from '../enums/move-type';
import {ShootDirection} from '../enums/shoot-direction';
import {Bullet} from '../objects/bullet';

export class PlayerEntity {
	private queue: IFrameAction[][] = [];
	private bullets: Phaser.GameObjects.Group;

	constructor(
		public id: string,
		private playerSprite: Phaser.Physics.Arcade.Sprite,
		private scene: Phaser.Scene
	) {
		this.bullets = this.scene.add.group({
			classType: Bullet,
			active: true,
			runChildUpdate: true
		});
	}

	handle(actions: IFrameAction[]) {
		this.queue.push(actions);
	}

	update() {
		if (this.queue.length) {
			const actions = this.queue.shift();

			actions.forEach(item => this.handleFrameAction(item));
		}
	}

	removePlayer() {
		this.playerSprite.disableBody(true, true);
	}

	private handleFrameAction(action: IFrameAction) {
		switch (action.type) {
			case PlayerAction.Move:
				this.handleMoveAction(action.payload);
				break;
			case PlayerAction.Shoot:
				this.handleShootAction(action.payload);
				break;
		}
	}

	private handleMoveAction(type: MoveType) {
		switch (type) {
			case MoveType.Left:
				this.playerSprite.setVelocityX(-160);
				this.playerSprite.anims.play('left', true);
				break;
			case MoveType.Right:
				this.playerSprite.setVelocityX(160);
				this.playerSprite.anims.play('right', true);
				break;
			case MoveType.Jump:
				this.playerSprite.setVelocityY(-330);
				break;
			case MoveType.Stay:
				this.playerSprite.setVelocityX(0);
				this.playerSprite.anims.play('turn', true);
				break;
		}
	}

	private handleShootAction(shootDirection: ShootDirection) {
		this.bullets.add(
			new Bullet({
				scene: this.scene,
				x: this.playerSprite.x,
				y: this.playerSprite.y,
				shootDirection
			})
		);
	}
}
