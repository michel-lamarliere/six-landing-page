import { useState, useEffect } from 'react';

export const useInput = (
	condition:
		| 'NAME'
		| 'CHECK_EMAIL'
		| 'EMAIL'
		| 'PASSWORD'
		| 'PASSWORD_COMPARISON'
		| 'OLD_PASSWORD'
		| 'NONE',
	loginMode?: boolean | null,
	compareTo?: string | null,
	additionalOnBlurHandler?: () => void
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
		if (condition === 'NAME') {
			input.value.trim().length >= 2 &&
			input.value.trim().match(/^[-'a-zA-ZÀ-ÖØ-öø-ÿ]+$/)
				? setInput((prev) => ({ ...prev, isValid: true }))
				: setInput((prev) => ({ ...prev, isValid: false }));
		}
	}, [input.value]);

	useEffect(() => {
		if (condition === 'EMAIL') {
			input.value.match(
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
				? setInput((prev) => ({ ...prev, isValid: true }))
				: setInput((prev) => ({ ...prev, isValid: false }));
		}
	}, [input.value]);

	useEffect(() => {
		if (condition === 'CHECK_EMAIL' && input.value.trim().length > 0) {
			if (additionalOnBlurHandler) {
				const delayDebounceFn = setTimeout(() => {
					additionalOnBlurHandler();
					setInput((prev) => ({ ...prev, isTouched: true }));
				}, 1000);

				return () => {
					setInput((prev) => ({ ...prev, isTouched: false, isValid: false }));
					clearTimeout(delayDebounceFn);
				};
			}
		}
	}, [input.value]);

	useEffect(() => {
		if (condition === 'PASSWORD' && !loginMode) {
			input.value.match(
				/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
			)
				? setInput((prev) => ({ ...prev, isValid: true }))
				: setInput((prev) => ({ ...prev, isValid: false }));
		}
	}, [input.value]);

	useEffect(() => {
		if (condition === 'PASSWORD_COMPARISON') {
			input.value === compareTo
				? setInput((prev) => ({ ...prev, isValid: true }))
				: setInput((prev) => ({ ...prev, isValid: false }));
		}
	}, [input.value]);

	useEffect(() => {
		if (condition === 'OLD_PASSWORD' && input.isTouched) {
			if (additionalOnBlurHandler) {
				additionalOnBlurHandler();
			}
		}
	}, [input.value]);

	const inputOnBlurHandler = () => {
		if (condition !== 'CHECK_EMAIL') {
			if (input.value.trim().length >= 1) {
				setInput((prev) => ({ ...prev, isTouched: true }));
			}
			if (additionalOnBlurHandler) {
				additionalOnBlurHandler();
			}
		}
	};

	useEffect(() => {
		if (loginMode) {
			setInput((prev) => ({ ...prev, isValid: true, isTouched: false }));
		} else if (!loginMode) {
			setInput((prev) => ({ ...prev, isValid: false, isTouched: false }));
		}
	}, [loginMode]);

	return {
		input,
		setInput,
		inputOnChangeHandler,
		inputOnBlurHandler,
	};
};
