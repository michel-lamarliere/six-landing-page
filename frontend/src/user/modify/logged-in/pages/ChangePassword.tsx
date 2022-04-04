import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Input, { InputStyles } from '../../../../_shared/components/FormElements/Input';
import { useRequest } from '../../../../_shared/hooks/http-hook';
import { useInput, useInputTypes } from '../../../../_shared/hooks/input-hook';
import { RootState } from '../../../../_shared/store/store';
import Form from '../components/Form';
import PasswordForm from '../../components/PasswordForm';

import formClasses from '../components/UserForms.module.scss';
import classes from './ChangePassword.module.scss';

const ChangePassword: React.FC = () => {
	const dispatch = useDispatch();

	const { sendRequest } = useRequest();

	const userState = useSelector((state: RootState) => state.user);

	const [response, setResponse] = useState('');
	const [sent, setSent] = useState(false);

	const [newPasswordErrorText, setNewPasswordErrorText] = useState('');

	const {
		input: oldPassword,
		setInput: setOldPassword,
		inputOnChangeHandler: oldPasswordOnChangeHandler,
		inputOnBlurHandler: oldPasswordOnBlurHandler,
	} = useInput({ type: useInputTypes.PASSWORD, validate: false, display: sent });

	const {
		input: newPassword,
		setInput: setNewPassword,
		inputOnChangeHandler: newPasswordOnChangeHandler,
		inputOnBlurHandler: newPasswordOnBlurHandler,
	} = useInput({ type: useInputTypes.PASSWORD, validate: true, display: sent });

	const {
		input: newPasswordConfirmation,
		setInput: setNewPasswordConfirmation,
		inputOnChangeHandler: newPasswordConfirmationOnChangeHandler,
		inputOnBlurHandler: newPasswordConfirmationOnBlurHandler,
	} = useInput({
		type: useInputTypes.PASSWORD_COMPARISON,
		validate: true,
		compareTo: newPassword.value,
		display: sent,
	});

	const resetForm = () => {
		setOldPassword((prev) => ({ ...prev, value: '' }));
		setNewPassword((prev) => ({ ...prev, value: '' }));
		setNewPasswordConfirmation((prev) => ({ ...prev, value: '' }));
	};

	const changePasswordHandler = async () => {
		const responseData = await sendRequest(
			'http://localhost:8080/api/user_modify/modify/password',
			'PATCH',
			JSON.stringify({
				id: userState.id,
				oldPassword: oldPassword.value,
				newPassword: newPassword.value,
				newPasswordConfirmation: newPasswordConfirmation.value,
			})
		);

		setSent(true);

		if (!responseData) {
			return;
		}

		if (responseData.error) {
			const { validInputs } = responseData;
			setResponse(responseData.error);

			if (!validInputs.oldPassword) {
				setOldPassword((prev) => ({ ...prev, isValid: false, isTouched: true }));
			}

			if (!validInputs.newPassword.differentThanOld) {
				setNewPassword((prev) => ({ ...prev, isValid: false, isTouched: true }));
				setNewPasswordErrorText(
					'Le nouveau mot de passe ne peut pas être identique à votre mot de passe actuel.'
				);
			}

			if (!validInputs.newPassword.format) {
				setNewPassword((prev) => ({ ...prev, isValid: false, isTouched: true }));
				setNewPasswordErrorText(
					'8 caractères minimum dont 1 minuscule, 1 majuscule, 1 chiffre et un caractère spécial.'
				);
			}

			if (!validInputs.newPasswordConfirmation) {
				setNewPasswordConfirmation((prev) => ({
					...prev,
					isValid: false,
					isTouched: true,
				}));
			}
			return;
		}
		resetForm();

		setResponse('Mot de passe modifié!');

		setTimeout(() => {
			setResponse('');
		}, 3000);
	};

	useEffect(() => {
		if (sent === true) {
			setSent(false);
		}
	}, [oldPassword, newPassword.value, newPasswordConfirmation.value]);

	return (
		<Form button_onClick={changePasswordHandler} response={response}>
			<div className={classes.inputs}>
				<Input
					styling={InputStyles.PROFILE_FORM}
					password={true}
					id='Ancien Mot de Passe'
					type='password'
					placeholder='Ancien mot de passe'
					errorText='Ancien mot de passe incorrect.'
					value={oldPassword.value}
					isValid={oldPassword.isValid}
					isTouched={oldPassword.isTouched}
					onChange={oldPasswordOnChangeHandler}
					onBlur={oldPasswordOnBlurHandler}
				/>
				<Input
					styling={InputStyles.PROFILE_FORM}
					password={true}
					id='Nouveau Mot de Passe'
					type='password'
					placeholder='Nouveau mot de passe'
					// errorText='8 caractères minimum dont 1 minuscule, 1 majuscule, 1 chiffre et un caractère spécial.'
					errorText={newPasswordErrorText}
					value={newPassword.value}
					isValid={newPassword.isValid}
					isTouched={newPassword.isTouched}
					onChange={newPasswordOnChangeHandler}
					onBlur={newPasswordOnBlurHandler}
				/>
				<Input
					styling={InputStyles.PROFILE_FORM}
					password={true}
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
				Tester1@
			</div>
		</Form>
	);
};

export default ChangePassword;
