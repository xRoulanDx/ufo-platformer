import {PlayersManager} from '../services/players-manager';
import {SocketerLocal} from '../services/socketer/socketer-local';
import {SocketerBase} from '../services/socketer/abstract/socketer-base';
import {Socketer} from '../services/socketer/socketer';

export class GameScene extends Phaser.Scene {
	// objects
	private platforms: Phaser.Physics.Arcade.StaticGroup;

	// services
	private socketer: SocketerBase = new SocketerLocal();
	//   private socketer: SocketerBase = new Socketer();
	private playerManager: PlayersManager;

	constructor() {
		super({key: 'GameScene'});
	}

	preload(): void {
		this.load.pack('preload', './src/test/assets/pack.json', 'preload');

		this.load.spritesheet('dude', './src/test/assets/sprites/dude.png', {
			frameWidth: 32,
			frameHeight: 48
		});
	}

	create(): void {
		this.add.image(400, 300, 'sky');

		this.platforms = this.physics.add.staticGroup();
		this.platforms
			.create(400, 568, 'ground')
			.setScale(2)
			.refreshBody();
		this.platforms.create(600, 400, 'ground');
		this.platforms.create(50, 250, 'ground');
		this.platforms.create(750, 220, 'ground');

		const id = (+new Date()).toString(36);

		this.playerManager = new PlayersManager(this, this.socketer, player => {
			this.physics.add.collider(this.platforms, player);
		});
		this.playerManager.createMainPlayer(id);
	}

	update(): void {
		this.playerManager.update();
	}
}
