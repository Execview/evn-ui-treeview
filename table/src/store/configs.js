import React from 'react';
import InputCellEditor from '../InputCellEditor';
import DropdownCellEditor from '../DropdownCellEditor';
import NumberCellEditor from '../NumberCellEditor';
import ColorCellEditor from '../ColorCellEditor';
import ColorCellDisplay from '../ColorCellDisplay';
import DateCellEditor from '../DateCellEditor';
import DateCellDisplay from '../DateCellDisplay';
import InputCellDisplay from '../InputCellDisplay';
import { countries, priority } from './constants';

export const columnsInfo = {
  company: { cellType: 'text', colTitle: 'CompanyCompanyCompanyCompanyCompany', rule: 'textSize' },
  contact: { cellType: 'text', colTitle: 'Contact', rule: 'textSize' },
  country: { cellType: 'dropdown', colTitle: 'Country' },
  dueDate: { cellType: 'date', colTitle: 'Due Date' },
  value: { cellType: 'number', colTitle: 'Value (in $M)', rule: 'numberHigher' },
  progress: { cellType: 'color', colTitle: 'Progress' } };

export const columnsInfo2 = {
  activityId: { cellType: 'text', colTitle: 'Activity ID' },
  activityTitle: { cellType: 'text', colTitle: 'Activity Title', rule: 'textSize' },
  startDate: { cellType: 'date', colTitle: 'Start Date' },
  latestProgress: { cellType: 'text', colTitle: 'Latest Progress' },
  employeeName: { cellType: 'dropdown', colTitle: 'Employee Name' },
  progress: { cellType: 'color', colTitle: 'RAG' } };

export const columnsInfo3 = {
  activityId: { cellType: 'text', colTitle: 'Activity ID' },
  activityTitle: { cellType: 'text', colTitle: 'Activity Title', rule: 'textSize' },
  employeeName: { cellType: 'dropdown', colTitle: 'Employee Name' },
  progress: { cellType: 'color', colTitle: 'RAG' } };

export const editableCells = {
  _w1232: ['company', 'contact', 'country', 'value', 'progress', 'dueDate'],
  _1235d: ['company', 'contact', 'country', 'value', 'progress', 'dueDate'],
  _m7ad1: ['company', 'contact', 'country', 'value', 'progress', 'dueDate'],
  _917gb: ['company', 'contact', 'country', 'value', 'progress', 'dueDate'],
  _1236d: ['company', 'contact', 'country', 'value', 'progress', 'dueDate'],
  _k8450: ['company', 'contact', 'country', 'value', 'progress', 'dueDate'],
  _u184b: ['company', 'contact', 'country', 'value', 'progress', 'dueDate'] };

export const editableCells2 = {
  _m7ad1: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
  _917gb: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
  _1236d: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
  _k8450: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
  _u184b: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'] };


export const newData = { _w1232: { company: 'McLaren', contact: 'WL', country: 'United Kingdom', value: 26, progress: 'red', dueDate: '2018-03-17T10:39:57.362Z' },
  _1235d: { company: 'Koenigsegg', contact: 'JJ', country: 'Sweden', value: 54, progress: 'amber', dueDate: '2017-08-17T10:39:57.362Z' },
  _m7ad1: { company: 'Porche', contact: 'ZG', country: 'Germany', value: 78, progress: 'green' },
  _917gb: { company: 'Aston Martin', contact: 'JD', country: 'United Kingdom', value: 132, progress: 'amber', dueDate: '1996-09-13T10:39:57.362Z' },
  _1236d: { company: 'Lamborghini', contact: 'BB', country: 'Italy', value: 64 },
  _k8450: { company: 'Bugatti', contact: 'DT', country: 'France', progress: 'red', dueDate: '2019-01-17T10:39:57.362Z' },
  _u184b: { company: 'Mercedes-Benz', contact: 'WL', country: 'Germany', progress: 'green' } };

export const newData2 = { _w1232: { activityId: '12425', activityTitle: 'Fix PDF', startDate: '2017-08-17T10:39:57.362Z', latestProgress: 'Fix Chromium', progress: 'green', dueDate: '2018-03-17T10:39:57.362Z', employeeName: 'Andrei' },
  _1235d: { activityId: '1251251', activityTitle: 'Mobile Shipment', startDate: '2017-08-17T10:39:57.362Z', latestProgress: 'The current task is in progress and about to be evaluated', progress: 'amber', dueDate: '2017-08-17T10:39:57.362Z', employeeName: 'Mark' },
  _m7ad1: { activityId: '11241', activityTitle: 'Things to Do', startDate: '2017-08-17T10:39:57.362Z', latestProgress: 'In progress', progress: 'red', employeeName: 'Paul' },
  _917gb: { activityId: '765976', activityTitle: 'Replace Tire', startDate: '2017-08-17T10:39:57.362Z', latestProgress: 'Done', dueDate: '1996-09-13T10:39:57.362Z', employeeName: 'Agam' },
  _1236d: { activityId: '783434', activityTitle: 'ANUYIC', startDate: '2017-08-17T10:39:57.362Z', latestProgress: '', employeeName: 'James', progress: 'green' },
  _k8450: { activityId: '12657', activityTitle: 'OAUWDA', startDate: '2017-08-17T10:39:57.362Z', latestProgress: '', dueDate: '2019-01-17T10:39:57.362Z', employeeName: 'Andras', progress: 'red' },
  _u184b: { activityId: '612422', activityTitle: 'AWDIA', startDate: '2017-08-17T10:39:57.362Z', latestProgress: '', employeeName: 'Salman', progress: 'amber' } };

const crypto = require('crypto');

const hash = crypto.createHash('sha256');

const testData = {};
for (let i = 0; i < 200; i++) {
  const newId = '_' + hash.update(Date.now() + Math.random().toString()).digest('hex').substring(0, 5);
  testData[newId] = { company: 'McLaren', contact: 'WL', country: 'United Kingdom', value: 26, progress: 'green', dueDate: '2018-03-17T10:39:57.362Z' };
  // editableCells[newId] = { company: true, contact: true, country: true, value: true, progress: true, dueDate: true };
}

export { testData };

const employees = ['Andrei', 'Andras', 'Agam', 'Salman', 'James', 'Mark', 'Claire'];

export const cellTypes = {
  text: {
    display: <InputCellDisplay />,
    editor: <InputCellEditor />
  },
  dropdown: {
    display: <InputCellDisplay />,
    editor: <DropdownCellEditor dropdownList={employees} />
  },
  number: {
    display: <InputCellDisplay />,
    editor: <NumberCellEditor />
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
      if (text.replace(/\n/g, '').length > 60) {
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

const defaultSort = (a, b) => {
  const x = a ? a.toLowerCase() : '';
  const y = b ? b.toLowerCase() : '';
  return (x > y) ? -1 : ((x < y) ? 1 : 0);
};

export const dataSort = {
  text: defaultSort,
  dropdown: defaultSort,
  date: defaultSort,
  number: (a, b) => {
    const x = a || 0;
    const y = b || 0;
    return (parseFloat(x) > parseFloat(y)) ? -1 : ((parseFloat(x) < parseFloat(y)) ? 1 : 0);
  },
  color: (a, b) => {
    const x = priority[a] || 0;
    const y = priority[b] || 0;
    return (x > y) ? -1 : ((x < y) ? 1 : 0);
  }
};

export function rowValidation(row, editableRow) {
  let editCells = [...editableRow];
  const newRow = { ...row };
  if (row.latestProgress === '') {
    editCells = editCells.filter(el => el !== 'progress');
    newRow.progress = 'red';
  } else {
    editCells.indexOf('progress') === -1 ? editCells.push('progress') : console.log('item already exists');
  }
  return { updatedRow: newRow, editableRow: editCells };
}