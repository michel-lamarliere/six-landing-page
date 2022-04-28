import React from 'react';
import { useDispatch } from 'react-redux';

import { MobileSidebarActionTypes } from '../../../store/mobile-sidebar';
import { OverlayActionTypes } from '../../../store/overlay';

import classes from './HamburgerButton.module.scss';

const HamburgerButton: React.FC = () => {
	const dispatch = useDispatch();

	const hamburgerButtonHandler = () => {
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
