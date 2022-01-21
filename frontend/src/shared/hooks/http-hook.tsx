import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const useRequest = () => {
	const userData = useSelector((state: RootState) => state.user);

	const sendRequest = async (
		url: string,
		method: 'POST' | 'GET' | 'PATCH',
		body: string | null = null
	) => {
		const response = await fetch(url, {
			method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `BEARER ${userData.token}`,
			},
			body,
		});

		const responseData = await response.json();
		return responseData;
	};

	const sendData = async (
		_id: string,
		email: string,
		date: string,
		task: string,
		prevLevel: number
	) => {
		const response = await fetch('http://localhost:8080/api/log/task', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `BEARER ${userData.token}`,
			},
			body: JSON.stringify({
				_id,
				email,
				date,
				task,
				levelOfCompletion: prevLevel !== 2 ? prevLevel + 1 : 0,
			}),
		});

		const responseData = await response.json();
		return responseData;
	};

	return { sendRequest, sendData };
};
