import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../store/_store';
import { ErrorPopUpActionTypes } from '../store/pop-ups/error-pop-up';

import { useUserClass } from './user-class-hook';

export const useTaskClass = () => {
	const dispatch = useDispatch();

	const { User } = useUserClass();

	const userData = useSelector((state: RootState) => state.user);

	class Task {
		static async save(data: { date: string; task: string; previousLevel: number }) {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/log/task`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `BEARER ${userData.token}`,
					},
					body: JSON.stringify({
						_id: userData.id,
						date: data.date,
						task: data.task,
						levelOfCompletion:
							data.previousLevel !== 2 ? data.previousLevel + 1 : 0,
					}),
				}
			);

			const responseData = await response.json();

			if (responseData.fatal) {
				User.logOut({ redirect: true });

				dispatch({
					type: ErrorPopUpActionTypes.SET_AND_SHOW_ERROR_POP_UP,
					message:
						"Il semble que votre compte n'existe plus, veuillez en créer un autre ou nous contacter.",
				});
				return;
			}

			return responseData;
		}
	}
	return { Task };
};
