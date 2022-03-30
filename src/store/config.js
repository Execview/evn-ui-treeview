import React from 'react';

import { TextCell, ColorCell, DateCell } from '@execview/table'

import Data from './configData.json' assert { type: "json" }

export const data = Data


const progressValues = { green: 'On track', amber: 'At Risk', red: 'Blocked', grey: 'Unknown Status', blue: 'Completed' };

export const cellTypes = {
	text: <TextCell />,
	color: <ColorCell colorStrings={progressValues} inline />,
	date: <DateCell />,
};

export const columnsInfo = {
	name: { cellType: cellTypes['text'], headerType: 'Activity Title', rule: 'textSize' }, //cant edit activity title without this
	startdate: { cellType: cellTypes['date'], headerType: 'Start Date' },
	enddate: { cellType: cellTypes['date'], headerType: 'End Date' },
	progress: { cellType: cellTypes['color'], headerType: 'RAG' }
};

