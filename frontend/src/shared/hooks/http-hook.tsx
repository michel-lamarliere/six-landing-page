export const useRequest = () => {
	const sendRequest = async (
		url: string,
		method: string,
		body: string | null = null
	) => {
		const response = await fetch(url, {
			method,
			headers: {
				'Content-Type': 'application/json',
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
		const response = await fetch('http://localhost:8080/api/logs/task', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
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
