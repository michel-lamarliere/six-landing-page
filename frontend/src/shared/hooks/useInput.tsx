import { useState, useRef } from 'react';

export const useInput = () => {
	const [input, setInput] = useState('');

	const inputOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInput(event.target.value);
	};

	return { input, setInput, inputOnChangeHandler };
};
