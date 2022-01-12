import { useState, useCallback, useEffect } from 'react';

export const useInput = (condition: 'NAME' | 'EMAIL' | 'PASSWORD' | 'NONE') => {
	const [input, setInput] = useState({
		value: '',
		isValid: false,
		isTouched: false,
	});

	if (condition === 'NAME' && input.value.trim.length > 2) {
		setInput((prev) => ({ ...prev, isValid: true }));
	}

	if (
		condition === 'EMAIL' &&
		input.value.match(
			/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
		)
	) {
		setInput((prev) => ({ ...prev, isValid: true }));
	}

	if (
		condition === 'PASSWORD' &&
		input.value.match(
			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
		)
	) {
		setInput((prev) => ({ ...prev, isValid: true }));
	}

	const inputOnChangeHandler = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setInput((prev) => ({ ...prev, value: event.target.value }));
		},
		[]
	);

	const inputOnBlurHandler = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setInput((prev) => ({ ...prev, isTouched: true }));
		},
		[]
	);

	return { input, setInput, inputOnChangeHandler, inputOnBlurHandler };
};
