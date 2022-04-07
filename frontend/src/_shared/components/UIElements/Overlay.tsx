import React from 'react';
import ReactDOM from 'react-dom';

import classes from './Overlay.module.scss';

const Overlay: React.FC = () => {
	const hideOverlay = () => {};

	return ReactDOM.createPortal(
		<div className={classes.overlay} onClick={hideOverlay}></div>,
		document.getElementById('overlay')!
	);
};

export default Overlay;
