import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import classes from './SidebarTitle.module.scss';

const SidebarTitle: React.FC<{
	title: string;
	links: { text: string; url?: string; onClick?: any }[];
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
						<>
							{link.url && (
								<Link className={classes.link} to={link.url}>
									{link.text}
								</Link>
							)}
							{link.onClick && (
								<div className={classes.link} onClick={link.onClick}>
									{link.text}
								</div>
							)}
						</>
					))}
				</div>
			)}
		</div>
	);
};

export default SidebarTitle;
