interface State {
	message: null | string;
}

interface Action {
	type: ErrorPopupActionTypes;
	message: string;
}

const initialStateReducer: State = {
	message:
		'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio enim ratione at tempore explicabo laudantium, quis ad perspiciatis repellendus repudiandae accusamus officiis, ullam impedit delectus similique velit assumenda reiciendis ipsa!',
};

export const enum ErrorPopupActionTypes {
	SET_ERROR = 'SET_ERROR',
	REMOVE_ERROR = 'REMOVE_ERROR',
}

const ErrorReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case ErrorPopupActionTypes.SET_ERROR: {
			return {
				message: action.message,
			};
		}
		case ErrorPopupActionTypes.REMOVE_ERROR: {
			return {
				message: null,
			};
		}
		default:
			return state;
	}
};

export default ErrorReducer;
