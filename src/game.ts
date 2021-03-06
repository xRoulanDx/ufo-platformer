import 'phaser';
import {GameScene} from './scenes/game-scene';
import {OutGameService} from './services/out-game-event-service';
import {initOutOfGameLogic} from './out-game';
import {LoginScene} from './scenes/login-scene';

const config: GameConfig = {
	width: 800,
	height: 600,
	type: Phaser.AUTO,
	parent: 'game',
	scene: [GameScene],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 300},
			debug: false
		}
	}
};

export class MyGame extends Phaser.Game {
	constructor(config: GameConfig) {
		super(config);
	}
}

let game: MyGame;

window.addEventListener('load', () => {
	OutGameService.init();
	initOutOfGameLogic();
	game = new MyGame(config);
});
