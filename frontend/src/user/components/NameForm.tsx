import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { UserActionTypes } from '../../_shared/store/user';
import { RootState } from '../../_shared/store/store';

import { useInput, useInputTypes } from '../../_shared/hooks/input-hook';
import { useRequest } from '../../_shared/hooks/http-hook';

import Input from '../../_shared/components/FormElements/Input';

import formClasses from './UserForms.module.scss';

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
			'http://localhost:8080/api/user_modify/modify/name',
			'PATCH',
			JSON.stringify({
				id: userState.id,
				newName: newName.value.trim().toLowerCase(),
			})
		);

		if (!responseData) {
			return;
		}

		if (responseData.error) {
			return;
		}

		props.setResponse(responseData.message);

		dispatch({ type: UserActionTypes.REFRESH_NAME, name: responseData.name });
		setNewName({ value: '', isValid: false, isTouched: false });
		props.setShowChangeName(false);
	};

	const {
		input: newName,
		setInput: setNewName,
		inputOnChangeHandler: newNameOnChangeHandler,
		inputOnBlurHandler: newNameOnBlurHandler,
	} = useInput(useInputTypes.NAME);
	return (
		<div className={formClasses['name-wrapper']}>
			<Input
				id='Nouveau Nom'
				type='text'
				placeholder='Jean'
				errorText='Minimum 2 caractères, sans espaces.'
				value={newName.value}
				isValid={newName.isValid}
				isTouched={newName.isTouched}
				onChange={newNameOnChangeHandler}
				onBlur={newNameOnBlurHandler}
			/>
			<button
				onClick={changeNameHandler}
				disabled={!newName.isValid}
				className={`${formClasses['submit-button']} ${
					!newName.isValid && formClasses['submit-button--disabled']
				}`}
			>
				Changer Nom
			</button>
		</div>
	);
};

export default NameForm;
