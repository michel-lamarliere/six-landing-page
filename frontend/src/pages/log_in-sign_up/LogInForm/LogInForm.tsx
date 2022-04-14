import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { OverlayActionTypes } from '../../../store/overlay';
import { ForgotPasswordPopUpActionTypes } from '../../../store/pop-ups/forgot-password-pop-up';

import { useRequest } from '../../../hooks/http-hook';
import { useInput, useInputTypes } from '../../../hooks/input-hook';

import { useUserClass } from '../../../classes/user-class-hook';

import Input, { InputStyles } from '../../../components/form-elements/Input';
import FormContainer from '../FormContainer/FormContainer';
import RoundedButton from '../../../components/buttons/RoundedButton/RoundedButton';

import rememberMeTrueIcon from '../../../assets/icons/form&input/remember-me_true.svg';
import rememberMeFalseIcon from '../../../assets/icons/form&input/remember-me_false.svg';

import classes from './LogInForm.module.scss';

interface Props {
	mobile: boolean;
	switchFormHandler?: () => void;
}

const LogInForm: React.FC<Props> = (props) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { sendRequest } = useRequest();
	const { User } = useUserClass();

	const [rememberEmail, setRememberEmail] = useState(false);
	const [responseMessage, setResponseMessage] = useState('');

	const {
		input: emailInput,
		setInput: setEmailInput,
		inputOnChangeHandler: emailOnChangeHandler,
		inputOnBlurHandler: emailOnBlurHandler,
	} = useInput({ type: useInputTypes.NONE, validate: true });

	const {
		input: passwordInput,
		setInput: setPasswordInput,
		inputOnChangeHandler: passwordOnChangeHandler,
		inputOnBlurHandler: passwordOnBlurHandler,
	} = useInput({ type: useInputTypes.NONE, validate: true });

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
			return;
		}

		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/user/sign-in`,
			method: 'POST',
			body: JSON.stringify({
				email: emailInput.value.trim().toLowerCase(),
				password: passwordInput.value,
			}),
		});

		if (responseData.error) {
			if (!responseData.validInputs.email) {
				setEmailInput((prev) => ({ ...prev, isValid: false, isTouched: true }));
			} else if (!responseData.validInputs.password) {
				setPasswordInput((prev) => ({
					...prev,
					isValid: false,
					isTouched: true,
				}));
			}
			return;
		}

		if (rememberEmail) {
			User.rememberEmail({ email: responseData.email });
		} else {
			User.forgetEmail();
		}

		User.logIn(responseData);
	};

	const checkboxHandler = (event: React.MouseEvent<HTMLDivElement>) => {
		setRememberEmail((prev) => !prev);
	};

	const forgotPasswordHandler = (event: React.MouseEvent) => {
		dispatch({ type: ForgotPasswordPopUpActionTypes.SHOW_FORGOT_PASSWORD_POP_UP });
		dispatch({ type: OverlayActionTypes.SHOW_OVERLAY });
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
			switchFormHandler={
				props.mobile ? () => navigate('/inscription') : props.switchFormHandler
			}
			responseMessage={responseMessage}
		>
			<Input
				styling={InputStyles.PURPLE_FORM}
				id='Email'
				type='text'
				placeholder='jean@email.fr'
				value={emailInput.value}
				errorText='Compte non trouvé, veuillez créer un compte.'
				isValid={emailInput.isValid}
				isTouched={emailInput.isTouched}
				onChange={emailOnChangeHandler}
				onBlur={emailOnBlurHandler}
			/>
			<Input
				styling={InputStyles.PURPLE_FORM}
				id='mot de passe'
				type='password'
				placeholder='Mot de passe'
				value={passwordInput.value}
				isValid={passwordInput.isValid}
				isTouched={passwordInput.isTouched}
				errorText='Mot de passe incorrect.'
				onChange={passwordOnChangeHandler}
				onBlur={passwordOnBlurHandler}
			/>
			<div className={classes['remember-me']}>
				<div onClick={checkboxHandler} className={classes['remember-me__button']}>
					<img
						className={classes['remember-me__button__img']}
						src={rememberEmail ? rememberMeTrueIcon : rememberMeFalseIcon}
						alt='Se souvenir de moi'
					/>
				</div>
				<div onClick={() => setRememberEmail((prev) => !prev)}>
					Se souvenir de moi
				</div>
			</div>
			<div
				onClick={forgotPasswordHandler}
				className={classes['forgot-password-button']}
			>
				Mot de passe oublié ?
			</div>
			<RoundedButton text={'Connexion'} type='submit' />
		</FormContainer>
	);
};

export default LogInForm;
