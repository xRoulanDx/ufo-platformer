import {IFrameAction} from '../dtos/frame-action';
import {PlayerAction} from '../enums/palyer-action';
import {MoveType} from '../enums/move-type';

export class PlayerActionsHandler {
	private queue: IFrameAction[][] = [];

	constructor(public id: string, private playerSprite: Phaser.Physics.Arcade.Sprite) {}

	handle(actions: IFrameAction[]) {
		this.queue.push(actions);
	}

	update() {
		if (this.queue.length) {
			const actions = this.queue.shift();

			actions.forEach(item => this.handleFrameAction(item));
		}
	}

	private handleFrameAction(action: IFrameAction) {
		switch (action.type) {
			case PlayerAction.Move:
				this.handleMoveAction(action.payload);
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

		// if (this.setCurrentPlace) {
		//     this.setCurrentPlace(this.playerSprite.x, this.playerSprite.y);
		// }
	}
}
