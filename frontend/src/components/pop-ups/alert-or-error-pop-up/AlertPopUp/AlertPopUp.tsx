import React from 'react';
import ReactDOM from 'react-dom';

import AlertOrErrorPopUp, {
	AlertOrErrorPopUpTypes,
} from '../AlertOrErrorPopUpContainer/AlertOrErrorPopUpContainer';

interface Props {
	message: string;
}

const Alert: React.FC<Props> = (props) => {
	return ReactDOM.createPortal(
		<AlertOrErrorPopUp
			type={AlertOrErrorPopUpTypes.WARNING}
			message={props.message}
		/>,
		document.getElementById('alert-popup')!
	);
};

export default Alert;
