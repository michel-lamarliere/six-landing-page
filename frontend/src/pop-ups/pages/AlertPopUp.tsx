import React from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';

import { PopUpActionTypes } from '../../_shared/store/pop-ups';
import WarningOrErrorPopUp, {
	WarningOrErrorPopUpTypes,
} from '../components/WarningOrErrorPopUp';

import closeButton from '../../_shared/assets/imgs/icons/close.svg';
import warningButton from '../../_shared/assets/imgs/icons/warning.svg';

import classes from './AlertPopUp.module.scss';

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
