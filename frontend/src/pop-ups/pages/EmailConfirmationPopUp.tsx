import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../_shared/store/_store';
import { EmailConfirmationPopUpActionTypes } from '../../_shared/store/pop-ups/email-confirmation-pop-up';
import { OverlayActionTypes } from '../../_shared/store/overlay';

import { useRequest } from '../../_shared/hooks/http-hook';

import RoundedButton from '../../_shared/components/UIElements/RoundedButton';
import PopUp, { PopUpTypes } from '../../_shared/components/UIElements/PopUp';

import sentIcon from '../../_shared/assets/imgs/icons/validated.svg';

import classes from './EmailConfirmationPopUp.module.scss';

const EmailPopup: React.FC = () => {
	const dispatch = useDispatch();
	const { sendRequest } = useRequest();

	const userState = useSelector((state: RootState) => state.user);

	const [sent, setSent] = useState(false);
	const [responseMessage, setResponseMessage] = useState('');

	const resendEmailConfirmationHandler = async () => {
		const responseData = await sendRequest(
			`${process.env.REACT_APP_BACKEND_URL}/user/email/email-confirmation`,
			'POST',
			JSON.stringify({ id: userState.id })
		);

		if (responseData.error) {
			setResponseMessage(responseData.message);
			return;
		}

		setResponseMessage(responseData.message);

		setSent(true);

		setTimeout(() => {
			dispatch({ type: EmailConfirmationPopUpActionTypes.HIDE });
		}, 5000);
	};

	const closePopup = () => {
		sessionStorage.setItem('showEmailConfirmationPopup', JSON.stringify(false));
		dispatch({ type: EmailConfirmationPopUpActionTypes.HIDE });
	};

	useEffect(() => {
		if (userState.confirmedEmail) {
			dispatch({ type: EmailConfirmationPopUpActionTypes.HIDE });
			dispatch({ type: OverlayActionTypes.SHOW });
		} else {
			dispatch({ type: EmailConfirmationPopUpActionTypes.SHOW });
			dispatch({ type: OverlayActionTypes.HIDE });
		}
	}, [userState.confirmedEmail]);

	return ReactDOM.createPortal(
		<PopUp
			type={PopUpTypes.CONFIRM_EMAIL_ADDRESS}
			closePopUp={closePopup}
			displayNextMessage={sent}
		>
			{!sent ? (
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
					<img src={sentIcon} alt='Envoyé' className={classes.icon} />
					<div className={classes.response}>{responseMessage}</div>
				</>
			)}
		</PopUp>,
		document.getElementById('email-confirmation-popup')!
	);
};

export default EmailPopup;
