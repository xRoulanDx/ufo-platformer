import {SocketerBase} from './socketer/abstract/socketer-base';
import {SocketEvent} from '../enums/socket-event';
import {MoveType} from '../enums/move-type';
import {IPlayerCurrentPosition} from '../dtos/playerCurrentPosition';
import {IFrameAction} from '../dtos/frame-action';
import {PlayerAction} from '../enums/palyer-action';
import {IAnimationAction} from '../dtos/playerActions/animation-action';
import {IPlayerFrameActions} from '../dtos/player-frame-actions';

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
		const moveActions = this.updateMoveActions();

		this.sendPlayerCurrentPosition();
		this.sendFrameActions(moveActions);
	}

	private updateMoveActions(): IFrameAction[] {
		const frameActions: IFrameAction[] = [];

		if (this.cursors.left.isDown) {
			this.isPlayerStay = false;
			this.addFrameActionToArray(
				frameActions,
				this.handleMoveAction(MoveType.Left)
			);
		} else if (this.cursors.right.isDown) {
			this.isPlayerStay = false;
			this.addFrameActionToArray(
				frameActions,
				this.handleMoveAction(MoveType.Right)
			);
		} else if (!this.isPlayerStay) {
			this.isPlayerStay = true;
			this.addFrameActionToArray(
				frameActions,
				this.handleMoveAction(MoveType.Stay)
			);
		}

		if (this.cursors.up.isDown && this.playerSprite.body.touching.down) {
			this.handleMoveAction(MoveType.Jump);
		}

		return frameActions;
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

	private handleMoveAction(type: MoveType): IFrameAction {
		switch (type) {
			case MoveType.Left:
				this.playerSprite.setVelocityX(-160);

				return this.handleAnimation('left');
			case MoveType.Right:
				this.playerSprite.setVelocityX(160);

				return this.handleAnimation('right');
			case MoveType.Jump:
				this.playerSprite.setVelocityY(-330);

				return null;
			case MoveType.Stay:
				this.playerSprite.setVelocityX(0);

				return this.handleAnimation('turn', false);
			default:
				return null;
		}
	}

	private handleAnimation(key: string, ignoreIfPlaying: boolean = true): IFrameAction {
		this.playerSprite.play(key, ignoreIfPlaying);

		return {
			type: PlayerAction.Animation,
			payload: <IAnimationAction>{
				key,
				ignoreIfPlaying
			}
		};
	}

	private addFrameActionToArray(array: IFrameAction[], action: IFrameAction) {
		if (action) {
			array.push(action);
		}
	}

	private sendFrameActions(actions: IFrameAction[]) {
		this.socketer.emit(SocketEvent.PlayerActions, <IPlayerFrameActions>{
			id: this.id,
			actions
		});
	}
}
