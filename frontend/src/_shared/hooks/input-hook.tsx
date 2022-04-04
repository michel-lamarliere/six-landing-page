import { useState, useEffect } from 'react';

export enum useInputTypes {
	NAME = 'NAME',
	EMAIL = 'EMAIL',
	PASSWORD = 'PASSWORD',
	NEW_PASSWORD = 'NEW_PASSWORD',
	PASSWORD_COMPARISON = 'PASSWORD_COMPARISON',
	NONE = 'NONE',
}

export const useInput = (data: {
	type:
		| useInputTypes.NAME
		| useInputTypes.EMAIL
		| useInputTypes.PASSWORD
		| useInputTypes.PASSWORD_COMPARISON
		| useInputTypes.NONE;
	validate: boolean;
	display?: boolean;
	compareTo?: string | null;
}) => {
	const type = data.type;
	const validate = data.validate;
	const display = data.display;
	const compareTo = data.compareTo;

	const [input, setInput] = useState({
		value: '',
		isValid: false,
		isTouched: false,
	});

	const inputOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInput((prev) => ({ ...prev, value: event.target.value, isTouched: false }));
	};

	const inputOnBlurHandler = () => {
		if (input.value.trim().length >= 1 && validate && display) {
			setInput((prev) => ({ ...prev, isTouched: true }));
		}
	};

	// useEffect(() => {
	// 	if (display) {
	// 		setInput((prev) => ({ ...prev, isTouched: true }));
	// 	}
	// }, [display]);

	useEffect(() => {
		if (type === 'NAME' && validate) {
			input.value.trim().length >= 2 &&
			input.value.trim().match(/^['’\p{L}\p{M}]*-?['’\p{L}\p{M}]*$/giu)
				? setInput((prev) => ({ ...prev, isValid: true }))
				: setInput((prev) => ({ ...prev, isValid: false }));
		}
	}, [input.value]);

	useEffect(() => {
		if (type === 'EMAIL' && validate) {
			input.value.match(
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
				? setInput((prev) => ({ ...prev, isValid: true }))
				: setInput((prev) => ({ ...prev, isValid: false }));
		}
	}, [input.value]);

	useEffect(() => {
		if (type === 'PASSWORD' && validate) {
			input.value.match(
				/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
			)
				? setInput((prev) => ({ ...prev, isValid: true }))
				: setInput((prev) => ({ ...prev, isValid: false }));
		}
	}, [input.value]);

	useEffect(() => {
		if (type === 'PASSWORD_COMPARISON' && validate) {
			input.value === compareTo
				? setInput((prev) => ({ ...prev, isValid: true }))
				: setInput((prev) => ({ ...prev, isValid: false }));
		}
	}, [input.value, compareTo]);

	return {
		input,
		setInput,
		inputOnChangeHandler,
		inputOnBlurHandler,
	};
};
