import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PopUpActionTypes } from '../store/pop-ups';
import { RootState } from '../store/_store';
import { UserActionTypes } from '../store/user';

export const useRequest = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const userData = useSelector((state: RootState) => state.user);

	const sendRequest = async (
		url: string,
		method: 'POST' | 'GET' | 'PATCH' | 'DELETE',
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

		if (responseData.fatal) {
			dispatch({ type: UserActionTypes.LOG_OUT });
			dispatch({
				type: PopUpActionTypes.SET_AND_SHOW_ERROR,
				message:
					"Il semble que votre compte n'existe plus, veuillez en créer un autre ou nous contacter.",
			});

			navigate('/');
			return;
		}

		return responseData;
	};

	const sendData = async (_id: string, dateAndTaskStr: string, prevLevel: number) => {
		const date = dateAndTaskStr.split('_')[0];
		const task = dateAndTaskStr.split('_')[1];

		const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/log/task`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `BEARER ${userData.token}`,
			},
			body: JSON.stringify({
				_id,
				date,
				task,
				levelOfCompletion: prevLevel !== 2 ? prevLevel + 1 : 0,
			}),
		});

		const responseData = await response.json();

		if (responseData.fatal) {
			dispatch({ type: UserActionTypes.LOG_OUT });
			dispatch({
				type: PopUpActionTypes.SET_AND_SHOW_ERROR,
				message:
					"Il semble que votre compte n'existe plus, veuillez en créer un autre ou nous contacter.",
			});

			navigate('/');
			return;
		}

		return responseData;
	};

	return { sendRequest, sendData };
};
