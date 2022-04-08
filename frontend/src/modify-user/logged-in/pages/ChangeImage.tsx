import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { useUserClass } from '../../../_shared/classes/user-class-hook';
import { useRequest } from '../../../_shared/hooks/http-hook';

import userIcon0 from '../../../_shared/assets/imgs/icons/user/icon_0.svg';
import userIcon1 from '../../../_shared/assets/imgs/icons/user/icon_1.svg';
import userIcon2 from '../../../_shared/assets/imgs/icons/user/icon_2.svg';
import userIcon3 from '../../../_shared/assets/imgs/icons/user/icon_3.svg';
import userIcon4 from '../../../_shared/assets/imgs/icons/user/icon_4.svg';
import userIcon5 from '../../../_shared/assets/imgs/icons/user/icon_5.svg';
import userIcon6 from '../../../_shared/assets/imgs/icons/user/icon_6.svg';
import userIcon7 from '../../../_shared/assets/imgs/icons/user/icon_7.svg';
import userIcon8 from '../../../_shared/assets/imgs/icons/user/icon_8.svg';
import userIcon9 from '../../../_shared/assets/imgs/icons/user/icon_9.svg';
import userIcon10 from '../../../_shared/assets/imgs/icons/user/icon_10.svg';
import userIcon11 from '../../../_shared/assets/imgs/icons/user/icon_11.svg';

import EditProfileFormWrapper, {
	EditProfileFormWrapperTypes,
} from '../components/EditProfileFormWrapper';

import { RootState } from '../../../_shared/store/_store';

import classes from './ChangeImage.module.scss';

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

	const changeImageHandler = async () => {
		const responseData = await sendRequest(
			`${process.env.REACT_APP_BACKEND_URL}/user-modify/image`,
			'PATCH',
			JSON.stringify({
				id: userState.id,
				icon: chosenIcon,
			})
		);

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
			type={EditProfileFormWrapperTypes.MODIFY}
			title={'Image'}
			displaySubmitButton={true}
			button_onClick={changeImageHandler}
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
					>
						<img src={icon} alt={`icône_${index}`} id={index.toString()} />
					</button>
				))}
			</div>
		</EditProfileFormWrapper>
	);
};

export default ChangeImage;
