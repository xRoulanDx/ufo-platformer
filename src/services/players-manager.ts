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
		socketer.on(SocketEvent.PlayerActions, (data: IPlayerFrameActions) => {
			const handler = this.playersStorage.getById(data.id);

			if (handler) {
				handler.handle(data.actions);
			}
		});
		socketer.on(SocketEvent.CurrentPlayers, this.handleCurrentPlayers.bind(this));
		socketer.on(SocketEvent.PlayerDisconnect, this.handleDisconnectPlayer.bind(this));
	}

	createMainPlayer(id: string) {
		this.mainPlayerId = id;
		this.socketer.emit(SocketEvent.NewPlayer, id);
	}

	update() {
		if (this.mainPlayerController) {
			this.mainPlayerController.update();
		}

		this.playersStorage.getAll().forEach(item => item.update());
	}

	private handleNewPlayer(id: string) {
		const playerSprite = this.addNewPlayer(id);

		if (this.mainPlayerId === id) {
			this.mainPlayerController = new MainPlayerController(
				this.mainPlayerId,
				this.scene,
				playerSprite,
				this.scene.input.keyboard.createCursorKeys(),
				this.socketer
			);
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

		const playerActionsHandler = new PlayerEntity(id, playerSprite, this.scene);

		this.playersStorage.add(playerActionsHandler);

		return playerSprite;
	}

	private handleDisconnectPlayer(id: string) {
		const player = this.playersStorage.getById(id);

		player.removePlayer();
		this.playersStorage.removeById(id);
	}
}
