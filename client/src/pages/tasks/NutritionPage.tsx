import React from 'react';

import TaskDetailContainer from '../../containers/TaskDetailContainer/TaskDetailContainer';

import nutritionIcon from '../../assets/icons/six/nutrition.svg';

const NutritionPage: React.FC = () => {
	return (
		<TaskDetailContainer
			icon={nutritionIcon}
			title={'Alimentation'}
			task='nutrition'
		/>
	);
};

export default NutritionPage;
