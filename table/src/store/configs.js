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

export const columnsInfo = {
  company: { cellType: 'text', headerData: 'CompanyCompanyCompanyCompanyCompany', rule: 'textSize' },
  contact: { cellType: 'text', headerData: 'Contact', rule: 'textSize' },
  country: { cellType: 'dropdown', headerData: 'Country' },
  dueDate: { cellType: 'date', headerData: 'Due Date' },
  value: { cellType: 'number', headerData: 'Value (in $M)', rule: 'numberHigher' },
  progress: { cellType: 'color', headerData: 'Progress' } };

export const columnsInfo2 = {
  activityId: { cellType: 'text', headerData: 'Activity ID', width: 200 },
  activityTitle: { cellType: 'text', headerData: 'Activity Title', rule: 'textSize', width: 200, headerType: 'dropdown' },
  startDate: { cellType: 'date', headerData: 'Start Date' },
  latestProgress: { cellType: 'text', headerData: 'Latest Progress', width: 300 },
  //employeeName: { cellType: 'dropdown', headerData: 'Employee Name', width: 400 },
  assignedUsers: { cellType: 'users', headerData: 'Assigned Users', width: 70, headerType: 'userHeader' },
  progress: { cellType: 'color', headerData: 'RAG' } };

export const columnsInfo3 = {
  activityId: { cellType: 'text', headerData: 'Activity ID' },
  activityTitle: { cellType: 'text', headerData: 'Activity Title', rule: 'textSize' },
  employeeName: { cellType: 'dropdown', headerData: 'Employee Name' },
  progress: { cellType: 'color', headerData: 'RAG' } };

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

export const newData2 = { _w1232: { activityId: '12425', activityTitle: 'Fix PDF', startDate: '2017-08-17T10:39:57.362Z', latestProgress: 'Fix Chromium', progress: 'green', dueDate: '2018-03-17T10:39:57.362Z', employeeName: '', assignedUsers: [{user: 'abd4', role: 'Project Manager', department: 'Kitten Petter'}, {user: 'gte3' , role: 'Project Manager'}, {user: 'plo4', role: 'Pleb'}] },
  _1235d: { activityId: '1251251', activityTitle: 'Mobile Shipment', startDate: '2017-08-17T10:39:57.362Z', latestProgress: 'The current task is in progress and about to be evaluated', progress: 'amber', dueDate: '2017-08-17T10:39:57.362Z', employeeName: 'Mark', assignedUsers:[{user: 'abd4', role: 'Legendary Consumer'}] },
  _m7ad1: { activityId: '11241', activityTitle: 'Things to Do', startDate: '2017-08-17T10:39:57.362Z', latestProgress: 'In progress', progress: 'red', employeeName: 'Paul', assignedUsers: [{user: 'rew7', role: 'Wizard'}, {user:'gte3' , role: 'Project Manager'} ]},
  _917gb: { activityId: '765976', activityTitle: 'Replace Tire', startDate: '2017-08-17T10:39:57.362Z', latestProgress: 'Done', dueDate: '1996-09-13T10:39:57.362Z', employeeName: 'Agam', assignedUsers: [{user: 'jio9', role: 'Project Manager'}] },
  _1236d: { activityId: '783434', activityTitle: 'ANUYIC', startDate: '2017-08-17T10:39:57.362Z', latestProgress: '', employeeName: 'James', progress: 'green', assignedUsers: [{user:'abd4' , role: 'Peasant'}, {user:'gte3' , role: 'Project Manager'}, {user:'plo4' , role: 'Peasant'}, {user:'rew7' , role: 'Project Manager'}, {user:'jio9' , role: 'Slacker'}] },
  _k8450: { activityId: '12657', activityTitle: 'OAUWDA', startDate: '2017-08-17T10:39:57.362Z', latestProgress: '', dueDate: '2019-01-17T10:39:57.362Z', employeeName: 'Andras', assignedUsers: [], progress: 'red' },
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

const users = {
  abd4: {
    name: 'Jeremy',
    image: 'https://ichef.bbci.co.uk/images/ic/720x405/p0517py6.jpg' },
  gte3: {
    name: 'Samson',
    image: 'https://ae01.alicdn.com/kf/HTB1gfQdb9BYBeNjy0Feq6znmFXaO/2017-30x25CM-The-Scottish-Fold-Cat-Favorites-Diamond-Embroidery-DIY-Creative-Home-Decor-1PCS.jpg_640x640.jpg' },
  plo4: {
    name: 'Mr. Fluff',
    image: 'https://scontent-lht6-1.cdninstagram.com/vp/d6e3da25ed4ed4bee045d960ca30e718/5CC7A39C/t51.2885-15/sh0.08/e35/s750x750/24331625_123946978389083_1346025003761532928_n.jpg?_nc_ht=scontent-lht6-1.cdninstagram.com' },
  rew7: {
    name: 'Tom',
    image: 'https://scontent-lht6-1.cdninstagram.com/vp/54177056e03e5e2217e76ab9eeca557d/5CC2D0A7/t51.2885-15/sh0.08/e35/s640x640/21480286_1888458418148487_1167622992977461248_n.jpg?_nc_ht=scontent-lht6-1.cdninstagram.com' },
  jio9: {
    name: 'Sylvester SylvesterSylvester',
    image: 'https://i.imgur.com/hGiJyW0.jpg' }
};

export const cellTypes = {
  text: {
    display: <InputCellDisplay />,
    editor: <InputCellEditor />
  },
  dropdown: {
    display: <InputCellDisplay />,
    editor: <DropdownCellEditor dropdownList={employees} />
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
