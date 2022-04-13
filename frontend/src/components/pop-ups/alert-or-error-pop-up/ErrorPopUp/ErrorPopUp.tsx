import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../../store/_store';
import { OverlayActionTypes } from '../../../../store/overlay';

import AlertOrErrorPopUp, {
	AlertOrErrorPopUpTypes,
} from '../AlertOrErrorPopUpContainer/AlertOrErrorPopUpContainer';

interface Props {
	message: string;
}

const ErrorPopup: React.FC<Props> = (props) => {
	const dispatch = useDispatch();

	const errorPopUpState = useSelector((state: RootState) => state.errorPopUp);

	useEffect(() => {
		if (errorPopUpState.message && errorPopUpState.message.length > 0) {
			dispatch({ type: OverlayActionTypes.SHOW_OVERLAY });
			console.log('here');
		}
		// console.log(errorPopUpState.message);
	}, [errorPopUpState]);

	return ReactDOM.createPortal(
		<AlertOrErrorPopUp type={AlertOrErrorPopUpTypes.ERROR} message={props.message} />,
		document.getElementById('error-popup')!
	);
};

export default ErrorPopup;
