import React from 'react';

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

import classes from './UserIcon.module.scss';

interface Props {
	icon: number;
	className: string;
}

const UserIcon: React.FC<Props> = (props) => {
	const getIcon = (number: number) => {
		switch (number) {
			case 0:
				return <img src={userIcon0} alt='Icône' className={props.className} />;
			case 1:
				return <img src={userIcon1} alt='Icône' className={props.className} />;
			case 2:
				return <img src={userIcon2} alt='Icône' className={props.className} />;
			case 3:
				return <img src={userIcon3} alt='Icône' className={props.className} />;
			case 4:
				return <img src={userIcon4} alt='Icône' className={props.className} />;
			case 5:
				return <img src={userIcon5} alt='Icône' className={props.className} />;
			case 6:
				return <img src={userIcon6} alt='Icône' className={props.className} />;
			case 7:
				return <img src={userIcon7} alt='Icône' className={props.className} />;
			case 8:
				return <img src={userIcon8} alt='Icône' className={props.className} />;
			case 9:
				return <img src={userIcon9} alt='Icône' className={props.className} />;
			case 10:
				return <img src={userIcon10} alt='Icône' className={props.className} />;
			case 11:
				return <img src={userIcon11} alt='Icône' className={props.className} />;
			default:
				return;
		}
	};

	return <>{getIcon(props.icon)}</>;
};

export default UserIcon;
