import {OutGameService} from './services/out-game-event-service';

export function initOutOfGameLogic() {
	document.getElementById('login_button').addEventListener('click', () => {
		const login = getValueById('login');
		const password = getValueById('password');

		OutGameService.emit('');
	});
}

function getValueById(id: string): string {
	return (document.getElementById(id) as any).vakue;
}
