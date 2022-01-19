import React, { useState, useEffect } from 'react';
import classes from './PasswordForm.module.scss';
import { useInput } from '../../shared/hooks/input-hook';
import { useRequest } from '../../shared/hooks/http-hook';
import { RootState } from '../../shared/store/store';
import { useDispatch, useSelector } from 'react-redux';

import Input from '../../shared/components/FormElements/Input';

const PasswordForm: React.FC<{
	setShowChangePassword: (arg0: boolean) => void;
	setResponse: (arg0: string) => void;
}> = (props) => {
	const dispatch = useDispatch();
	const { sendRequest } = useRequest();

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
			if (responseData.success) {
				setOldPassword((prev) => ({ ...prev, isValid: true }));
			}
		}
	};

	const changePasswordHandler = async () => {
		const responseData = await sendRequest(
			'http://localhost:8080/api/user/modify/password',
			'POST',
			JSON.stringify({ id: userState.id, newPassword: newPassword.value })
		);
		console.log(userState.id);

		if (responseData.error) {
			dispatch({ type: 'SET_ERROR', message: responseData.error });
			return;
		}
		resetForm();
		props.setShowChangePassword(false);

		props.setResponse('Mot de passe modifié!');
	};

	const resetForm = () => {
		setOldPassword({ value: '', isValid: false, isTouched: false });
		setNewPassword({ value: '', isValid: false, isTouched: false });
		setNewPasswordConfirmation({ value: '', isValid: false, isTouched: false });
	};

	const {
		input: oldPassword,
		setInput: setOldPassword,
		inputOnChangeHandler: oldPasswordOnChangeHandler,
		inputOnBlurHandler: oldPasswordOnBlurHandler,
		inputOnPasteHandler: oldPasswordOnPasteHandler,
	} = useInput('PASSWORD_COMPARISON', null, null, fetchOldPassword);

	const {
		input: newPassword,
		setInput: setNewPassword,
		inputOnChangeHandler: newPasswordOnChangeHandler,
		inputOnBlurHandler: newPasswordOnBlurHandler,
		inputOnPasteHandler: newPasswordOnPasteHandler,
	} = useInput('PASSWORD', null, oldPassword.value);

	const {
		input: newPasswordConfirmation,
		setInput: setNewPasswordConfirmation,
		inputOnChangeHandler: newPasswordConfirmationOnChangeHandler,
		inputOnBlurHandler: newPasswordConfirmationOnBlurHandler,
		inputOnPasteHandler: newPasswordConfirmationOnPasteHandler,
	} = useInput('PASSWORD_COMPARISON', null, newPassword.value);

	useEffect(() => {
		if (
			oldPassword.isValid &&
			newPassword.isValid &&
			newPasswordConfirmation.isValid
		) {
			setPasswordFormIsValid(true);
		} else {
			setPasswordFormIsValid(false);
		}
	}, [oldPassword.value, newPassword.value, newPasswordConfirmation.value]);

	return (
		<>
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
				onPaste={oldPasswordOnPasteHandler}
			/>
			<Input
				id='Nouveau Mot de Passe'
				type='password'
				placeholder='********'
				errorText='8 caractères minimum dont 1 minuscle, 1 majuscule, 1 chiffre et un caractère spécial.'
				value={newPassword.value}
				isValid={newPassword.isValid}
				isTouched={newPassword.isTouched}
				onChange={newPasswordOnChangeHandler}
				onBlur={newPasswordOnBlurHandler}
				onPaste={newPasswordOnPasteHandler}
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
				onPaste={newPasswordConfirmationOnPasteHandler}
			/>
			<button onClick={changePasswordHandler} disabled={!passwordFormIsValid}>
				Changer Mot de Passe
			</button>
		</>
	);
};

export default PasswordForm;
