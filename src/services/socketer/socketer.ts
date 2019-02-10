import * as io from 'socket.io-client';
import {ISubscription} from './dtos/subscription.dto';
import {SocketerBase} from './abstract/socketer-base';

export class Socketer extends SocketerBase {
	private ip = 'http://104.248.248.87:8080';
	private socket: SocketIOClient.Socket;

	constructor() {
		super();

		this.socket = io(this.ip);
	}

	on(event: string, handler: Function): ISubscription {
		// tslint:disable-next-line:no-console
		console.log('ON', event);

		const subscription: ISubscription = {
			event,
			handler
		};

		this.socket.on(event, handler);

		return subscription;
	}

	off(subscription: ISubscription) {
		this.socket.off(subscription.event, subscription.handler);
	}

	emit(event: string, payload: any) {
		// tslint:disable-next-line:no-console
		console.log('EMIT', event, payload);

		this.socket.emit(event, payload);
	}
}
