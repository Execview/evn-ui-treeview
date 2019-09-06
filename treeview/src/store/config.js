import React from 'react';

import { TextCell, ColorCell, DateCell } from '@execview/table'

import Data from './configData.json'

export const data = Data

export const columnsInfo = {
	name: { cellType: 'text', headerData: 'Activity Title', rule: 'textSize' }, //cant edit activity title without this
	startdate: { cellType: 'date', headerData: 'Start Date'},
	enddate: { cellType: 'date', headerData: 'End Date' },
	progress: { cellType: 'color', headerData: 'RAG' },
};

export const editableCells = {
	_1235d: ['name', 'startdate', 'progress'],
	_m7ad1: ['name', 'startdate', 'progress', 'enddate', 'scheduler' ],
	_917gb: ['name', 'progress', 'enddate'],
	_1236d: ['name', 'startdate', 'progress', 'enddate', 'scheduler' ],
	_k8450: ['name', 'startdate', 'progress', 'enddate', 'scheduler' ],
	_u184b: ['name', 'startdate', 'progress', 'enddate', 'scheduler' ],
	tempInvertedBubble: ['name', 'startdate', 'progress', 'enddate', 'scheduler' ],
	tempRhombus: ['name', 'startdate', 'progress', 'enddate', 'scheduler' ],
	tempFirecracker: ['name', 'startdate', 'progress', 'enddate', 'scheduler' ]
};

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
