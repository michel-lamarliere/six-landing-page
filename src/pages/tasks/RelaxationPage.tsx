import React from 'react';

import TaskDetailContainer from '../../containers/TaskDetailContainer/TaskDetailContainer';

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
