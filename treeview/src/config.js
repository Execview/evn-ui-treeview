import React from 'react';

import InputCellDisplay from './TEMP-TABLE/inputCell/InputCellDisplay'
import InputCellEditor from './TEMP-TABLE/inputCell/InputCellEditor'
import ColorCellDisplay from './TEMP-TABLE/colorCell/ColorCellDisplay'
import ColorCellEditor from './TEMP-TABLE/colorCell/ColorCellEditor'
import DateCellDisplay from './TEMP-TABLE/dateCell/DateCellDisplay'
import DateCellEditor from './TEMP-TABLE/dateCell/DateCellEditor'
import TreeCell from './TreeCell';

export const treeStructure = {
	_1235d:{open: true, nodes:[]},
	_m7ad1:{open: true, nodes:["_917gb","_1236d"]},
	_917gb:{open: true, nodes:[]},
	_1236d:{open: true, nodes:["_k8450"]},
	_k8450:{open: false, nodes:["_u184b"]},
	_u184b:{open: true, nodes:[]},
}

export const data = {
	_1235d: { activityTitle: 'Mobile Shipment', startDate: '2017-08-17T10:39:57.362Z', endDate: '2017-08-17T10:39:57.362Z', progress: 'amber'},
  	_m7ad1: { activityTitle: 'Things to Do', startDate: '2017-08-17T10:39:57.362Z', endDate: '2017-08-17T10:39:57.362Z', progress: 'red'},
  	_917gb: { activityTitle: 'Replace Tire', startDate: '2017-08-17T10:39:57.362Z', endDate: '1996-09-13T10:39:57.362Z', progress: 'green'},
  	_1236d: { activityTitle: 'ANUYIC', startDate: '2017-08-17T10:39:57.362Z', endDate: '2017-08-17T10:39:57.362Z', progress: 'green' },
  	_k8450: { activityTitle: 'OAUWDAOAUWDAOAUWDAOAUWDAOAUWDAOAUWDAOAUWDAOAUWDAOAUWDAOAUWDAOAUWDAOAUWDA', startDate: '2017-08-17T10:39:57.362Z', endDate: '2019-01-17T10:39:57.362Z', progress: 'red' },
 	_u184b: { activityTitle: 'AWDIA', startDate: '2017-08-17T10:39:57.362Z', endDate: '2017-08-17T10:39:57.362Z', progress: 'amber' } 
}

export const columnsInfo = {
			treeExpander: {cellType: 'tree', colTitle: 'Tree'},
			//activityTitle: { cellType: 'text', colTitle: 'Activity Title' }, //cant edit activity title without this
			startDate: { cellType: 'date', colTitle: 'Start Date' },
			endDate: { cellType: 'date', colTitle: 'End Date' },
			progress: { cellType: 'color', colTitle: 'RAG' } };

export const editableCells = {
	_1235d: ['activityTitle', 'startDate', 'progress', 'endDate'],
	_m7ad1: ['activityTitle', 'startDate', 'progress', 'endDate'],
	_917gb: ['activityTitle', 'startDate', 'progress', 'endDate'],
	_1236d: ['activityTitle', 'startDate', 'progress', 'endDate'],
	_k8450: ['activityTitle', 'startDate', 'progress', 'endDate'],
	_u184b: ['activityTitle', 'startDate', 'progress', 'endDate'] };

export const cellTypes = {
	tree: {
		display: <TreeCell />,
		editor: <TreeCell/>
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
