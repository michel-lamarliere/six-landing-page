import React from 'react';
import ReactDOM from 'react-dom';

import Sidebar from '../../../containers/SidebarContainer/SidebarContainer';

import classes from './DesktopSidebar.module.scss';

const DesktopSidebar: React.FC = () => {
	return ReactDOM.createPortal(
		<Sidebar className={classes.wrapper} />,
		document.getElementById('desktop-sidebar')!
	);
};

export default DesktopSidebar;
