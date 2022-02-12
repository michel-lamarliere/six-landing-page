import React, { useState } from 'react';

import PasswordShowSVG from '../assets/icons/password_show.svg';
import PasswordHideSVG from '../assets/icons/password_hide.svg';

import classes from './Input.module.scss';

const FormInput: React.FC<{
	id: string;
	type: 'text' | 'email' | 'password';
	placeholder: string;
	value: string;
	errorText: string;
	isValid: boolean;
	isTouched: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
	onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
	password?: boolean;
}> = (props) => {
	const {
		id,
		type,
		placeholder,
		value,
		errorText,
		isValid,
		isTouched,
		onChange,
		onBlur,
		onPaste,
		password,
	} = props;

	const [showPassword, setShowPassword] = useState(false);

	const showPasswordHandler = (event: React.FormEvent) => {
		event.preventDefault();
		setShowPassword((prev) => !prev);
	};

	return (
		<div className={classes.wrapper}>
			<div className={classes.input__wrapper}>
				<input
					className={`${classes.input} ${
						!isValid && isTouched && classes.input__invalid
					}`}
					type={showPassword ? 'text' : type}
					name={id}
					placeholder={placeholder}
					id={id}
					value={value}
					onChange={onChange}
					onBlur={onBlur}
					onPaste={onPaste}
				/>
				{password && (
					<button
						onClick={showPasswordHandler}
						className={classes.input__showpassword}
					>
						<img
							src={showPassword ? PasswordShowSVG : PasswordHideSVG}
							alt='Icone mot de passe'
						/>
					</button>
				)}
			</div>

			<div className={classes.errortext}>{!isValid && isTouched && errorText}</div>
		</div>
	);
};

export default FormInput;
