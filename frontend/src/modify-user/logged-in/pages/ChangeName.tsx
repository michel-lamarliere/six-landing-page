import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { UserActionTypes } from '../../../_shared/store/user';
import { RootState } from '../../../_shared/store/_store';

import { useInput, useInputTypes } from '../../../_shared/hooks/input-hook';
import { useRequest } from '../../../_shared/hooks/http-hook';
import { useUser } from '../../../_shared/classes/user-hook';

import Input, { InputStyles } from '../../../_shared/components/FormElements/Input';
import Form, { FormWrapperTypes } from '../components/FormWrapper';

import classes from './ChangeName.module.scss';

const ChangeName: React.FC = () => {
	const dispatch = useDispatch();
	const { sendRequest } = useRequest();
	const { User } = useUser();

	const userState = useSelector((state: RootState) => state.user);

	const [response, setResponse] = useState('');

	const changeNameHandler = async (event: React.FormEvent) => {
		event.preventDefault();
		const responseData = await sendRequest(
			`${process.env.REACT_APP_BACKEND_URL}/user_modify/name`,
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
			setNewName((prev) => ({ ...prev, isValid: false, isTouched: true }));
			// setResponse(responseData.error);
			return;
		}

		setResponse(responseData.success);

		setTimeout(() => {
			setResponse('');
		}, 3000);

		User.refreshData();

		setNewName({ value: '', isValid: false, isTouched: false });
	};

	const {
		input: newName,
		setInput: setNewName,
		inputOnChangeHandler: newNameOnChangeHandler,
		inputOnBlurHandler: newNameOnBlurHandler,
	} = useInput({ type: useInputTypes.NAME, validate: true });

	return (
		<Form
			title={'Nom'}
			type={FormWrapperTypes.MODIFY}
			displaySubmitButton={true}
			button_onClick={changeNameHandler}
			response={response}
		>
			<Input
				styling={InputStyles.PROFILE_FORM}
				id='Nouveau Nom'
				type='text'
				placeholder='Jean'
				errorText='Minimum 2 caractères, sans espaces et sans caractères spéciaux.'
				value={newName.value}
				isValid={newName.isValid}
				isTouched={newName.isTouched}
				onChange={newNameOnChangeHandler}
				onBlur={newNameOnBlurHandler}
			/>
		</Form>
	);
};

export default ChangeName;
