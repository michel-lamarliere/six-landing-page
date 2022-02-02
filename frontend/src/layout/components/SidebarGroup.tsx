import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

import classes from './SidebarGroup.module.scss';

const SidebarGroups: React.FC<{
	title: string;
	links: {
		text: string;
		url?: string;
		onClick?: any;
		key: string;
		nav_link?: boolean;
	}[];
}> = (props) => {
	const [showLinks, setShowLinks] = useState(true);

	return (
		<div className={classes.wrapper}>
			<div className={classes.title}>
				<img src='' alt='' className={classes.title_img} />
				<h3 className={classes.title_text}>{props.title}</h3>
				<button
					className={classes.button}
					onClick={() => setShowLinks((prev) => !prev)}
				>
					<img src='' alt='' />
				</button>
			</div>
			{showLinks && (
				<div className={classes.links}>
					{props.links.map((link) => (
						<React.Fragment key={link.key}>
							{link.url && (
								<>
									{link.nav_link ? (
										<NavLink
											className={classes.link}
											style={({ isActive }) => ({
												color: isActive ? 'grey' : 'black',
											})}
											to={link.url}
										>
											{link.text}
										</NavLink>
									) : (
										<Link className={classes.link} to={link.url}>
											{link.text}
										</Link>
									)}
								</>
							)}
							{link.onClick && (
								<div className={classes.link} onClick={link.onClick}>
									{link.text}
								</div>
							)}
						</React.Fragment>
					))}
				</div>
			)}
		</div>
	);
};

export default SidebarGroups;