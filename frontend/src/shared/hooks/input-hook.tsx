import { useState, useEffect } from 'react';

export const useInput = (
	condition: 'NAME' | 'EMAIL' | 'PASSWORD' | 'NONE',
	loginMode?: boolean
) => {
	const [input, setInput] = useState({
		value: '',
		isValid: false,
		isTouched: false,
	});

	const inputOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const typedValue = event.target.value;

		if (!loginMode) {
			if (condition === 'NAME') {
				typedValue.trim().length >= 2 &&
				typedValue.trim().match(/^[-'a-zA-ZÀ-ÖØ-öø-ÿ]+$/)
					? setInput((prev) => ({ ...prev, isValid: true }))
					: setInput((prev) => ({ ...prev, isValid: false }));
			}

			if (condition === 'EMAIL') {
				typedValue.match(
					/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				)
					? setInput((prev) => ({ ...prev, isValid: true }))
					: setInput((prev) => ({ ...prev, isValid: false }));
			}

			if (condition === 'PASSWORD') {
				typedValue.match(
					/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
				)
					? setInput((prev) => ({ ...prev, isValid: true }))
					: setInput((prev) => ({ ...prev, isValid: false }));
			}
		}
		setInput((prev) => ({ ...prev, value: event.target.value }));
	};

	const inputOnBlurHandler = () => {
		setInput((prev) => ({ ...prev, isTouched: true }));
	};

	const inputOnPasteHandler = (event: React.ClipboardEvent<HTMLInputElement>) => {
		const pastedValue = event.clipboardData.getData('Text');

		if (!loginMode) {
			if (condition === 'NAME') {
				pastedValue.trim().length > 2
					? setInput((prev) => ({ ...prev, isValid: true }))
					: setInput((prev) => ({ ...prev, isValid: false }));
			}

			if (condition === 'EMAIL') {
				pastedValue
					.trim()
					.match(
						/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
					)
					? setInput((prev) => ({ ...prev, isValid: true }))
					: setInput((prev) => ({ ...prev, isValid: false }));
			}

			if (condition === 'PASSWORD') {
				pastedValue.match(
					/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
				)
					? setInput((prev) => ({ ...prev, isValid: true }))
					: setInput((prev) => ({ ...prev, isValid: false }));
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
		inputOnPasteHandler,
	};
};
