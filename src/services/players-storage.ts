import {PlayerActionsHandler} from './player-actions-handler';

export class PlayerStorage {
	private players: PlayerActionsHandler[] = [];

	getAll(): PlayerActionsHandler[] {
		return this.players;
	}

	add(player: PlayerActionsHandler) {
		this.players.push(player);
	}

	getById(id: string): PlayerActionsHandler {
		const findedPlayers = this.players.find(player => {
			return player.id === id;
		});

		return findedPlayers;
	}

	removeById(id: string) {
		this.players = this.players.filter(item => item.id !== id);
	}
}
