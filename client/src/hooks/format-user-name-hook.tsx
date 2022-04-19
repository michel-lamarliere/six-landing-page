export const useFormatUserName = () => {
	const formatUserName = (name: string) => {
		let formattedName = '';
		if (!name) return;

		if (name.match(/-/)) {
			let part1 = name.split('-')[0];
			part1 = part1.slice(0, 1).toUpperCase() + part1.slice(1);

			let part2 = name.split('-')[1];
			part2 = part2.slice(0, 1).toUpperCase() + part2.slice(1);

			formattedName = `${part1}-${part2}`;
		} else {
			formattedName = name?.slice(0, 1).toUpperCase() + name.slice(1);
		}
		return formattedName;
	};

	return { formatUserName };
};
