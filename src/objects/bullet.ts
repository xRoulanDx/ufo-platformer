import {ShootDirection} from '../enums/shoot-direction';

export interface IBulletParams {
	scene: Phaser.Scene;
	x: number;
	y: number;
	shootDirection: ShootDirection;
}

export class Bullet extends Phaser.GameObjects.Image {
	private currentScene: Phaser.Scene;
	private speed = 1000;

	constructor(params: IBulletParams) {
		super(params.scene, params.x, params.y, 'bomb');
		this.currentScene = params.scene;
		this.speed = this.getSpeed(params.shootDirection);
		this.initImage();
		this.currentScene.add.existing(this);
	}

	private initImage(): void {
		this.currentScene.physics.world.enable(this);
		this.currentScene.physics.velocityFromAngle(0, this.speed, this.body.velocity);
	}

	private getSpeed(direction: ShootDirection): number {
		switch (direction) {
			case ShootDirection.Left:
				return -1000;
			default:
				return 1000;
		}
	}

	update(): void {}
}
