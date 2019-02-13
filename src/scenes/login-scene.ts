import {OutGameService} from '../services/out-game-event-service';
import {take} from 'rxjs/operators';

export class LoginScene extends Phaser.Scene {
	constructor() {
		super({key: 'LoginScene'});
	}

	preload() {
		this.load.bitmapFont('font', './assets/font/font.png', './assets/font/font.fnt');
	}

	create() {
		this.add.bitmapText(
			this.sys.canvas.width / 2 - 330,
			this.sys.canvas.height / 2 - 50,
			'font',
			'ZALOGINSYA',
			100
		);

		OutGameService.getStream()
			.pipe(take(1))
			.subscribe(() => {
				this.scene.start('GameScene');
			});
	}
}
