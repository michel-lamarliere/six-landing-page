export const useDates = () => {
	const getDayFn = (data: number, state: (arg0: string) => void) => {
		switch (data) {
			case 1:
				state('Lundi');
				break;
			case 2:
				state('Mardi');
				break;
			case 3:
				state('Mercredi');
				break;
			case 4:
				state('Jeudi');
				break;
			case 5:
				state('Vendredi');
				break;
			case 6:
				state('Samedi');
				break;
			case 0:
				state('Dimanche');
				break;
		}
	};

	const getMonthFn = (data: number, state: (arg0: string) => void) => {
		switch (data) {
			case 0:
				state('Janvier');
				break;
			case 1:
				state('Février');
				break;
			case 2:
				state('Mars');
				break;
			case 3:
				state('Avril');
				break;
			case 4:
				state('Mai');
				break;
			case 5:
				state('Juin');
				break;
			case 6:
				state('Juillet');
				break;
			case 7:
				state('Août');
				break;
			case 8:
				state('Septembre');
				break;
			case 9:
				state('Octobre');
				break;
			case 10:
				state('Novembre');
				break;
			case 11:
				state('Décembre');
				break;
			default:
				break;
		}

		return state;
	};

	return { getDayFn, getMonthFn };
};
