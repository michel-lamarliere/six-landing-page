import { useState, useEffect } from 'react';

export const useInput = (
	condition: 'NAME' | 'EMAIL' | 'PASSWORD' | 'NONE',
	loginMode: boolean
) => {
	const [input, setInput] = useState({
		value: '',
		isValid: false,
		isTouched: false,
	});

	useEffect(() => {
		if (loginMode) {
			setInput((prev) => ({ ...prev, isValid: true, isTouched: false }));
		} else if (!loginMode && input.value.length !== 0) {
			setInput((prev) => ({ ...prev, isValid: false, isTouched: true }));
		}
	}, [loginMode]);

	const inputOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInput((prev) => ({ ...prev, value: event.target.value }));

		if (!loginMode) {
			if (condition === 'NAME' && input.value.trim().length > 2) {
				setInput((prev) => ({ ...prev, isValid: true }));
				console.log(input.value);
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
		}
	};

	const inputOnBlurHandler = () => {
		setInput((prev) => ({ ...prev, isTouched: true }));
	};

	return { input, setInput, inputOnChangeHandler, inputOnBlurHandler };
};
