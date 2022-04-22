import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store/_store';
import { ErrorPopUpActionTypes } from '../../store/pop-ups/error-pop-up';

import { useRequest } from '../../hooks/http-hook';
import { useInput, useInputTypes } from '../../hooks/input-hook';
import { useFormatUserName } from '../../hooks/format-user-name-hook';

import { useUserClass } from '../../classes/user-class-hook';

import Input, { InputStyles } from '../../components/form-elements/Input';
import RoundedButton from '../../components/buttons/RoundedButton/RoundedButton';

import successIcon from '../../assets/icons/success.svg';

import classes from './ChangeForgottenPasswordPage.module.scss';

const ForgotPasswordForm: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { email, uniqueId } = useParams();
	const { sendRequest } = useRequest();
	const { formatUserName } = useFormatUserName();
	const { User } = useUserClass();

	const userState = useSelector((state: RootState) => state.user);

	const [message, setMessage] = useState('Veuillez choisir un nouveau mot de passe');
	const [changedPassword, setChangedPassword] = useState(false);
	const [userId, setUserId] = useState('');
	const [userName, setUserName] = useState('');
	// const [submitted, setSubmitted] = useState(false);
	// const [gotResponse, setGotResponse] = useState(false);

	const userData =
		userState.token &&
		userState.tokenExpiration &&
		userState.id &&
		userState.name &&
		userState.email &&
		userState.confirmedEmail;

	const {
		input: newPassword,
		setInput: setNewPassword,
		inputOnChangeHandler: newPasswordOnChangeHandler,
		inputOnBlurHandler: newPasswordOnBlurHandler,
	} = useInput({ type: useInputTypes.PASSWORD, validate: true });

	const {
		input: newPasswordConfirmation,
		setInput: setNewPasswordConfirmation,
		inputOnChangeHandler: newPasswordConfirmationOnChangeHandler,
		inputOnBlurHandler: newPasswordConfirmationOnBlurHandler,
	} = useInput({
		type: useInputTypes.COMPARISON,
		validate: true,
		compareTo: newPassword.value,
	});

	const checkEmail = async () => {
		if (userData) {
			navigate('/');
			dispatch({
				type: ErrorPopUpActionTypes.SET_AND_SHOW_ERROR_POP_UP,
				message: 'Chemin interdit.',
			});
			return;
		}

		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/user/modify/password/forgot/confirmation/${email}/${uniqueId}`,
			method: 'GET',
		});

		if (responseData.error) {
			dispatch({
				type: ErrorPopUpActionTypes.SET_AND_SHOW_ERROR_POP_UP,
				message: 'Chemin interdit.',
			});
			navigate('/');
			return;
		}

		setUserId(responseData.id);
		setUserName(responseData.name);
	};

	const resetForm = () => {
		setNewPassword({ value: '', isValid: false, isTouched: false });
		setNewPasswordConfirmation({ value: '', isValid: false, isTouched: false });
	};

	const changePasswordHandler = async (event: React.FormEvent) => {
		event.preventDefault();
		// setSubmitted(true);

		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/user/modify/password/forgot`,
			method: 'PATCH',
			body: JSON.stringify({
				id: userId,
				newPassword: newPassword.value,
				newPasswordConfirmation: newPasswordConfirmation.value,
			}),
		});

		// setGotResponse(true);

		if (!responseData) {
			return;
		}

		if (responseData.error) {
			if (!responseData.validInputs.newPassword) {
				setNewPassword((prev) => ({ ...prev, isTouched: true }));
			}

			if (!responseData.validInputs.newPasswordConfirmation) {
				setNewPasswordConfirmation((prev) => ({ ...prev, isTouched: true }));
			}

			return;
		}

		resetForm();

		setMessage('Votre mot de passe a bien été modifié');
		setChangedPassword(true);
	};

	useEffect(() => {
		User.logOut({ redirect: false });
		checkEmail();
	}, []);

	useEffect(() => {
		checkEmail();
	}, [userState.token]);

	return (
		<div className={classes.wrapper}>
			<div className={classes.greeting}>Bonjour {formatUserName(userName)} !</div>
			<div className={classes.message}>{message}</div>
			{!changedPassword && (
				<form onSubmit={changePasswordHandler} className={classes.form}>
					<Input
						styling={InputStyles.PURPLE_FORM}
						id='Nouveau Mot de Passe'
						type='password'
						placeholder='Nouveau mot de passe'
						errorText='8 caractères minimum dont 1 minuscule, 1 majuscule, 1 chiffre et un caractère spécial.'
						value={newPassword.value}
						isValid={newPassword.isValid}
						isTouched={newPassword.isTouched}
						onChange={newPasswordOnChangeHandler}
						onBlur={newPasswordOnBlurHandler}
					/>
					<Input
						styling={InputStyles.PURPLE_FORM}
						id='Confirmer Nouveau Mot de Passe'
						type='password'
						placeholder='Confirmation mot de passe'
						errorText='Mots de passe non-identiques.'
						value={newPasswordConfirmation.value}
						isValid={newPasswordConfirmation.isValid}
						isTouched={newPasswordConfirmation.isTouched}
						onChange={newPasswordConfirmationOnChangeHandler}
						onBlur={newPasswordConfirmationOnBlurHandler}
					/>
					<RoundedButton
						text={'Enregistrer'}
						type='submit'
						className={classes['submit-button']}
					/>
					<div className={classes.email}>{email}</div>
				</form>
			)}
			{changedPassword && (
				<>
					<img src={successIcon} alt='Succès' />
					<RoundedButton text={'Se connecter'} link='/' />
				</>
			)}
		</div>
	);
};

export default ForgotPasswordForm;
