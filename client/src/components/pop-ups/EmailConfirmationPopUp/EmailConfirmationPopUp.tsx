import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../store/_store';
import { EmailConfirmationPopUpActionTypes } from '../../../store/pop-ups/email-confirmation-pop-up';
import { OverlayActionTypes } from '../../../store/overlay';

import { useRequest } from '../../../hooks/http-hook';

import RoundedButton from '../../buttons/RoundedButton/RoundedButton';
import PopUp, { PopUpTypes } from '../../../containers/PopUpContainer/PopUpContainer';

import successIcon from '../../../assets/icons/success.svg';
import errorIcon from '../../../assets/icons/error.svg';

import classes from './EmailConfirmationPopUp.module.scss';

const EmailPopup: React.FC = () => {
	const dispatch = useDispatch();
	const { sendRequest } = useRequest();

	const userState = useSelector((state: RootState) => state.user);
	const emailConfirmationPopUpState = useSelector(
		(state: RootState) => state.emailConfirmationPopUp
	);

	const [gotResponse, setGotResponse] = useState(false);
	const [successResponse, setSuccessResponse] = useState(false);
	const [responseMessage, setResponseMessage] = useState('');

	const resendEmailConfirmationHandler = async () => {
		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/user/email/email-confirmation`,
			method: 'POST',
			body: JSON.stringify({ id: userState.id }),
		});

		setGotResponse(true);

		if (responseData.error) {
			setResponseMessage(responseData.message);
			return;
		}

		setResponseMessage(responseData.message);
		setSuccessResponse(true);
	};

	const closePopup = () => {
		sessionStorage.setItem('showEmailConfirmationPopup', JSON.stringify(false));
		dispatch({
			type: EmailConfirmationPopUpActionTypes.HIDE_EMAIL_CONFIRMATION_POP_UP,
		});
		dispatch({ type: OverlayActionTypes.HIDE_OVERLAY });
	};

	useEffect(() => {
		if (emailConfirmationPopUpState.show) {
			dispatch({ type: OverlayActionTypes.SHOW_OVERLAY });
		}
	}, [emailConfirmationPopUpState.show]);

	return ReactDOM.createPortal(
		<PopUp
			type={PopUpTypes.CONFIRM_EMAIL_ADDRESS}
			closePopUp={closePopup}
			displayNextMessage={gotResponse}
		>
			{!gotResponse ? (
				<>
					<div className={classes.title}>
						Veuillez confirmer votre adresse mail.
					</div>
					<div className={classes.text}>
						Nous vous avons envoyé un mail lors de votre inscription. Pensez à
						vérifier votre boîte de réception et vos spams.
						<br /> <br /> Vous n’avez rien reçu ?
					</div>
					<RoundedButton
						text={'Renvoyer'}
						onClick={resendEmailConfirmationHandler}
						className={classes['submit-button']}
					/>
				</>
			) : (
				<>
					<img
						src={successResponse ? successIcon : errorIcon}
						alt='Envoyé'
						className={classes.icon}
					/>
					<div className={classes.response}>{responseMessage}</div>
				</>
			)}
		</PopUp>,
		document.getElementById('email-confirmation-pop-up')!
	);
};

export default EmailPopup;
