import { useState, useEffect } from 'react';

export enum useInputTypes {
	NAME = 'NAME',
	CHECK_EMAIL = 'CHECK_EMAIL',
	EMAIL = 'EMAIL',
	PASSWORD = 'PASSWORD',
	NEW_PASSWORD = 'NEW_PASSWORD',
	PASSWORD_COMPARISON = 'PASSWORD_COMPARISON',
	OLD_PASSWORD = 'OLD_PASSWORD',
	NONE = 'NONE',
}

export const useInput = (
	type:
		| useInputTypes.NAME
		| useInputTypes.CHECK_EMAIL
		| useInputTypes.EMAIL
		| useInputTypes.PASSWORD
		| useInputTypes.NEW_PASSWORD
		| useInputTypes.PASSWORD_COMPARISON
		| useInputTypes.OLD_PASSWORD
		| useInputTypes.NONE,
	compareTo?: string | null
) => {
	const [input, setInput] = useState({
		value: '',
		isValid: false,
		isTouched: false,
	});

	const inputOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInput((prev) => ({ ...prev, value: event.target.value }));
	};

	useEffect(() => {
		if (type === 'NAME') {
			input.value.trim().length >= 2 &&
			input.value.trim().match(/^['’\p{L}\p{M}]*-?['’\p{L}\p{M}]*$/giu)
				? setInput((prev) => ({ ...prev, isValid: true }))
				: setInput((prev) => ({ ...prev, isValid: false }));
		}
	}, [input.value]);

	useEffect(() => {
		if (type === 'EMAIL') {
			input.value.match(
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
				? setInput((prev) => ({ ...prev, isValid: true }))
				: setInput((prev) => ({ ...prev, isValid: false }));
		}
	}, [input.value]);

	useEffect(() => {
		if (type === 'CHECK_EMAIL' && input.value.trim().length > 0) {
			const delayDebounceFn = setTimeout(() => {
				setInput((prev) => ({ ...prev, isTouched: true }));
			}, 1000);

			return () => {
				setInput((prev) => ({ ...prev, isTouched: false, isValid: false }));
				clearTimeout(delayDebounceFn);
			};
		}
	}, [input.value]);

	useEffect(() => {
		if (type === 'PASSWORD') {
			input.value.match(
				/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
			)
				? setInput((prev) => ({ ...prev, isValid: true }))
				: setInput((prev) => ({ ...prev, isValid: false }));
		}
	}, [input.value]);

	useEffect(() => {
		if (type === 'OLD_PASSWORD') {
			setInput((prev) => ({ ...prev, isTouched: false }));
		}
	}, [input.value]);

	useEffect(() => {
		if (type === 'NEW_PASSWORD') {
			input.value.match(
				/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
			)
				? setInput((prev) => ({ ...prev, isValid: true }))
				: setInput((prev) => ({ ...prev, isValid: false }));
		}
	}, [input.value, compareTo]);

	useEffect(() => {
		if (type === 'PASSWORD_COMPARISON') {
			input.value === compareTo
				? setInput((prev) => ({ ...prev, isValid: true }))
				: setInput((prev) => ({ ...prev, isValid: false }));
		}
	}, [input.value, compareTo]);

	const inputOnBlurHandler = () => {
		if (type !== 'CHECK_EMAIL') {
			if (input.value.trim().length >= 1) {
				setInput((prev) => ({ ...prev, isTouched: true }));
			}
		}
	};

	return {
		input,
		setInput,
		inputOnChangeHandler,
		inputOnBlurHandler,
	};
};
