import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useInput, useInputTypes } from '../../_shared/hooks/input-hook';

import { RootState } from '../../_shared/store/store';

import classes from './ChangeEmail.module.scss';
import formClasses from '../components/UserForms.module.scss';
import Input from '../../_shared/components/FormElements/Input';
import { useRequest } from '../../_shared/hooks/http-hook';

const ChangeEmail: React.FC = () => {
	const { sendRequest } = useRequest();
	const userState = useSelector((state: RootState) => state.user);

	const [response, setResponse] = useState('');

	const {
		input: newEmailInput,
		setInput: setNewEmailInput,
		inputOnChangeHandler: newEmailOnChangeHandler,
		inputOnBlurHandler: newEmailOnBlurHandler,
	} = useInput(useInputTypes.EMAIL);

	const formHandler = async () => {
		// const responseData = await sendRequest('')
	};

	return (
		<div className={formClasses.basic}>
			<Link to='/profil'>{'< Profil'}</Link>
			<h3>Adresse mail actuelle:</h3>
			<h4>{userState.email}</h4>

			<form onSubmit={formHandler}>
				<Input
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
				<button
					disabled={!newEmailInput.isValid}
					className={`${formClasses['submit-button']} ${
						!newEmailInput.isValid && formClasses['submit-button--disabled']
					}`}
				>
					Modifier Adresse Mail
				</button>
			</form>

			<div>{response}</div>
		</div>
	);
};

export default ChangeEmail;
