import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { OverlayActionTypes } from '../../_shared/store/overlay';
import { ForgotPasswordPopUpActionTypes } from '../../_shared/store/pop-ups/forgot-password-pop-up';

import { useRequest } from '../../_shared/hooks/http-hook';
import { useUserClass } from '../../_shared/classes/user-class-hook';
import { useInput, useInputTypes } from '../../_shared/hooks/input-hook';

import Input, { InputStyles } from '../../_shared/components/FormElements/Input';
import FormContainer from './FormContainer';
import RoundedButton from '../../_shared/components/UIElements/RoundedButton';

import RememberMeTrueSVG from '../../_shared/assets/imgs/icons/form&input/remember-me_true.svg';
import RememberMeFalseSVG from '../../_shared/assets/imgs/icons/form&input/remember-me_false.svg';

import classes from './LoginForm.module.scss';

interface Props {
	switchFormHandler: () => void;
}

const LoginForm: React.FC<Props> = (props) => {
	const dispatch = useDispatch();
	const { sendRequest } = useRequest();
	const { User } = useUserClass();

	const [rememberEmail, setRememberEmail] = useState(false);
	const [responseMessage, setResponseMessage] = useState('');

	const {
		input: emailInput,
		setInput: setEmailInput,
		inputOnChangeHandler: emailOnChangeHandler,
		inputOnBlurHandler: emailOnBlurHandler,
	} = useInput({ type: useInputTypes.EMAIL, validate: false });

	const {
		input: passwordInput,
		setInput: setPasswordInput,
		inputOnChangeHandler: passwordOnChangeHandler,
		inputOnBlurHandler: passwordOnBlurHandler,
	} = useInput({ type: useInputTypes.PASSWORD, validate: false });

	const checkInputsAreNotEmpty = () => {
		if (
			emailInput.value.trim().length === 0 ||
			passwordInput.value.trim().length === 0
		) {
			return false;
		}

		return true;
	};

	const loginFormHandler = async (event: React.FormEvent) => {
		event.preventDefault();

		const formIsEmpty = !checkInputsAreNotEmpty();

		if (formIsEmpty) {
			setResponseMessage('Veuillez remplir les champs.');
			return;
		}

		const responseData = await sendRequest(
			`${process.env.REACT_APP_BACKEND_URL}/user/signin`,
			'POST',
			JSON.stringify({
				email: emailInput.value.trim().toLowerCase(),
				password: passwordInput.value,
			})
		);

		if (responseData.error) {
			setResponseMessage(responseData.message);
			return;
		}

		console.log(responseData);

		const user = new User(responseData);

		if (rememberEmail) {
			user.rememberEmail();
		} else {
			user.forgetEmail();
		}

		user.logIn();
	};

	const checkboxHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setRememberEmail((prev) => !prev);
	};

	const forgotPasswordHandler = (event: React.FormEvent) => {
		event.preventDefault();
		dispatch({ type: ForgotPasswordPopUpActionTypes.SHOW_FORGOT_PASSWORD_POP_UP });
	};

	useEffect(() => {
		const emailStorage = localStorage.getItem('rememberEmail');

		if (emailStorage) {
			setEmailInput((prev) => ({ ...prev, value: emailStorage }));
			setRememberEmail(true);
		}
	}, []);

	return (
		<FormContainer
			formHandler={loginFormHandler}
			headerTitle={'Vous revoilà !'}
			footerText={'Pas de compte ?'}
			footerTextLink={'Inscrivez-vous !'}
			switchFormHandler={props.switchFormHandler}
			responseMessage={responseMessage}
		>
			<Input
				styling={InputStyles.BASIC_FORM}
				id='Email'
				type='text'
				placeholder='jean@email.fr'
				value={emailInput.value}
				errorText='Format invalide.'
				isValid={emailInput.isValid}
				isTouched={emailInput.isTouched}
				onChange={emailOnChangeHandler}
				onBlur={emailOnBlurHandler}
			/>
			<Input
				styling={InputStyles.BASIC_FORM}
				id='mot de passe'
				type='password'
				placeholder='Mot de passe'
				value={passwordInput.value}
				isValid={passwordInput.isValid}
				isTouched={passwordInput.isTouched}
				errorText='8 caractères minimum dont 1 minuscle, 1 majuscule, 1 chiffre et un caractère spécial.'
				onChange={passwordOnChangeHandler}
				onBlur={passwordOnBlurHandler}
				password={true}
			/>
			<div className={classes['remember-me']}>
				<button
					onClick={checkboxHandler}
					className={classes['remember-me__button']}
				>
					<img
						className={classes['remember-me__button__img']}
						src={rememberEmail ? RememberMeTrueSVG : RememberMeFalseSVG}
						alt='Se souvenir de moi'
					/>
				</button>
				<div onClick={() => setRememberEmail((prev) => !prev)}>
					Se souvenir de moi
				</div>
			</div>
			<button
				onClick={forgotPasswordHandler}
				className={classes['forgot-password-button']}
			>
				Mot de passe oublié ?
			</button>
			<RoundedButton text={'Connexion'} />
		</FormContainer>
	);
};

export default LoginForm;
