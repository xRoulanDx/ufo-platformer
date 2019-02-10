import {PlayerEntity} from './player-entity';

export class PlayerStorage {
	private players: PlayerEntity[] = [];

	getAll(): PlayerEntity[] {
		return this.players;
	}

	add(player: PlayerEntity) {
		this.players.push(player);
	}

	getById(id: string): PlayerEntity {
		const findedPlayers = this.players.find(player => {
			return player.id === id;
		});

		return findedPlayers;
	}

	removeById(id: string) {
		this.players = this.players.filter(item => item.id !== id);
	}
}
