import React, { useState, useEffect } from 'react';
import classes from './PasswordForm.module.scss';

import { useInput } from '../../shared/hooks/input-hook';
import { useRequest } from '../../shared/hooks/http-hook';
import { RootState } from '../../shared/store/store';
import { useDispatch, useSelector } from 'react-redux';

import Input from '../../shared/components/FormElements/Input';
import { ErrorPopupActionTypes } from '../../shared/store/error';

const PasswordForm: React.FC<{
	setShowChangePassword: (arg0: boolean) => void;
	setResponse: (arg0: string) => void;
	forgotForm?: boolean;
	userId?: string;
	redirect?: () => void;
}> = (props) => {
	const dispatch = useDispatch();
	const { sendRequest } = useRequest();
	const [errorMessage, setErrorMessage] = useState('');

	const userState = useSelector((state: RootState) => state.user);

	const [passwordFormIsValid, setPasswordFormIsValid] = useState(false);

	const fetchOldPassword = async () => {
		if (oldPassword.value.trim().length > 0) {
			const responseData = await sendRequest(
				`http://localhost:8080/api/user/compare/passwords/${userState.id}/${oldPassword.value}`,
				'GET'
			);

			if (responseData.error) {
				setOldPassword((prev) => ({ ...prev, isValid: false }));
				return;
			}

			setOldPassword((prev) => ({ ...prev, isValid: true }));
		}
	};

	const changePasswordHandler = async () => {
		const responseData = await sendRequest(
			'http://localhost:8080/api/user/modify/password',
			'PATCH',
			JSON.stringify({
				id: props.forgotForm ? props.userId : userState.id,
				newPassword: newPassword.value,
			})
		);

		if (!responseData) {
			return;
		}

		if (responseData.error) {
			dispatch({
				type: ErrorPopupActionTypes.SET_ERROR,
				message: responseData.error,
			});
			return;
		}
		resetForm();

		props.setResponse('Mot de passe modifié!');
		props.setShowChangePassword(false);

		if (props.redirect) {
			props.redirect();
		}
	};

	const resetForm = () => {
		if (!props.forgotForm) {
			setOldPassword({ value: '', isValid: false, isTouched: false });
		}
		setNewPassword({ value: '', isValid: false, isTouched: false });
		setNewPasswordConfirmation({ value: '', isValid: false, isTouched: false });
	};

	const {
		input: oldPassword,
		setInput: setOldPassword,
		inputOnChangeHandler: oldPasswordOnChangeHandler,
		inputOnBlurHandler: oldPasswordOnBlurHandler,
	} = useInput('OLD_PASSWORD', null, null, fetchOldPassword);

	const {
		input: newPassword,
		setInput: setNewPassword,
		inputOnChangeHandler: newPasswordOnChangeHandler,
		inputOnBlurHandler: newPasswordOnBlurHandler,
	} = useInput('PASSWORD', null, oldPassword.value);

	const {
		input: newPasswordConfirmation,
		setInput: setNewPasswordConfirmation,
		inputOnChangeHandler: newPasswordConfirmationOnChangeHandler,
		inputOnBlurHandler: newPasswordConfirmationOnBlurHandler,
	} = useInput('PASSWORD_COMPARISON', null, newPassword.value);

	useEffect(() => {
		if (props.forgotForm) {
			if (
				newPassword.isValid &&
				newPasswordConfirmation.isValid &&
				oldPassword.value !== newPassword.value
			) {
				setPasswordFormIsValid(true);
			} else {
				setPasswordFormIsValid(false);
			}

			if (newPassword.isValid && oldPassword.value === newPassword.value) {
				setPasswordFormIsValid(false);
				setErrorMessage(
					"Le nouveau mot de passe ne peut pas être identique à l'ancien."
				);
				return;
			}
			setErrorMessage('');
		} else {
			if (
				oldPassword.isValid &&
				newPassword.isValid &&
				newPasswordConfirmation.isValid &&
				oldPassword.value !== newPassword.value
			) {
				setPasswordFormIsValid(true);
			} else {
				setPasswordFormIsValid(false);
			}

			if (
				oldPassword.isValid &&
				newPassword.isValid &&
				oldPassword.value === newPassword.value
			) {
				setPasswordFormIsValid(false);
				setErrorMessage(
					"Le nouveau mot de passe ne peut pas être identique à l'ancien."
				);
				return;
			}
			setErrorMessage('');
		}
	}, [oldPassword, newPassword, newPasswordConfirmation]);

	return (
		<>
			{!props.forgotForm && (
				<Input
					id='Ancien Mot de Passe'
					type='password'
					placeholder='********'
					errorText='Ancien mot de passe incorrect'
					value={oldPassword.value}
					isValid={oldPassword.isValid}
					isTouched={oldPassword.isTouched}
					onChange={oldPasswordOnChangeHandler}
					onBlur={oldPasswordOnBlurHandler}
					password={true}
				/>
			)}
			<Input
				id='Nouveau Mot de Passe'
				type='password'
				placeholder='********'
				errorText='8 caractères minimum dont 1 minuscule, 1 majuscule, 1 chiffre et un caractère spécial.'
				value={newPassword.value}
				isValid={newPassword.isValid}
				isTouched={newPassword.isTouched}
				onChange={newPasswordOnChangeHandler}
				onBlur={newPasswordOnBlurHandler}
				password={true}
			/>
			<Input
				id='Confirmer Nouveau Mot de Passe'
				type='password'
				placeholder='********'
				errorText='Mots de passe non identiques'
				value={newPasswordConfirmation.value}
				isValid={newPasswordConfirmation.isValid}
				isTouched={newPasswordConfirmation.isTouched}
				onChange={newPasswordConfirmationOnChangeHandler}
				onBlur={newPasswordConfirmationOnBlurHandler}
				password={true}
			/>
			<h1>{errorMessage}</h1>
			<button onClick={changePasswordHandler} disabled={!passwordFormIsValid}>
				Changer Mot de Passe
			</button>
		</>
	);
};

export default PasswordForm;
