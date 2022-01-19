import { useState, useEffect } from 'react';

export const useInput = (
	condition:
		| 'NAME'
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
		// const typedValue = event.target.value;
		// if (!loginMode) {
		// 	if (condition === 'NAME') {
		// 		typedValue.trim().length >= 2 &&
		// 		typedValue.trim().match(/^[-'a-zA-ZÀ-ÖØ-öø-ÿ]+$/)
		// 			? setInput((prev) => ({ ...prev, isValid: true }))
		// 			: setInput((prev) => ({ ...prev, isValid: false }));
		// 	}
		// 	if (condition === 'EMAIL') {
		// 		typedValue.match(
		// 			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		// 		)
		// 			? setInput((prev) => ({ ...prev, isValid: true }))
		// 			: setInput((prev) => ({ ...prev, isValid: false }));
		// 	}
		// 	if (condition === 'PASSWORD') {
		// 		typedValue.match(
		// 			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
		// 		)
		// 			? setInput((prev) => ({ ...prev, isValid: true }))
		// 			: setInput((prev) => ({ ...prev, isValid: false }));
		// 	}
		// 	if (condition === 'NEW_PASSWORD') {
		// 		typedValue.match(
		// 			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
		// 		)
		// 			? setInput((prev) => ({ ...prev, isValid: true }))
		// 			: setInput((prev) => ({ ...prev, isValid: false }));
		// 	}
		// 	if (condition === 'PASSWORD_COMPARISON') {
		// 		typedValue === compareTo
		// 			? setInput((prev) => ({ ...prev, isValid: true }))
		// 			: setInput((prev) => ({ ...prev, isValid: false }));
		// 	}
		// }
		setInput((prev) => ({ ...prev, value: event.target.value }));
	};

	useEffect(() => {
		if (condition === 'PASSWORD_COMPARISON') {
			input.value === compareTo
				? setInput((prev) => ({ ...prev, isValid: true }))
				: setInput((prev) => ({ ...prev, isValid: false }));
		}
	}, [compareTo, input.value]);

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
		if (condition === 'PASSWORD') {
			input.value.match(
				/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
			)
				? setInput((prev) => ({ ...prev, isValid: true }))
				: setInput((prev) => ({ ...prev, isValid: false }));
		}
	}, [input.value]);

	// useEffect(() => {
	// 	if (condition === 'NEW_PASSWORD' && compareTo) {
	// 		input.value !== compareTo &&
	// 		input.value.match(
	// 			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
	// 		)
	// 			? setInput((prev) => ({ ...prev, isValid: true }))
	// 			: setInput((prev) => ({ ...prev, isValid: false }));
	// 	}
	// }, [compareTo, input.value]);

	useEffect(() => {
		if (condition === 'OLD_PASSWORD' && input.isTouched) {
			if (additionalOnBlurHandler) {
				additionalOnBlurHandler();
			}
		}
	}, [input.value]);

	const inputOnBlurHandler = () => {
		setInput((prev) => ({ ...prev, isTouched: true }));
		if (additionalOnBlurHandler) {
			additionalOnBlurHandler();
		}
	};

	// const inputOnPasteHandler = (event: React.ClipboardEvent<HTMLInputElement>) => {
	// 	// const pastedValue = event.clipboardData.getData('Text');
	// 	// if (!loginMode) {
	// 	// 	if (condition === 'NAME') {
	// 	// 		pastedValue.trim().length > 2
	// 	// 			? setInput((prev) => ({ ...prev, isValid: true }))
	// 	// 			: setInput((prev) => ({ ...prev, isValid: false }));
	// 	// 	}
	// 	// 	if (condition === 'EMAIL') {
	// 	// 		pastedValue
	// 	// 			.trim()
	// 	// 			.match(
	// 	// 				/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
	// 	// 			)
	// 	// 			? setInput((prev) => ({ ...prev, isValid: true }))
	// 	// 			: setInput((prev) => ({ ...prev, isValid: false }));
	// 	// 	}
	// 	// 	if (condition === 'PASSWORD') {
	// 	// 		pastedValue.match(
	// 	// 			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
	// 	// 		)
	// 	// 			? setInput((prev) => ({ ...prev, isValid: true }))
	// 	// 			: setInput((prev) => ({ ...prev, isValid: false }));
	// 	// 	}
	// 	// 	if (condition === 'PASSWORD_COMPARISON') {
	// 	// 		pastedValue === compareTo
	// 	// 			? setInput((prev) => ({ ...prev, isValid: true }))
	// 	// 			: setInput((prev) => ({ ...prev, isValid: false }));
	// 	// 	}
	// 	// }
	// };

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
		// inputOnPasteHandler,
	};
};
