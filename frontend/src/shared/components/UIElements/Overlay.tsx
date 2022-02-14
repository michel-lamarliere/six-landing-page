import React from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';

import { UIElementsActionTypes } from '../../store/ui-elements';

import classes from './Overlay.module.scss';

const Overlay: React.FC = () => {
	const dispatch = useDispatch();

	const hideOverlay = () => {
		dispatch({ type: UIElementsActionTypes.TOGGLE_OVERLAY });
	};

	return ReactDOM.createPortal(
		<div className={classes.overlay} onClick={hideOverlay}></div>,
		document.getElementById('overlay')!
	);
};

export default Overlay;
