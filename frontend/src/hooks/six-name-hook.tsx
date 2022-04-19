export const useSixNameHook = () => {
	const translateSixName = (task: string) => {
		task.toLowerCase();

		switch (task) {
			case 'nutrition':
				return 'Alimentation';
			case 'sleep':
				return 'Sommeil';
			case 'sports':
				return 'Sport';
			case 'projects':
				return 'Projets';
			case 'relaxation':
				return 'Détente';
			case 'social_life':
				return 'Vie sociale';
			default:
				return;
		}
	};

	return { translateSixName };
};
