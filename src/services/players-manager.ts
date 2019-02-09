import {PlayerStorage} from './players-storage';
import {PlayerSpriteFactory, ISetPlayerCollision} from './player-sprite-factory';
import {MainPlayerController} from './main-player-controller';
import {SocketerBase} from './socketer/abstract/socketer-base';
import {SocketEvent} from '../enums/socket-event';
import {PlayerActionsHandler} from './player-actions-handler';
import {IPlayerFrameActions} from '../dtos/player-frame-actions';

interface ICurrentPlace {
	id: string;
	x: number;
	y: number;
}

const CURRENT_PLACE_EVENT_TYPE = 'current place';
const CURRENT_PLAYERS_EVENT_TYPE = 'current players';
const DISCONNECT_PLAYER_EVENT_TYPE = 'disconnect player';

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
		// socketer.on(CURRENT_PLAYERS_EVENT_TYPE, this.handleCurrentPlayers.bind(this));
		// socketer.on(DISCONNECT_PLAYER_EVENT_TYPE, this.handleDisconnectPlayer.bind(this));
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
		const playerSprite = this.playerSpriteFactory.create();

		this.setPlayerCollision(playerSprite);

		const playerActionsHandler = new PlayerActionsHandler(id, playerSprite);

		this.playersStorage.add(playerActionsHandler);

		if (this.mainPlayerId === id) {
			this.mainPlayerController = new MainPlayerController(
				this.mainPlayerId,
				playerSprite,
				this.scene.input.keyboard.createCursorKeys(),
				this.socketer
			);
		}
	}

	// private handleMove(movePayload: IMovePayload) {
	//     var ufoPlayer = this.playersStorage.getById(movePayload.id);

	//     ufoPlayer.move(movePayload.type);
	// }

	// private handleCurrentPlayers(currentPlayers: ICurrentPlace[]) {
	//     currentPlayers.forEach(item => {
	//         this.playerFactory.create(item.id, item.x, item.y);
	//     })
	// }

	// private handleDisconnectPlayer(id: string) {
	//     var player = this.playersStorage.getById(id);
	//     player.player.disableBody(true, true);
	//     this.playersStorage.removeById(id);
	// }
}
