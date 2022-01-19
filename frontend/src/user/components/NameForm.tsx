import React from 'react';
import classes from './NameForm.module.scss';
import { useRequest } from '../../shared/hooks/http-hook';

import { useInput } from '../../shared/hooks/input-hook';
import { RootState } from '../../shared/store/store';
import { useDispatch, useSelector } from 'react-redux';

import Input from '../../shared/components/FormElements/Input';

const NameForm: React.FC<{
	setShowChangeName: (arg0: boolean) => void;
	setResponse: (arg0: string) => void;
}> = (props) => {
	const dispatch = useDispatch();
	const { sendRequest } = useRequest();
	const userState = useSelector((state: RootState) => state.user);

	const changeNameHandler = async (event: React.FormEvent) => {
		event.preventDefault();
		const responseData = await sendRequest(
			'http://localhost:8080/api/user/modify/name',
			'POST',
			JSON.stringify({
				id: userState.id,
				newName: newName.value.trim().toLowerCase(),
			})
		);

		if (responseData.error) {
			return;
		}

		props.setResponse(responseData.success);

		dispatch({ type: 'CHANGE_NAME', name: responseData.name });
		setNewName({ value: '', isValid: false, isTouched: false });
		props.setShowChangeName(false);
	};

	const {
		input: newName,
		setInput: setNewName,
		inputOnChangeHandler: newNameOnChangeHandler,
		inputOnBlurHandler: newNameOnBlurHandler,
		// inputOnPasteHandler: newNameOnPasteHandler,
	} = useInput('NAME');
	return (
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
				// onPaste={newNameOnPasteHandler}
			/>
			<button onClick={changeNameHandler} disabled={!newName.isValid}>
				Changer Nom
			</button>
		</>
	);
};

export default NameForm;
