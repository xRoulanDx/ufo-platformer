import {SocketerBase} from './socketer/abstract/socketer-base';
import {SocketEvent} from '../enums/socket-event';
import {MoveType} from '../enums/move-type';
import {IPlayerCurrentPosition} from '../dtos/playerCurrentPosition';

export class MainPlayerController {
	private isPlayerStay = false;
	private lastCurrentPosition: IPlayerCurrentPosition;

	constructor(
		private id: string,
		private playerSprite: Phaser.Physics.Arcade.Sprite,
		private cursors: Phaser.Input.Keyboard.CursorKeys,
		private socketer: SocketerBase
	) {}

	update() {
		this.updateMoveActions();
		this.sendPlayerCurrentPosition();
	}

	private updateMoveActions() {
		if (this.cursors.left.isDown) {
			this.isPlayerStay = false;
			this.handleMoveAction(MoveType.Left);
		} else if (this.cursors.right.isDown) {
			this.isPlayerStay = false;
			this.handleMoveAction(MoveType.Right);
		} else if (!this.isPlayerStay) {
			this.isPlayerStay = true;
			this.handleMoveAction(MoveType.Stay);
		}

		if (this.cursors.up.isDown && this.playerSprite.body.touching.down) {
			this.handleMoveAction(MoveType.Jump);
		}
	}

	private sendPlayerCurrentPosition() {
		const payload: IPlayerCurrentPosition = {
			id: this.id,
			x: this.playerSprite.x,
			y: this.playerSprite.y
		};

		if (
			(this.lastCurrentPosition &&
				(this.lastCurrentPosition.x !== payload.x ||
					this.lastCurrentPosition.y !== payload.y)) ||
			!this.lastCurrentPosition
		) {
			this.lastCurrentPosition = payload;
			this.socketer.emit(SocketEvent.PlayerCurrentPosition, payload);
		}
	}

	private handleMoveAction(type: MoveType) {
		switch (type) {
			case MoveType.Left:
				this.playerSprite.setVelocityX(-160);
				break;
			case MoveType.Right:
				this.playerSprite.setVelocityX(160);
				break;
			case MoveType.Jump:
				this.playerSprite.setVelocityY(-330);
				break;
			case MoveType.Stay:
				this.playerSprite.setVelocityX(0);
				break;
		}
	}
}
