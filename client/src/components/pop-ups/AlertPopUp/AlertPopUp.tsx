import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../store/_store';
import { OverlayActionTypes } from '../../../store/overlay';

import AlertOrErrorPopUp, {
	AlertOrErrorPopUpTypes,
} from '../../../containers/AlertOrErrorPopUpContainer/AlertOrErrorPopUpContainer';

interface Props {
	message: string;
}

const Alert: React.FC<Props> = (props) => {
	const dispatch = useDispatch();

	const alertPopUpState = useSelector((state: RootState) => state.alertPopUp);

	useEffect(() => {
		if (alertPopUpState.message) {
			dispatch({ type: OverlayActionTypes.SHOW_OVERLAY });
		}
	}, [alertPopUpState.message]);

	return ReactDOM.createPortal(
		<AlertOrErrorPopUp
			type={AlertOrErrorPopUpTypes.WARNING}
			message={props.message}
		/>,
		document.getElementById('alert-popup')!
	);
};

export default Alert;
