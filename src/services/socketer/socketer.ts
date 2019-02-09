import * as io from 'socket.io-client';
import {ISubscription} from './dto/subscription.dto';
import {SocketerBase} from './abstract/socketer-base';

export class Socketer extends SocketerBase {
	private ip = 'http://188.166.49.136:8080';
	private socket: SocketIOClient.Socket;

	constructor() {
		super();

		this.socket = io(this.ip);
	}

	on(event: string, handler: Function): ISubscription {
		const internalHandler = this.buildEventHandler(handler);
		const subscription: ISubscription = {
			event,
			handler: internalHandler
		};

		this.socket.on(event, internalHandler);

		return subscription;
	}

	off(subscription: ISubscription) {
		this.socket.off(subscription.event, subscription.handler);
	}

	emit(event: string, payload: any) {
		const stringifiedData = JSON.stringify(payload);

		this.socket.emit(event, stringifiedData);
	}

	private buildEventHandler(handler: Function): Function {
		return (data: string) => {
			const parsedData = JSON.parse(data);

			handler(parsedData);
		};
	}
}
