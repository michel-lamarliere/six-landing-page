import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store/store';
import { UIElementsActionTypes } from '../../store/ui-elements';

import classes from './HamburgerButton.module.scss';

const HamburgerButton: React.FC = () => {
	const dispatch = useDispatch();

	const hamburgerButtonHandler = () => {
		if (mobileSidebarIsOpen) {
			dispatch({ type: UIElementsActionTypes.HIDE_MOBILE_SIDEBAR });
		} else {
			dispatch({ type: UIElementsActionTypes.SHOW_MOBILE_SIDEBAR });
		}
	};

	const mobileSidebarIsOpen = useSelector(
		(state: RootState) => state.uiElements.showMobileSidebar
	);

	return (
		<div className={classes.wrapper} onClick={hamburgerButtonHandler}>
			<div
				className={`${classes.hamburger} ${
					mobileSidebarIsOpen ? classes.hamburger_open : ''
				}`}
			>
				<span className={classes.hamburger__lign}></span>
			</div>
		</div>
	);
};

export default HamburgerButton;
