import {PlayerAction} from '../enums/palyer-action';

export interface IFrameAction {
	type: PlayerAction;
	payload: any;
}
