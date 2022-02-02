import React, { useEffect } from 'react';
import classes from './AnnualGraphMonth.module.scss';

const AnnualGraphMonth: React.FC<{
	data: {};
}> = (props) => {
	return (
		<div className={classes.wrapper}>
			{Object.values(props.data).map((item: any) => (
				<div>
					{item} {console.log(item)}
				</div>
			))}
		</div>
	);
};

export default AnnualGraphMonth;
