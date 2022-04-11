export const useSixNameHook = () => {
	const translateSixName = (task: string) => {
		task.toLowerCase();

		switch (task) {
			case 'food':
				return 'Alimentation';
			case 'sleep':
				return 'Sommeil';
			case 'sport':
				return 'Sport';
			case 'work':
				return 'Projet';
			case 'relaxation':
				return 'Détente';
			case 'social':
				return 'Vie sociale';
			default:
				return;
		}
	};

	return { translateSixName };
};
