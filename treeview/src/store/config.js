import React from 'react';

import { TextCell, ColorCell, DateCell } from '@execview/table'

import Data from './configData.json'

export const treeStructure = {
	_1235d:{nodes:[]},
	_m7ad1:{nodes:["_917gb","_1236d"]},
	_917gb:{nodes:[]},
	_1236d:{nodes:["_k8450"]},
	_k8450:{nodes:["_u184b"]},
	_u184b:{nodes:[]},
}

export const data = Data

// export const data = {
// 	_1235d: { name: 'Project Scorpio', startdate: '2018-12-17T10:39:57.362Z', enddate: '2018-12-23T10:39:57.362Z', progress: 'amber'},
//   	_m7ad1: { name: 'Project X', startdate: '2018-12-18T10:39:57.362Z', enddate: '2018-12-26T10:39:57.362Z', progress: 'red'},
//   	_917gb: { name: 'Activity Bravo', startdate: '2018-12-17T10:39:57.362Z', enddate: '2018-12-22T10:39:57.362Z', progress: 'green'},
//   	_1236d: { name: 'Activity Echo', startdate: '2018-12-21T10:39:57.362Z', enddate: '2018-12-26T10:39:57.362Z', progress: 'green' },
//   	_k8450: { name: 'Task with a very very very very long name', startdate: '2018-12-18T10:39:57.362Z', enddate: '2018-12-23T10:39:57.362Z', progress: 'red' },
//  	_u184b: { name: 'Subtask Flower', startdate: '2018-12-18T10:39:57.362Z', enddate: '2018-12-23T10:39:57.362Z', progress: 'amber' }
// }

export const columnsInfo = {
	// treeExpander: {cellType: 'tree', headerData: 'Tree'},
	name: { cellType: 'text', headerData: 'Activity Title', rule: 'textSize' }, //cant edit activity title without this
	startdate: { cellType: 'date', headerData: 'Start Date'},
	enddate: { cellType: 'date', headerData: 'End Date' },
	progress: { cellType: 'color', headerData: 'RAG' },
	// scheduler: {cellType: 'scheduler', headerData: 'SchedulerHeader goes here', width: 600, headerType: 'schedulerHeader'}
};

export const editableCells = {
	_1235d: ['name', 'startdate', 'progress'],
	_m7ad1: ['name', 'startdate', 'progress', 'enddate', 'scheduler' ],
	_917gb: ['name', 'progress', 'enddate'],
	_1236d: ['name', 'startdate', 'progress', 'enddate', 'scheduler' ],
	_k8450: ['name', 'startdate', 'progress', 'enddate', 'scheduler' ],
	_u184b: ['name', 'startdate', 'progress', 'enddate', 'scheduler' ] };

export const cellTypes = {
	text: <TextCell />,
	color: <ColorCell/>,
	date: <DateCell/>,
};

export const rules = {
  textSize: {
    errorMessage: 'The size of the field must be of at least 10 characters',
    validator: function validateString(text) {
      if (text.replace(/\n/g, '').length > 10) {
        return true;
      }
      return false;
    }
  },
  numberHigher: {
    errorMessage: 'Field must be a number and higher than 25',
    validator: function validateNumberInput(text) {
      if (text > 25) {
        return true;
      }
      return false;
    }
  }
};
