import {SocketerBase} from './abstract/socketer-base';
import {ISubscription} from './dtos/subscription.dto';

export class SocketerLocal extends SocketerBase {
	private subscriptions: ISubscription[] = [];

	on(event: string, handler: Function): ISubscription {
		const subscription: ISubscription = {event, handler};

		this.subscriptions.push(subscription);

		return subscription;
	}

	off(subscription: ISubscription) {
		this.subscriptions = this.subscriptions.filter(item => item !== subscription);
	}

	emit(event: string, payload: any) {
		this.subscriptions
			.filter(item => item.event === event)
			.forEach(item => item.handler(payload));
	}
}
