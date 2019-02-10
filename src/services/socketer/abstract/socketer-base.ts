import {ISubscription} from '../dtos/subscription.dto';

export abstract class SocketerBase {
	abstract on(event: string, handler: Function): ISubscription;

	abstract off(subscription: ISubscription): void;

	abstract emit(event: string, payload: any): void;
}
