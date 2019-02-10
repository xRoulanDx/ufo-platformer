import {IPlayerCurrentPosition} from '../dtos/playerCurrentPosition';

export class PlayerEntity {
	constructor(public id: string, private playerSprite: Phaser.Physics.Arcade.Sprite) {}

	removePlayer() {
		this.playerSprite.disableBody(true, true);
	}

	handleCurrentPosition(currentPosition: IPlayerCurrentPosition) {
		this.playerSprite.x = currentPosition.x;
		this.playerSprite.y = currentPosition.y;
	}
}
