import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../../../_shared/store/_store';

import Sidebar from '../components/Sidebar';

import classes from './MobileSidebar.module.scss';

const MobileSidebar: React.FC = () => {
	const mobileSidebarState = useSelector((state: RootState) => state.mobileSidebar);

	useEffect(() => {
		let mobileSidebar = document.getElementById('mobile-sidebar')!;
		let main = document.getElementById('root')!;

		if (mobileSidebarState.show) {
			mobileSidebar.style.width = '75%';
			main.style.marginRight = '75%';
		} else {
			mobileSidebar.style.width = '0%';
			main.style.marginRight = '0%';
		}
	}, [mobileSidebarState.show]);

	return ReactDOM.createPortal(
		<>{mobileSidebarState.show && <Sidebar className={classes.wrapper} />}</>,
		document.getElementById('mobile-sidebar')!
	);
};

export default MobileSidebar;
