import React from 'react';
import ReactDOM from 'react-dom';

import WarningOrErrorPopUp, {
	WarningOrErrorPopUpTypes,
} from '../components/WarningOrErrorPopUp';

interface Props {
	message: string;
}

const ErrorPopup: React.FC<Props> = (props) => {
	return ReactDOM.createPortal(
		<WarningOrErrorPopUp
			type={WarningOrErrorPopUpTypes.ERROR}
			message={props.message}
		/>,
		document.getElementById('error-popup')!
	);
};

export default ErrorPopup;
