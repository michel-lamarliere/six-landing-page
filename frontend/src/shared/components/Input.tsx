import React, { useState } from 'react';
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
			<label htmlFor={id}>{id}</label>
			<input
				className={!isValid && isTouched ? classes.invalid : ''}
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
				<button onClick={showPasswordHandler}>
					{showPassword ? 'Cacher' : 'Afficher'}
				</button>
			)}
			<p>{!isValid && isTouched && errorText}</p>
		</div>
	);
};

export default FormInput;
