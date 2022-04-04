import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../_shared/store/store';
import { ErrorPopupActionTypes } from '../../../_shared/store/error';

import { useInput, useInputTypes } from '../../../_shared/hooks/input-hook';
import { useRequest } from '../../../_shared/hooks/http-hook';

import Input, { InputStyles } from '../../../_shared/components/FormElements/Input';

import formClasses from './UserForms.module.scss';

const PasswordForm: React.FC<{
	forgotForm?: boolean;
	userId?: string;
	redirect?: () => void;
}> = (props) => {
	const dispatch = useDispatch();
	const { sendRequest } = useRequest();
	const userState = useSelector((state: RootState) => state.user);

	const [errorMessage, setErrorMessage] = useState('');
	const [response, setResponse] = useState('');
	const [passwordFormIsValid, setPasswordFormIsValid] = useState(true);

	const fetchOldPassword = async () => {
		if (oldPassword.value.trim().length > 0) {
			const responseData = await sendRequest(
				`http://localhost:8080/api/user_modify/compare/passwords/${userState.id}/${oldPassword.value}`,
				'GET'
			);

			if (responseData.error) {
				setOldPassword((prev) => ({ ...prev, isValid: false }));
				return;
			}

			setOldPassword((prev) => ({ ...prev, isValid: true }));
		}
	};

	const {
		input: oldPassword,
		setInput: setOldPassword,
		inputOnChangeHandler: oldPasswordOnChangeHandler,
		inputOnBlurHandler: oldPasswordOnBlurHandler,
	} = useInput({ type: useInputTypes.PASSWORD, validate: true });

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
	} = useInput({ type: useInputTypes.PASSWORD_COMPARISON, validate: true });

	const changePasswordHandler = async () => {
		const responseData = await sendRequest(
			'http://localhost:8080/api/user_modify/modify/password',
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
			setErrorMessage(responseData.error);
			return;
		}

		resetForm();

		setResponse('Mot de passe modifié!');

		setTimeout(() => {
			setResponse('');
		}, 3000);

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
		<div>
			<div className={formClasses['password-wrapper']}>
				{!props.forgotForm && (
					<Input
						styling={InputStyles.PROFILE_FORM}
						id='Ancien Mot de Passe'
						type='password'
						placeholder='Ancien mot de passe'
						errorText='Ancien mot de passe incorrect.'
						value={oldPassword.value}
						isValid={oldPassword.isValid}
						isTouched={oldPassword.isTouched}
						onChange={oldPasswordOnChangeHandler}
						onBlur={oldPasswordOnBlurHandler}
						password={true}
					/>
				)}
				<Input
					styling={InputStyles.PROFILE_FORM}
					id='Nouveau Mot de Passe'
					type='password'
					placeholder='Nouveau mot de passe'
					errorText='8 caractères minimum dont 1 minuscule, 1 majuscule, 1 chiffre et un caractère spécial.'
					value={newPassword.value}
					isValid={newPassword.isValid}
					isTouched={newPassword.isTouched}
					onChange={newPasswordOnChangeHandler}
					onBlur={newPasswordOnBlurHandler}
					password={true}
				/>
				<Input
					styling={InputStyles.PROFILE_FORM}
					id='Confirmer Nouveau Mot de Passe'
					type='password'
					placeholder='Confirmation mot de passe'
					errorText='Mots de passe non-identiques.'
					value={newPasswordConfirmation.value}
					isValid={newPasswordConfirmation.isValid}
					isTouched={newPasswordConfirmation.isTouched}
					onChange={newPasswordConfirmationOnChangeHandler}
					onBlur={newPasswordConfirmationOnBlurHandler}
					password={true}
				/>
				<div>{errorMessage}</div>
				<button
					onClick={changePasswordHandler}
					disabled={!passwordFormIsValid}
					className={`${formClasses['submit-button']} ${
						!passwordFormIsValid && formClasses['submit-button--disabled']
					}`}
				>
					Changer Mot de Passe
				</button>
				Tester1@
			</div>
			<div>{response}</div>
		</div>
	);
};

export default PasswordForm;