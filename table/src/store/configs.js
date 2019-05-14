import React from 'react';
import InputCellEditor from '../inputCell/InputCellEditor';
import DropdownCellEditor from '../dropdownCell/DropdownCellEditor';
import NumberCellEditor from '../numberCell/NumberCellEditor';
import ColorCellEditor from '../colorCell/ColorCellEditor';
import ColorCellDisplay from '../colorCell/ColorCellDisplay';
import DateCellEditor from '../dateCell/DateCellEditor';
import DateCellDisplay from '../dateCell/DateCellDisplay';
import InputCellDisplay from '../inputCell/InputCellDisplay';
import CircleUserDisplay from '../CircleUser/CircleUserDisplay';
import UserHeaderDisplay from '../headers/UserHeaderDisplay';
import { countries, priority } from './constants';


export const columnsInfo1 = {
  company: { cellType: 'text', headerData: 'CompanyCompanyCompanyCompanyCompany', rule: 'textSize' },
  contact: { cellType: 'text', headerData: 'Contact', rule: 'textSize' },
  country: { cellType: 'dropdown', headerData: 'Country' },
  dueDate: { cellType: 'date', headerData: 'Due Date' },
  value: { cellType: 'number', headerData: 'Value (in $M)', rule: 'numberHigher' },
  progress: { cellType: 'color', headerData: 'Progress' } };

export const columnsInfo2 = {
  activityId: { cellType: 'text', headerData: 'Activity ID', width: 5, minWidth: 25 },
  startDate: { cellType: 'date', headerData: 'Start Date', width: 10 },
  dueDate: { cellType: 'date', headerData: 'Due Date', width: 10 },
  assignedUsers: { cellType: 'users', headerData: 'Assigned Users', width: 10, headerType: 'userHeader' },
  progress: { cellType: 'color', headerData: 'RAG', width: 10, minWidth: 25 },
  latestProgress: { cellType: 'text', headerData: 'Latest Progress' }
  // employeeName: { cellType: 'dropdown', headerData: 'Employee Name', width: 400 },
};

export const columnsInfo3 = {
  activityId: { cellType: 'text', headerData: 'Activity ID' },
  activityTitle: { cellType: 'text', headerData: 'Activity Title', rule: 'textSize' },
  employeeName: { cellType: 'dropdown', headerData: 'Employee Name' },
  progress: { cellType: 'color', headerData: 'RAG' } };

export const editableCells1 = {
  _w1232: ['company', 'contact', 'country', 'value', 'progress', 'dueDate'],
  _1235d: ['company', 'contact', 'country', 'value', 'progress', 'dueDate'],
  _m7ad1: ['company', 'contact', 'country', 'value', 'progress', 'dueDate'],
  _917gb: ['company', 'contact', 'country', 'value', 'progress', 'dueDate'],
  _1236d: ['company', 'contact', 'country', 'value', 'progress', 'dueDate'],
  _k8450: ['company', 'contact', 'country', 'value', 'progress', 'dueDate'],
  _u184b: ['company', 'contact', 'country', 'value', 'progress', 'dueDate'] };

export const editableCells2 = {
  _1: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
  _2: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
  _3: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
  _4: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
  _5: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
  _6: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
  _7: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'] };


export const newData1 = { _w1232: { company: 'McLaren', contact: 'WL', country: 'United Kingdom', value: 26, progress: 'red', dueDate: '2018-03-17T10:39:57.362Z' },
  _1235d: { company: 'Koenigsegg', contact: 'JJ', country: 'Sweden', value: 54, progress: 'amber', dueDate: '2017-08-17T10:39:57.362Z' },
  _m7ad1: { company: 'Porche', contact: 'ZG', country: 'Germany', value: 78, progress: 'green' },
  _917gb: { company: 'Aston Martin', contact: 'JD', country: 'United Kingdom', value: 132, progress: 'amber', dueDate: '1996-09-13T10:39:57.362Z' },
  _1236d: { company: 'Lamborghini', contact: 'BB', country: 'Italy', value: 64 },
  _k8450: { company: 'Bugatti', contact: 'DT', country: 'France', progress: 'red', dueDate: '2019-01-17T10:39:57.362Z' },
  _u184b: { company: 'Mercedes-Benz', contact: 'WL', country: 'Germany', progress: 'green' } };

export const newData2 = { _1: { activityId: '12425', activityTitle: 'Fix PDF', startDate: '2017-08-17T10:39:57.362Z', latestProgress: 'Fix Chromium', progress: 'green', dueDate: '2018-03-17T10:39:57.362Z', employeeName: '', assignedUsers: [{ user: 'abd4', role: 'Project Manager', department: 'Kitten Petter' }, { user: 'gte3', role: 'Project Manager' }, { user: 'plo4', role: 'Pleb' }] },
  _2: { activityId: '1251251', activityTitle: 'Mobile Shipment', startDate: '2017-08-17T10:39:57.362Z', latestProgress: 'The current task is in progress and about to be evaluated', progress: 'amber', dueDate: '2017-08-17T10:39:57.362Z', employeeName: 'Mark', assignedUsers: [{ user: 'abd4', role: 'Legendary Consumer' }] },
  _3: { activityId: '11241', activityTitle: 'Things to Do', startDate: '2017-08-17T10:39:57.362Z', latestProgress: 'In progress', progress: 'red', employeeName: 'Paul', assignedUsers: [{ user: 'rew7', role: 'Wizard' }, { user: 'gte3', role: 'Project Manager' }] },
  _4: { activityId: '765976', activityTitle: 'Replace Tire', startDate: '2017-08-17T10:39:57.362Z', latestProgress: 'Done', dueDate: '1996-09-13T10:39:57.362Z', employeeName: 'Agam', assignedUsers: [{ user: 'jio9', role: 'Project Manager' }] },
  _5: { activityId: '783434', activityTitle: 'ANUYIC', startDate: '2017-08-17T10:39:57.362Z', latestProgress: '', employeeName: 'James', progress: 'green', assignedUsers: [{ user: 'abd4', role: 'Peasant' }, { user: 'gte3', role: 'Project Manager' }, { user: 'plo4', role: 'Peasant' }, { user: 'rew7', role: 'Project Manager' }, { user: 'jio9', role: 'Slacker' }] },
  _6: { activityId: '12657', activityTitle: 'OAUWDA', startDate: '2017-08-17T10:39:57.362Z', latestProgress: '', dueDate: '2019-01-17T10:39:57.362Z', employeeName: 'Andras', assignedUsers: [], progress: 'red' },
  _7: { activityId: '612422', activityTitle: 'AWDIA', startDate: '2017-08-17T10:39:57.362Z', latestProgress: '', employeeName: 'Salman', progress: 'amber' } };

const crypto = require('crypto');

const hash = crypto.createHash('sha256');


const testData = {};
const testEditableCells = {};
for (let i = 0; i < 120; i++) {
  const newId = '_' + hash.update(Date.now() + Math.random().toString()).digest('hex').substring(0, 5);
  testData[newId] = { company: 'McLaren', contact: 'WL', country: 'United Kingdom', value: 26, progress: 'green', dueDate: '2018-03-17T10:39:57.362Z' };
  testEditableCells[newId] = ['company', 'contact', 'country', 'value', 'progress', 'dueDate'];
}
export { testData, testEditableCells };

const employees = ['Andrei', 'Andras', 'Agam', 'Salman', 'James', 'Mark', 'Claire'];

const users = {
  abd4: {
    name: 'Jeremy',
    image: 'https://i.imgur.com/6YXGVoz.jpg' },
  gte3: {
    name: 'Samson',
    image: 'https://ae01.alicdn.com/kf/HTB1gfQdb9BYBeNjy0Feq6znmFXaO/2017-30x25CM-The-Scottish-Fold-Cat-Favorites-Diamond-Embroidery-DIY-Creative-Home-Decor-1PCS.jpg_640x640.jpg' },
  plo4: {
    name: 'Mr. Fluff',
    image: 'https://i.imgur.com/UDrEtib.jpg' },
  rew7: {
    name: 'Tom',
    image: 'https://i.imgur.com/upG3jXQ.jpg' },
  jio9: {
    name: 'Sylvester SylvesterSylvester',
    image: 'https://i.imgur.com/hGiJyW0.jpg' },
  ahwyd: {
    name: 'Billy',
    image: 'https://i.imgur.com/V7hvM91.jpg'
  },
  hawyd: {
    name: 'Billy&Lucky',
    image: 'https://i.imgur.com/gQo8FSe.jpg'
  }
};

export const cellTypes = {
  text: {
    display: <InputCellDisplay />,
    editor: <InputCellEditor />
  },
  dropdown: {
    display: <InputCellDisplay />,
    editor: <DropdownCellEditor dropdownList={countries} />
  },
  users: {
    display: <CircleUserDisplay userProfiles={users} />,
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
  userHeader: {
    display: <UserHeaderDisplay />
  }
};

export const rules = {
  textSize: {
    errorMessage: 'The size of the field must be of at least 10 characters',
    validator: function validateString(text) {
      if (text.replace(/\n/g, '').length >= 10) {
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
  } else if (editCells.indexOf('progress') === -1) {
    editCells.push('progress');
  }
  return { updatedRow: newRow, editableRow: editCells };
}
