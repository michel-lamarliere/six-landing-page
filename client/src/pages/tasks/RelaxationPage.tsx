import React from 'react';

import TaskDetailContainer from '../../components/TaskDetailContainer/TaskDetailContainer';

import relaxationIcon from '../../assets/icons/six/relaxation.svg';

const RelaxationPage: React.FC = () => {
	return (
		<TaskDetailContainer
			icon={relaxationIcon}
			title={'Relaxation'}
			task={'relaxation'}
		/>
	);
};

export default RelaxationPage;
