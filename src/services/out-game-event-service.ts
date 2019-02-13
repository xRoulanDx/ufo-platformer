import {Subject, Observable} from 'rxjs';

export class OutGameService {
	static init() {
		this.getWindow().outGame$ = new Subject<string>();
	}

	static getStream(): Observable<string> {
		return this.getSubject().asObservable();
	}

	static emit(value: string) {
		this.getSubject().next(value);
	}

	private static getWindow(): any {
		return window;
	}

	private static getSubject(): Subject<string> {
		return this.getWindow().outGame$;
	}
}
