import { Dispatch, SetStateAction } from 'react';

export enum getMonthFnTypes {
	VARIABLE = 'VARIABLE',
	STATE = 'STATE',
}

export const useDatesFn = () => {
	const getDayFn = (args: { dayNumber: number; setState: (arg0: string) => void }) => {
		const { dayNumber, setState } = args;

		switch (dayNumber) {
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

	const getMonthFn = (args: {
		type: getMonthFnTypes.VARIABLE | getMonthFnTypes.STATE;
		monthNumber: number;
		abbreviation: boolean;
		setState?: Dispatch<SetStateAction<string>>;
	}): string | Dispatch<SetStateAction<string>> => {
		const { type, monthNumber, abbreviation, setState } = args;

		if (type === getMonthFnTypes.STATE && setState) {
			switch (monthNumber) {
				case 0:
					!abbreviation ? setState('Janvier') : setState('Janv.');
					break;
				case 1:
					!abbreviation ? setState('Février') : setState('Fév.');
					break;
				case 2:
					!abbreviation ? setState('Mars') : setState('Mars');
					break;
				case 3:
					!abbreviation ? setState('Avril') : setState('Avr.');
					break;
				case 4:
					!abbreviation ? setState('Mai') : setState('Mai');
					break;
				case 5:
					!abbreviation ? setState('Juin') : setState('Juin');
					break;
				case 6:
					!abbreviation ? setState('Juillet') : setState('Juill.');
					break;
				case 7:
					!abbreviation ? setState('Août') : setState('Août');
					break;
				case 8:
					!abbreviation ? setState('Septembre') : setState('Sept.');
					break;
				case 9:
					!abbreviation ? setState('Octobre') : setState('Oct.');
					break;
				case 10:
					!abbreviation ? setState('Novembre') : setState('Nov.');
					break;
				case 11:
					!abbreviation ? setState('Décembre') : setState('Déc.');
					break;
				default:
					break;
			}

			return setState;
		} else {
			let variable: string = '';

			switch (monthNumber) {
				case 0:
					!abbreviation ? (variable = 'Janvier') : (variable = 'Janv.');
					break;
				case 1:
					!abbreviation ? (variable = 'Février') : (variable = 'Fév.');
					break;
				case 2:
					!abbreviation ? (variable = 'Mars') : (variable = 'Mars');
					break;
				case 3:
					!abbreviation ? (variable = 'Avril') : (variable = 'Avr.');
					break;
				case 4:
					!abbreviation ? (variable = 'Mai') : (variable = 'Mai');
					break;
				case 5:
					!abbreviation ? (variable = 'Juin') : (variable = 'Juin');
					break;
				case 6:
					!abbreviation ? (variable = 'Juillet') : (variable = 'Juill.');
					break;
				case 7:
					!abbreviation ? (variable = 'Août') : (variable = 'Août');
					break;
				case 8:
					!abbreviation ? (variable = 'Septembre') : (variable = 'Sept.');
					break;
				case 9:
					!abbreviation ? (variable = 'Octobre') : (variable = 'Oct.');
					break;
				case 10:
					!abbreviation ? (variable = 'Novembre') : (variable = 'Nov.');
					break;
				case 11:
					!abbreviation ? (variable = 'Décembre') : (variable = 'Déc.');
					break;
				default:
					break;
			}
			return variable;
		}
	};

	return { getDayFn, getMonthFn };
};
