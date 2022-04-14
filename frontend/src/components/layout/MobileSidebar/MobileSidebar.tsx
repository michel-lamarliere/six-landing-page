import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../../../store/_store';

import Sidebar from '../SidebarContainer/SidebarContainer';

import classes from './MobileSidebar.module.scss';

const MobileSidebar: React.FC = () => {
	const mobileSidebarState = useSelector((state: RootState) => state.mobileSidebar);

	useEffect(() => {
		let mobileSidebar = document.getElementById('mobile-sidebar')!;

		if (mobileSidebarState.show) {
			mobileSidebar.style.width = '75%';
		} else {
			mobileSidebar.style.width = '0%';
		}
	}, [mobileSidebarState.show]);

	return ReactDOM.createPortal(
		<>{mobileSidebarState.show && <Sidebar className={classes.wrapper} />}</>,
		document.getElementById('mobile-sidebar')!
	);
};

export default MobileSidebar;
