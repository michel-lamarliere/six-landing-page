import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../../../_shared/store/_store';

import Sidebar from '../components/Sidebar';

import classes from './MobileSidebar.module.scss';

const MobileSidebar: React.FC = () => {
	const uiElementsState = useSelector((state: RootState) => state.uiElements);

	useEffect(() => {
		let mobileSidebar = document.getElementById('mobile-sidebar')!;
		let main = document.getElementById('root')!;

		if (uiElementsState.showMobileSidebar) {
			mobileSidebar.style.width = '75%';
			main.style.marginRight = '75%';
		} else {
			mobileSidebar.style.width = '0%';
			main.style.marginRight = '0%';
		}
	}, [uiElementsState.showMobileSidebar]);

	return ReactDOM.createPortal(
		<>
			{uiElementsState.showMobileSidebar && <Sidebar className={classes.wrapper} />}
		</>,
		document.getElementById('mobile-sidebar')!
	);
};

export default MobileSidebar;
