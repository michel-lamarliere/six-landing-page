import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { UserActionTypes } from '../store/user';
import { ErrorPopUpActionTypes } from '../store/pop-ups/error-pop-up';

const useCheckUserExists = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const checkUserExists = (response: { fatal: boolean }) => {
		if (response.fatal) {
			dispatch({ type: UserActionTypes.LOG_USER_OUT });
			dispatch({
				type: ErrorPopUpActionTypes.SET_AND_SHOW_ERROR_POP_UP,
				message:
					"Il semble que votre compte n'existe plus, veuillez en créer un autre ou nous contacter.",
			});

			navigate('/');
		}
	};

	return { checkUserExists };
};

export default useCheckUserExists;
