import { useState, useEffect } from 'react';

export enum useInputTypes {
	NAME = 'NAME',
	EMAIL = 'EMAIL',
	PASSWORD = 'PASSWORD',
	COMPARISON = 'COMPARISON',
	MESSAGE = 'MESSAGE',
	GOALS = 'GOALS',
	NONE = 'NONE',
}

export const useInput = (args: {
	type:
		| useInputTypes.NAME
		| useInputTypes.EMAIL
		| useInputTypes.PASSWORD
		| useInputTypes.COMPARISON
		| useInputTypes.MESSAGE
		| useInputTypes.GOALS
		| useInputTypes.NONE;
	validate: boolean;
	display?: boolean;
	compareTo?: string | null;
}) => {
	const type = args.type;
	const validate = args.validate;
	const display = args.display;
	const compareTo = args.compareTo;

	const [input, setInput] = useState({
		value: '',
		isValid: false,
		isTouched: false,
	});

	const inputOnChangeHandler = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setInput((prev) => ({ ...prev, value: event.target.value, isTouched: false }));
	};

	const inputOnBlurHandler = () => {
		if (input.value.trim().length >= 1 && validate && display) {
			setInput((prev) => ({ ...prev, isTouched: true }));
		}
	};

	useEffect(() => {
		if (display) {
			setInput((prev) => ({ ...prev, isTouched: true }));
		}
	}, [display]);

	// useEffect(() => {
	// 	if (!validate) {
	// 		setInput((prev) => ({ ...prev, isValid: true }));
	// 	}
	// }, []);

	useEffect(() => {
		if (type === useInputTypes.NAME && validate) {
			input.value.trim().length >= 2 &&
			input.value.trim().match(/^['’\p{L}\p{M}]*-?['’\p{L}\p{M}]*$/giu)
				? setInput((prev) => ({ ...prev, isValid: true }))
				: setInput((prev) => ({ ...prev, isValid: false }));
		}
	}, [input.value]);

	useEffect(() => {
		if (type === useInputTypes.GOALS && validate) {
			input.value.trim().length < 100
				? setInput((prev) => ({ ...prev, isValid: true }))
				: setInput((prev) => ({ ...prev, isValid: false }));
		}
	}, [input.value]);

	useEffect(() => {
		if (type === useInputTypes.EMAIL && validate) {
			input.value.match(
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
				? setInput((prev) => ({ ...prev, isValid: true }))
				: setInput((prev) => ({ ...prev, isValid: false }));
		}
	}, [input.value]);

	useEffect(() => {
		if (type === useInputTypes.PASSWORD && validate) {
			input.value.match(
				/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
			)
				? setInput((prev) => ({ ...prev, isValid: true }))
				: setInput((prev) => ({ ...prev, isValid: false }));
		}
	}, [input.value]);

	useEffect(() => {
		if (type === useInputTypes.COMPARISON && validate) {
			input.value === compareTo
				? setInput((prev) => ({ ...prev, isValid: true }))
				: setInput((prev) => ({ ...prev, isValid: false }));
		}
	}, [input.value, compareTo]);

	useEffect(() => {
		if (type === useInputTypes.MESSAGE && validate) {
			input.value.trim().length > 10
				? setInput((prev) => ({ ...prev, isValid: true }))
				: setInput((prev) => ({ ...prev, isValid: false }));
		}
	}, [input.value]);

	useEffect(() => {
		if (type === useInputTypes.NONE) {
			setInput((prev) => ({ ...prev, isValid: true }));
		}
	}, [input.value]);

	return {
		input,
		setInput,
		inputOnChangeHandler,
		inputOnBlurHandler,
	};
};
