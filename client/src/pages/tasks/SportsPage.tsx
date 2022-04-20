import React from 'react';

import TaskDetailContainer from '../../containers/TaskDetailContainer/TaskDetailContainer';

import sportsIcon from '../../assets/icons/six/sports.svg';

const SportsPage: React.FC = () => {
	return <TaskDetailContainer icon={sportsIcon} title={'Sport'} task={'sports'} />;
};

export default SportsPage;
