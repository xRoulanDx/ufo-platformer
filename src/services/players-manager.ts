import {PlayerStorage} from './players-storage';
import {PlayerSpriteFactory, ISetPlayerCollision} from './player-sprite-factory';
import {MainPlayerController} from './main-player-controller';
import {SocketerBase} from './socketer/abstract/socketer-base';
import {SocketEvent} from '../enums/socket-event';
import {PlayerEntity} from './player-entity';
import {IPlayerFrameActions} from '../dtos/player-frame-actions';
import {IPlayerCurrentPosition} from '../dtos/playerCurrentPosition';

export class PlayersManager {
	private playersStorage = new PlayerStorage();
	private playerSpriteFactory: PlayerSpriteFactory;
	private mainPlayerId: string;
	private mainPlayerController: MainPlayerController;

	constructor(
		private scene: Phaser.Scene,
		private socketer: SocketerBase,
		private setPlayerCollision: ISetPlayerCollision
	) {
		this.playerSpriteFactory = new PlayerSpriteFactory(scene);

		socketer.on(SocketEvent.NewPlayer, this.handleNewPlayer.bind(this));
		socketer.on(
			SocketEvent.PlayerCurrentPosition,
			this.handleCurrentPosition.bind(this)
		);
		socketer.on(SocketEvent.CurrentPlayers, this.handleCurrentPlayers.bind(this));
		socketer.on(SocketEvent.PlayerDisconnect, this.handleDisconnectPlayer.bind(this));
		socketer.on(SocketEvent.PlayerActions, this.handlePlayerActions.bind(this));
	}

	createMainPlayer(id: string) {
		this.mainPlayerId = id;
		this.socketer.emit(SocketEvent.NewPlayer, id);
	}

	update() {
		if (this.mainPlayerController) {
			this.mainPlayerController.update();
		}
	}

	private handleNewPlayer(id: string) {
		if (this.mainPlayerId === id) {
			const sprite = this.playerSpriteFactory.create();

			this.setPlayerCollision(sprite);

			this.mainPlayerController = new MainPlayerController(
				this.mainPlayerId,
				sprite,
				this.scene.input.keyboard.createCursorKeys(),
				this.socketer
			);
		} else {
			this.addNewPlayer(id);
		}
	}

	private handleCurrentPlayers(currentPlayers: IPlayerCurrentPosition[]) {
		currentPlayers.forEach(item => {
			this.addNewPlayer(item.id, item.x, item.y);
		});
	}

	private addNewPlayer(
		id: string,
		x?: number,
		y?: number
	): Phaser.Physics.Arcade.Sprite {
		const playerSprite = this.playerSpriteFactory.create(x, y);

		this.setPlayerCollision(playerSprite);

		const playerActionsHandler = new PlayerEntity(id, this.scene, playerSprite);

		this.playersStorage.add(playerActionsHandler);

		return playerSprite;
	}

	private handleDisconnectPlayer(id: string) {
		const player = this.playersStorage.getById(id);

		player.removePlayer();
		this.playersStorage.removeById(id);
	}

	private handleCurrentPosition(currentPosition: IPlayerCurrentPosition) {
		const player = this.playersStorage.getById(currentPosition.id);

		if (player) {
			player.handleCurrentPosition(currentPosition);
		}
	}

	private handlePlayerActions(playerFrameActions: IPlayerFrameActions) {
		const player = this.playersStorage.getById(playerFrameActions.id);

		if (player) {
			player.handlePlayerActions(playerFrameActions.actions);
		}
	}
}
