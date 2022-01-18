import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classes from './Profile.module.scss';

import Input from '../../shared/components/FormElements/Input';
import { useRequest } from '../../shared/hooks/http-hook';
import { useInput } from '../../shared/hooks/input-hook';
import { RootState } from '../../shared/store/store';

const Profile: React.FC = () => {
	const userState = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();
	const { sendRequest } = useRequest();
	const [passwordFormIsValid, setPasswordFormIsValid] = useState(false);

	const userData = useSelector((state: RootState) => state.user);
	const [showChangeName, setShowChangeName] = useState(false);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [nameResponse, setNameResponse] = useState('');
	const [passwordResponse, setPasswordResponse] = useState('');

	const showChangeNameHandler = () => {
		setShowChangeName((prev) => !prev);

		if (showChangeName) {
			setNewName((prev) => ({ ...prev, isTouched: false }));
		}
	};

	const showChangePasswordHandler = () => {
		setShowChangePassword((prev) => !prev);
	};

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

	const changeNameHandler = async (event: React.FormEvent) => {
		event.preventDefault();
		const responseData = await sendRequest(
			'http://localhost:8080/api/user/modify/name',
			'POST',
			JSON.stringify({
				id: userData.id,
				newName: newName.value.trim().toLowerCase(),
			})
		);

		if (responseData.error) {
			return;
		}

		setNameResponse(responseData.success);

		dispatch({ type: 'CHANGE_NAME', name: responseData.name });
		setNewName((prev) => ({ ...prev, value: '' }));
		setShowChangeName(false);
		resetForms();

		setTimeout(() => {
			setNameResponse('');
		}, 3000);
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
		resetForms();
		setShowChangePassword(false);

		setPasswordResponse('Mot de passe modifié!');

		setTimeout(() => {
			setPasswordResponse('');
		}, 3000);
	};

	const resetForms = () => {
		setNewName({ value: '', isValid: false, isTouched: false });
		setOldPassword({ value: '', isValid: false, isTouched: false });
		setNewPassword({ value: '', isValid: false, isTouched: false });
		setNewPasswordConfirmation({ value: '', isValid: false, isTouched: false });
	};

	const {
		input: newName,
		setInput: setNewName,
		inputOnChangeHandler: newNameOnChangeHandler,
		inputOnBlurHandler: newNameOnBlurHandler,
		inputOnPasteHandler: newNameOnPasteHandler,
	} = useInput('NAME');

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

	// useEffect(() => {
	// 	if (newPassword.value !== newPasswordConfirmation.value) {
	// 		setNewPasswordConfirmation((prev) => ({ ...prev, isValid: false }));
	// 		// } else if (
	// 		// 	newPassword.isValid &&
	// 		// 	newPassword.value === newPasswordConfirmation.value
	// 		// ) {
	// 		// 	setNewPasswordConfirmation((prev) => ({
	// 		// 		...prev,
	// 		// 		isValid: true,
	// 		// 		isTouched: true,
	// 		// 	}));
	// 	} else {
	// 		setNewPasswordConfirmation((prev) => ({ ...prev, isValid: true }));
	// 	}
	// }, [newPassword.value]);

	return (
		<div className={classes.wrapper}>
			<button className={classes.button} onClick={showChangeNameHandler}>
				Modifier Mon Nom
			</button>
			{showChangeName && (
				<>
					<Input
						id='Nouveau Nom'
						type='text'
						placeholder='Jean'
						errorText='Minimum 2 caractères'
						value={newName.value}
						isValid={newName.isValid}
						isTouched={newName.isTouched}
						onChange={newNameOnChangeHandler}
						onBlur={newNameOnBlurHandler}
						onPaste={newNameOnPasteHandler}
					/>
					<button onClick={changeNameHandler} disabled={!newName.isValid}>
						Changer Nom
					</button>
				</>
			)}
			{nameResponse}
			<button className={classes.button} onClick={showChangePasswordHandler}>
				Modifier Mon Mot de Passe
			</button>
			{showChangePassword && (
				<>
					<Input
						id='Ancien Mot de Passe'
						type='password'
						placeholder='********'
						errorText="Ceci n'est pas votre ancien mot de passe"
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
					<button
						onClick={changePasswordHandler}
						disabled={!passwordFormIsValid}
					>
						Changer Mot de Passe
					</button>
					<h1>Tester@1</h1>
				</>
			)}
			{passwordResponse}
		</div>
	);
};

export default Profile;
