import React from 'react';

import InputCellDisplay from './TEMP-TABLE/inputCell/InputCellDisplay'
import InputCellEditor from './TEMP-TABLE/inputCell/InputCellEditor'
import ColorCellDisplay from './TEMP-TABLE/colorCell/ColorCellDisplay'
import ColorCellEditor from './TEMP-TABLE/colorCell/ColorCellEditor'
import DateCellDisplay from './TEMP-TABLE/dateCell/DateCellDisplay'
import DateCellEditor from './TEMP-TABLE/dateCell/DateCellEditor'
import TreeCell from './TreeCell';
import SchedulerCell from './SchedulerCell'
import SchedulerHeader from './SchedulerHeader';

export const treeStructure = {
	_1235d:{nodes:[]},
	_m7ad1:{nodes:["_917gb","_1236d"]},
	_917gb:{nodes:[]},
	_1236d:{nodes:["_k8450"]},
	_k8450:{nodes:["_u184b"]},
	_u184b:{nodes:[]},
}

export const data = {
	_1235d: { activityTitle: 'Mobile Shipment', startDate: '2017-08-17T10:39:57.362Z', endDate: '2017-08-17T10:39:57.362Z', progress: 'amber'},
  	_m7ad1: { activityTitle: 'Activity 1', startDate: '2017-08-17T10:39:57.362Z', endDate: '2017-08-17T10:39:57.362Z', progress: 'red'},
  	_917gb: { activityTitle: 'T1', startDate: '2017-08-17T10:39:57.362Z', endDate: '1996-09-13T10:39:57.362Z', progress: 'green'},
  	_1236d: { activityTitle: 'ANUYIC', startDate: '2017-08-17T10:39:57.362Z', endDate: '2017-08-17T10:39:57.362Z', progress: 'green' },
  	_k8450: { activityTitle: 'OAUWDAOAUWDAOAUWDAOAUWDAOAUWDAOAUWDAOAUWDAOAUWDAOAUWDAOAUWDAOAUWDAOAUWDA', startDate: '2017-08-17T10:39:57.362Z', endDate: '2019-01-17T10:39:57.362Z', progress: 'red' },
 	_u184b: { activityTitle: 'AWDIA', startDate: '2017-08-17T10:39:57.362Z', endDate: '2017-08-17T10:39:57.362Z', progress: 'amber' } 
}

export const columnsInfo = {
	treeExpander: {cellType: 'tree', headerData: 'Tree'},
	//activityTitle: { cellType: 'text', headerData: 'Activity Title' }, //cant edit activity title without this
	startDate: { cellType: 'date', headerData: 'Start Date', width:140 },
	endDate: { cellType: 'date', headerData: 'End Date', width:140 },
	progress: { cellType: 'color', headerData: 'RAG' },
	scheduler: {cellType: 'scheduler', headerData: 'SchedulerHeader goes here', width: 300, headerType: 'schedulerHeader'}
};

export const editableCells = {
	_1235d: ['activityTitle', 'startDate', 'progress', 'endDate'],
	_m7ad1: ['activityTitle', 'startDate', 'progress', 'endDate'],
	_917gb: ['activityTitle', 'startDate', 'progress', 'endDate'],
	_1236d: ['activityTitle', 'startDate', 'progress', 'endDate'],
	_k8450: ['activityTitle', 'startDate', 'progress', 'endDate'],
	_u184b: ['activityTitle', 'startDate', 'progress', 'endDate'] };

export const cellTypes = {
	schedulerHeader: {
		display: <SchedulerHeader/>
	},
	tree: {
		display: <TreeCell />
	},
	scheduler: {
		display: <SchedulerCell/>
	},
	text: {
		display: <InputCellDisplay />,
		editor: <InputCellEditor />
	},
	color: {
		display: <ColorCellDisplay />,
		editor: <ColorCellEditor />
	},
	date: {
		display: <DateCellDisplay />,
		editor: <DateCellEditor />
	},
};
