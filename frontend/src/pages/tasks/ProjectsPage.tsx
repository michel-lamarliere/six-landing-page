import React from 'react';

import TaskDetailContainer from '../../components/TaskDetailContainer/TaskDetailContainer';

import projectsIcon from '../../assets/icons/six/projects.svg';

const ProjectsPage: React.FC = () => {
	return (
		<TaskDetailContainer icon={projectsIcon} title={'Projets'} task={'projects'} />
	);
};

export default ProjectsPage;
