import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../_shared/store/store';
import { EmailConfirmationActionTypes } from '../_shared/store/email-confirmation';
import { UIElementsActionTypes } from '../_shared/store/ui-elements';

import { useRequest } from '../_shared/hooks/http-hook';

import warningIcon from '../_shared/assets/imgs/icons/warning.svg';
import closeIcon from '../_shared/assets/imgs/icons/close.svg';
import sentIcon from '../_shared/assets/imgs/icons/validated.svg';

import classes from './EmailConfirmation.module.scss';

const EmailPopup: React.FC = () => {
	const dispatch = useDispatch();
	const { sendRequest } = useRequest();

	const userState = useSelector((state: RootState) => state.user);
	const emailState = useSelector((state: RootState) => state.email);

	const [sent, setSent] = useState(false);
	const [responseMessage, setResponseMessage] = useState('');

	const resendEmailConfirmationHandler = async () => {
		const responseData = await sendRequest(
			'http://localhost:8080/api/user/email/email-confirmation',
			'POST',
			JSON.stringify({ id: userState.id })
		);

		if (responseData.error) {
			setResponseMessage(responseData.error);
		} else if (responseData.success) {
			setResponseMessage(responseData.success);
		}

		setSent(true);

		setTimeout(() => {
			dispatch({ type: EmailConfirmationActionTypes.HIDE });
		}, 5000);
	};

	const closePopup = () => {
		sessionStorage.setItem('showEmailConfirmationPopup', JSON.stringify(false));
		dispatch({ type: EmailConfirmationActionTypes.HIDE });
	};

	useEffect(() => {
		if (userState.confirmedEmail) {
			dispatch({ type: EmailConfirmationActionTypes.HIDE });
			dispatch({ type: UIElementsActionTypes.SHOW_OVERLAY });
		} else {
			dispatch({ type: EmailConfirmationActionTypes.SHOW });
			dispatch({ type: UIElementsActionTypes.HIDE_OVERLAY });
		}
	}, [userState.confirmedEmail]);

	return ReactDOM.createPortal(
		<div className={classes.wrapper}>
			<button onClick={closePopup} className={classes['close-button']}>
				<img src={closeIcon} alt='Fermer' />
			</button>
			{!sent ? (
				<div className={classes['wrapper--not-sent']}>
					<img src={warningIcon} alt='Alerte' className={classes.icon} />
					<div className={classes.title}>
						Veuillez confirmer votre adresse mail.
					</div>
					<div className={classes.text}>
						Nous vous avons envoyé un mail lors de votre inscription. Pensez à
						vérifier votre boîte de réception et vos spams.
						<br /> <br /> Vous n’avez rien reçu ?
					</div>
					<button
						className={classes.button}
						onClick={resendEmailConfirmationHandler}
					>
						Renvoyer
					</button>
				</div>
			) : (
				<div className={classes['wrapper--sent']}>
					<img src={sentIcon} alt='Envoyé' className={classes.icon} />
					<div className={classes.response}>{responseMessage}</div>
				</div>
			)}
		</div>,
		document.getElementById('email-confirmation-popup')!
	);
};

export default EmailPopup;
