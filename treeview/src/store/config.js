import React from 'react';

import { TextCellEditor, TextareaCellDisplay,ColorCellDisplay, ColorCellEditor, DateCellDisplay, DateCellEditor } from '@execview/reusable'

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
// 	_1235d: { activityTitle: 'Project Scorpio', startdate: '2018-12-17T10:39:57.362Z', enddate: '2018-12-23T10:39:57.362Z', progress: 'amber'},
//   	_m7ad1: { activityTitle: 'Project X', startdate: '2018-12-18T10:39:57.362Z', enddate: '2018-12-26T10:39:57.362Z', progress: 'red'},
//   	_917gb: { activityTitle: 'Activity Bravo', startdate: '2018-12-17T10:39:57.362Z', enddate: '2018-12-22T10:39:57.362Z', progress: 'green'},
//   	_1236d: { activityTitle: 'Activity Echo', startdate: '2018-12-21T10:39:57.362Z', enddate: '2018-12-26T10:39:57.362Z', progress: 'green' },
//   	_k8450: { activityTitle: 'Task with a very very very very long name', startdate: '2018-12-18T10:39:57.362Z', enddate: '2018-12-23T10:39:57.362Z', progress: 'red' },
//  	_u184b: { activityTitle: 'Subtask Flower', startdate: '2018-12-18T10:39:57.362Z', enddate: '2018-12-23T10:39:57.362Z', progress: 'amber' }
// }

export const columnsInfo = {
	// treeExpander: {cellType: 'tree', headerData: 'Tree'},
	activityTitle: { cellType: 'text', headerData: 'Activity Title', rule: 'textSize' }, //cant edit activity title without this
	startdate: { cellType: 'date', headerData: 'Start Date'},
	enddate: { cellType: 'date', headerData: 'End Date' },
	progress: { cellType: 'color', headerData: 'RAG' },
	// scheduler: {cellType: 'scheduler', headerData: 'SchedulerHeader goes here', width: 600, headerType: 'schedulerHeader'}
};

export const editableCells = {
	_1235d: ['activityTitle', 'startdate', 'progress', 'enddate'],
	_m7ad1: ['activityTitle', 'startdate', 'progress', 'enddate'],
	_917gb: ['activityTitle', 'startdate', 'progress', 'enddate'],
	_1236d: ['activityTitle', 'startdate', 'progress', 'enddate'],
	_k8450: ['activityTitle', 'startdate', 'progress', 'enddate'],
	_u184b: ['activityTitle', 'startdate', 'progress', 'enddate'] };

export const cellTypes = {
	text: {
		display: <TextareaCellDisplay />,
		editor: <TextCellEditor />
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

export const rules = {
  textSize: {
    errorMessage: 'The size of the field must be of at least 60 characters',
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
