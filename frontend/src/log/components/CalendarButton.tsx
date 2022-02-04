import React, { useState } from 'react';
import classes from './CalendarButton.module.scss';

const CalendarButton: React.FC<{ onClick?: (arg0: any) => void }> = (props) => {
	return <button onClick={props.onClick}>Calendrier</button>;
};

export default CalendarButton;
