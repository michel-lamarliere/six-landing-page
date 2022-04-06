import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { UserActionTypes } from '../../../_shared/store/user';
import { RootState } from '../../../_shared/store/_store';

import { useInput, useInputTypes } from '../../../_shared/hooks/input-hook';
import { useRequest } from '../../../_shared/hooks/http-hook';
import { useUserClass } from '../../../_shared/classes/user-class-hook';

import Input, { InputStyles } from '../../../_shared/components/FormElements/Input';
import EditProfileFormWrapper, {
	EditProfileFormWrapperTypes,
} from '../components/EditProfileFormWrapper';

import classes from './ChangeName.module.scss';

const ChangeName: React.FC = () => {
	const dispatch = useDispatch();
	const { sendRequest } = useRequest();
	const { User } = useUserClass();

	const userState = useSelector((state: RootState) => state.user);

	const [response, setResponse] = useState('');

	const changeNameHandler = async (event: React.FormEvent) => {
		event.preventDefault();
		const responseData = await sendRequest(
			`${process.env.REACT_APP_BACKEND_URL}/user-modify/name`,
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
			setResponse(responseData.message);
			return;
		}

		setResponse(responseData.message);

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
		<EditProfileFormWrapper
			title={'Nom'}
			type={EditProfileFormWrapperTypes.MODIFY}
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
		</EditProfileFormWrapper>
	);
};

export default ChangeName;
