import React from 'react';
import ReactDOM from 'react-dom';

import AlertOrErrorPopUp, {
	AlertOrErrorPopUpTypes,
} from '../components/AlertOrErrorPopUp';

interface Props {
	message: string;
}

const ErrorPopup: React.FC<Props> = (props) => {
	return ReactDOM.createPortal(
		<AlertOrErrorPopUp type={AlertOrErrorPopUpTypes.ERROR} message={props.message} />,
		document.getElementById('error-popup')!
	);
};

export default ErrorPopup;
