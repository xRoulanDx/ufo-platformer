import {MoveType} from '../enums/move-type';

export interface IMovePayload {
	type: MoveType;
	delta: number;
}
