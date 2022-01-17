import React, { FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classes from './Profile.module.scss';

import Input from '../../shared/components/FormElements/Input';
import { PasswordInputs } from '../components/ProfileInputs';
import { useRequest } from '../../shared/hooks/http-hook';
import { useInput } from '../../shared/hooks/input-hook';
import { RootState } from '../../shared/store/store';

const Profile: React.FC = () => {
	const dispatch = useDispatch();
	const { sendRequest } = useRequest();
	const {
		input: newName,
		setInput: setNewName,
		inputOnChangeHandler: newNameOnChangeHandler,
		inputOnBlurHandler: newNameOnBlurHandler,
		inputOnPasteHandler: newNameOnPasteHandler,
	} = useInput('NAME');

	const userData = useSelector((state: RootState) => state.user);
	const [showChangeName, setShowChangeName] = useState(false);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [response, setResponse] = useState('');

	const changeNameHandler = async (event: React.FormEvent) => {
		event.preventDefault();
		const responseData = await sendRequest(
			'http://localhost:8080/api/users/modify/name',
			'POST',
			JSON.stringify({
				id: userData.id,
				email: userData.email,
				newName: newName.value,
			})
		);

		if (responseData.error) {
			dispatch({ type: 'SET-ERROR', message: responseData.error });
			return;
		}

		setResponse(responseData.success);

		dispatch({ type: 'CHANGE_NAME', name: newName.value });
		setNewName((prev) => ({ ...prev, value: '' }));
		setShowChangeName(false);

		setTimeout(() => {
			setResponse('');
		}, 3000);
	};

	const changePasswordHandler = () => {};

	const showChangeNameHandler = () => {
		setShowChangeName((prev) => !prev);

		if (showChangeName) {
			setNewName((prev) => ({ ...prev, isTouched: false }));
		}
	};

	const showChangePasswordHandler = () => {
		setShowChangePassword((prev) => !prev);

		// if (showChangeName) {
		// 	setNewPassword((prev) => ({ ...prev, isTouched: false }));
		// }
	};

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
						isValid={newName.isValid}
						isTouched={newName.isTouched}
						onChange={newNameOnChangeHandler}
						onBlur={newNameOnBlurHandler}
						onPaste={newNameOnPasteHandler}
						value={newName.value}
					/>
					<button onClick={changeNameHandler} disabled={!newName.isValid}>
						Changer Nom
					</button>
				</>
			)}
			{response}
			<button className={classes.button} onClick={showChangePasswordHandler}>
				Modifier Mon Mot de Passe
			</button>
			{showChangePassword && <PasswordInputs onClick={changePasswordHandler} />}
		</div>
	);
};

export default Profile;
