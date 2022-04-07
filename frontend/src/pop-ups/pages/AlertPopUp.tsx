import React from 'react';
import ReactDOM from 'react-dom';

import WarningOrErrorPopUp, {
	WarningOrErrorPopUpTypes,
} from '../components/WarningOrErrorPopUp';

interface Props {
	message: string;
}

const Alert: React.FC<Props> = (props) => {
	return ReactDOM.createPortal(
		<WarningOrErrorPopUp
			type={WarningOrErrorPopUpTypes.WARNING}
			message={props.message}
		/>,
		document.getElementById('alert-popup')!
	);
};

export default Alert;
