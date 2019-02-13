import {IPlayerCurrentPosition} from '../dtos/playerCurrentPosition';
import {IFrameAction} from '../dtos/frame-action';
import {PlayerAction} from '../enums/palyer-action';
import {IAnimationAction} from '../dtos/playerActions/animation-action';

export class PlayerEntity {
	private previousTween: Phaser.Tweens.Tween;

	constructor(
		public id: string,
		private scene: Phaser.Scene,
		private playerSprite: Phaser.Physics.Arcade.Sprite
	) {}

	removePlayer() {
		this.playerSprite.disableBody(true, true);
	}

	handleCurrentPosition(currentPosition: IPlayerCurrentPosition) {
		this.previousTween = this.scene.tweens.add({
			targets: this.playerSprite,
			x: currentPosition.x,
			y: currentPosition.y,
			ease: 'Power1',
			duration: 20
		});
	}

	handlePlayerActions(actions: IFrameAction[]) {
		actions.forEach(this.handleFrameAction.bind(this));
	}

	private handleFrameAction(action: IFrameAction) {
		switch (action.type) {
			case PlayerAction.Animation:
				const animationAction: IAnimationAction = action.payload;

				this.playerSprite.play(
					animationAction.key,
					animationAction.ignoreIfPlaying
				);
		}
	}
}
