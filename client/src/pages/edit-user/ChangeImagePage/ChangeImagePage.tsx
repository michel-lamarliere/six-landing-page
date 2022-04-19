import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { useUserClass } from '../../../classes/user-class-hook';
import { useRequest } from '../../../hooks/http-hook';

import userIcon0 from '../../..//assets/icons/user/icon_0.svg';
import userIcon1 from '../../..//assets/icons/user/icon_1.svg';
import userIcon2 from '../../..//assets/icons/user/icon_2.svg';
import userIcon3 from '../../..//assets/icons/user/icon_3.svg';
import userIcon4 from '../../..//assets/icons/user/icon_4.svg';
import userIcon5 from '../../..//assets/icons/user/icon_5.svg';
import userIcon6 from '../../..//assets/icons/user/icon_6.svg';
import userIcon7 from '../../..//assets/icons/user/icon_7.svg';
import userIcon8 from '../../..//assets/icons/user/icon_8.svg';
import userIcon9 from '../../..//assets/icons/user/icon_9.svg';
import userIcon10 from '../../..//assets/icons/user/icon_10.svg';
import userIcon11 from '../../..//assets/icons/user/icon_11.svg';

import EditProfileFormWrapper, {
	EditProfileFormWrapperTypes,
} from '../../../containers/EditUserContainer/EditUserContainer';

import { RootState } from '../../../store/_store';

import classes from './ChangeImagePage.module.scss';

const ChangeImage: React.FC = () => {
	const { sendRequest } = useRequest();
	const { User } = useUserClass();

	const userState = useSelector((state: RootState) => state.user);

	const [activeIcon, setActiveIcon] = useState(User.getInfo().icon);
	const [chosenIcon, setChosenIcon] = useState<string>();
	const [response, setResponse] = useState('');

	const userIcons = [
		userIcon0,
		userIcon1,
		userIcon2,
		userIcon3,
		userIcon4,
		userIcon5,
		userIcon6,
		userIcon7,
		userIcon8,
		userIcon9,
		userIcon10,
		userIcon11,
	];

	const selectIconHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		const id = (event.target as HTMLButtonElement).id;
		setChosenIcon(id);
	};

	const changeImageHandler = async (event: any) => {
		event.preventDefault();

		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/user-modify/image`,
			method: 'PATCH',
			body: JSON.stringify({
				id: userState.id,
				icon: chosenIcon,
			}),
		});

		if (responseData.error) {
			setResponse(responseData.message);
			return;
		}

		setResponse(responseData.message);

		setTimeout(() => {
			setResponse('');
		}, 3000);

		const user = await User.refreshInfo();
		setActiveIcon(user.icon);
	};

	return (
		<EditProfileFormWrapper
			formAction={changeImageHandler}
			type={EditProfileFormWrapperTypes.MODIFY}
			title={'Image'}
			displaySubmitButton={true}
			response={response}
		>
			<div className={classes.icons}>
				{userIcons.map((icon, index) => (
					<button
						onClick={selectIconHandler}
						className={`${classes.icons__button} ${
							index === activeIcon && classes['icons__button--active']
						} ${
							index.toString() === chosenIcon &&
							classes['icons__button--chosen']
						}`}
						key={`icon-${icon}-${index}`}
					>
						<img src={icon} alt={`icône_${index}`} id={index.toString()} />
					</button>
				))}
			</div>
		</EditProfileFormWrapper>
	);
};

export default ChangeImage;
