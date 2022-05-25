import React from 'react';

import TaskDetailContainer from '../../containers/TaskDetailContainer/TaskDetailContainer';

import socialLifeIcon from '../../assets/icons/six/social_life.svg';

const SocialLifePage: React.FC = () => {
	return (
		<TaskDetailContainer
			icon={socialLifeIcon}
			title={'Vie sociale'}
			task={'social_life'}
		/>
	);
};

export default SocialLifePage;
