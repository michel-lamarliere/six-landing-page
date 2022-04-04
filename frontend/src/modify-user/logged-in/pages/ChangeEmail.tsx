import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../../../_shared/store/_store';

import { useInput, useInputTypes } from '../../../_shared/hooks/input-hook';
import { useRequest } from '../../../_shared/hooks/http-hook';

import Input, { InputStyles } from '../../../_shared/components/FormElements/Input';
import Form, { FormWrapperTypes } from '../components/FormWrapper';

import classes from './ChangeEmail.module.scss';

const ChangeEmail: React.FC = () => {
	const { sendRequest } = useRequest();
	const userState = useSelector((state: RootState) => state.user);

	const [response, setResponse] = useState('');

	const {
		input: newEmailInput,
		setInput: setNewEmailInput,
		inputOnChangeHandler: newEmailOnChangeHandler,
		inputOnBlurHandler: newEmailOnBlurHandler,
	} = useInput({ type: useInputTypes.EMAIL, validate: true });

	const submitHandler = () => {};

	return (
		<Form
			type={FormWrapperTypes.MODIFY}
			button_onClick={submitHandler}
			response={response}
		>
			<div className={classes.wrapper}>
				<div className={classes.label}>Adresse mail actuelle:</div>
				<div className={classes.email}>{userState.email}</div>
			</div>
			<Input
				styling={InputStyles.PROFILE_FORM}
				id={'email'}
				type={'email'}
				placeholder={'Nouvelle adresse mail'}
				value={newEmailInput.value}
				errorText={'Format invalide.'}
				isValid={newEmailInput.isValid}
				isTouched={newEmailInput.isTouched}
				onChange={newEmailOnChangeHandler}
				onBlur={newEmailOnBlurHandler}
			/>
		</Form>
	);
};

export default ChangeEmail;
