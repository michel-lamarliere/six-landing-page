import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../store/_store';
import { MobileSidebarActionTypes } from '../../../store/mobile-sidebar';
import { OverlayActionTypes } from '../../../store/overlay';

import classes from './HamburgerButton.module.scss';

const HamburgerButton: React.FC = () => {
	const dispatch = useDispatch();

	const mobileSidebarState = useSelector((state: RootState) => state.mobileSidebar);

	const hamburgerButtonHandler = () => {
		// if (mobileSidebarState.show) {
		// 	dispatch({ type: MobileSidebarActionTypes.HIDE_MOBILE_SIDEBAR });
		// } else {
		// 	dispatch({ type: MobileSidebarActionTypes.SHOW_MOBILE_SIDEBAR });
		// }
		dispatch({ type: MobileSidebarActionTypes.SHOW_MOBILE_SIDEBAR });
		dispatch({ type: OverlayActionTypes.SHOW_OVERLAY });
	};

	return (
		<div className={classes.wrapper} onClick={hamburgerButtonHandler}>
			<div className={classes.hamburger}>
				<span className={classes.hamburger__lign}></span>
			</div>
		</div>
	);
};

export default HamburgerButton;
