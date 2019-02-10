import {SocketerBase} from './socketer/abstract/socketer-base';
import {SocketEvent} from '../enums/socket-event';
import {PlayerAction} from '../enums/palyer-action';
import {IFrameAction} from '../dtos/frame-action';
import {IPlayerFrameActions} from '../dtos/player-frame-actions';
import {MoveType} from '../enums/move-type';
import {IPlayerCurrentPosition} from '../dtos/playerCurrentPosition';

export class MainPlayerController {
	private isPlayerStay = false;

	constructor(
		private id: string,
		private player: Phaser.Physics.Arcade.Sprite,
		private cursors: Phaser.Input.Keyboard.CursorKeys,
		private socketer: SocketerBase
	) {}

	update() {
		const playerActionsSended = this.sendPlayerActions();

		if (playerActionsSended) {
			this.sendPlayerCurrentPosition();
		}
	}

	private sendPlayerActions(): boolean {
		const moveActions = this.getMoveActions();
		const actions: IFrameAction[] = [...moveActions];
		const payload: IPlayerFrameActions = {
			id: this.id,
			actions
		};

		if (moveActions.length) {
			this.socketer.emit(SocketEvent.PlayerActions, payload);

			return true;
		}

		return false;
	}

	private getMoveActions(): IFrameAction[] {
		const frameActions: IFrameAction[] = [];
		const type = PlayerAction.Move;

		if (this.cursors.left.isDown) {
			this.isPlayerStay = false;
			frameActions.push({
				type,
				payload: MoveType.Left
			});
		} else if (this.cursors.right.isDown) {
			this.isPlayerStay = false;
			frameActions.push({
				type,
				payload: MoveType.Right
			});
		} else if (!this.isPlayerStay) {
			this.isPlayerStay = true;
			frameActions.push({
				type,
				payload: MoveType.Stay
			});
		}

		if (this.cursors.up.isDown && this.player.body.touching.down) {
			frameActions.push({
				type,
				payload: MoveType.Jump
			});
		}

		return frameActions;
	}

	private sendPlayerCurrentPosition() {
		const payload: IPlayerCurrentPosition = {
			id: this.id,
			x: this.player.x,
			y: this.player.y
		};

		this.socketer.emit(SocketEvent.PlayerCurrentPosition, payload);
	}
}
