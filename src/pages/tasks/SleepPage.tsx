import React from 'react';

import TaskDetailContainer from '../../containers/TaskDetailContainer/TaskDetailContainer';

import sleepIcon from '../../assets/icons/six/sleep.svg';

const SleepPage: React.FC = () => {
	return <TaskDetailContainer icon={sleepIcon} title={'Sommeil'} task={'sleep'} />;
};

export default SleepPage;
