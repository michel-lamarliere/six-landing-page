export const useDatesFn = () => {
	const getDayFn = (data: number, setState: (arg0: string) => void) => {
		switch (data) {
			case 1:
				setState('Lundi');
				break;
			case 2:
				setState('Mardi');
				break;
			case 3:
				setState('Mercredi');
				break;
			case 4:
				setState('Jeudi');
				break;
			case 5:
				setState('Vendredi');
				break;
			case 6:
				setState('Samedi');
				break;
			case 0:
				setState('Dimanche');
				break;
		}
	};

	const getMonthFn = (
		data: number,
		state?: boolean,
		setState?: ((arg0: string) => void) | null,
		abreviation?: boolean
	) => {
		if (state && setState) {
			switch (data) {
				case 0:
					!abreviation ? setState('Janvier') : setState('Janv.');
					break;
				case 1:
					!abreviation ? setState('Février') : setState('Fév.');
					break;
				case 2:
					!abreviation ? setState('Mars') : setState('Mars');
					break;
				case 3:
					!abreviation ? setState('Avril') : setState('Avr.');
					break;
				case 4:
					!abreviation ? setState('Mai') : setState('Mai');
					break;
				case 5:
					!abreviation ? setState('Juin') : setState('Juin');
					break;
				case 6:
					!abreviation ? setState('Juillet') : setState('Juill.');
					break;
				case 7:
					!abreviation ? setState('Août') : setState('Août');
					break;
				case 8:
					!abreviation ? setState('Septembre') : setState('Sept.');
					break;
				case 9:
					!abreviation ? setState('Octobre') : setState('Oct.');
					break;
				case 10:
					!abreviation ? setState('Novembre') : setState('Nov.');
					break;
				case 11:
					!abreviation ? setState('Décembre') : setState('Déc.');
					break;
				default:
					break;
			}
			return setState;
		} else {
			let variable = '';
			switch (data) {
				case 0:
					!abreviation ? (variable = 'Janvier') : (variable = 'Janv.');
					break;
				case 1:
					!abreviation ? (variable = 'Février') : (variable = 'Fév.');
					break;
				case 2:
					!abreviation ? (variable = 'Mars') : (variable = 'Mars');
					break;
				case 3:
					!abreviation ? (variable = 'Avril') : (variable = 'Avr.');
					break;
				case 4:
					!abreviation ? (variable = 'Mai') : (variable = 'Mai');
					break;
				case 5:
					!abreviation ? (variable = 'Juin') : (variable = 'Juin');
					break;
				case 6:
					!abreviation ? (variable = 'Juillet') : (variable = 'Juill.');
					break;
				case 7:
					!abreviation ? (variable = 'Août') : (variable = 'Août');
					break;
				case 8:
					!abreviation ? (variable = 'Septembre') : (variable = 'Sept.');
					break;
				case 9:
					!abreviation ? (variable = 'Octobre') : (variable = 'Oct.');
					break;
				case 10:
					!abreviation ? (variable = 'Novembre') : (variable = 'Nov.');
					break;
				case 11:
					!abreviation ? (variable = 'Décembre') : (variable = 'Déc.');
					break;
				default:
					break;
			}
			return variable;
		}
	};

	return { getDayFn, getMonthFn };
};
