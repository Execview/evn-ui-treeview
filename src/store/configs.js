import React from 'react';
import InputCellEditor from '../InputCellEditor';
import DropdownCellEditor from '../DropdownCellEditor';
import NumberCellEditor from '../NumberCellEditor';
import ColorCellEditor from '../ColorCellEditor';
import ColorCellDisplay from '../ColorCellDisplay';
import DateCellEditor from '../DateCellEditor';
import DateCellDisplay from '../DateCellDisplay';
import InputCellDisplay from '../InputCellDisplay';
import { countries } from './constants';

export const dataConfig = [
  { colName: 'company', cellType: 'text', colTitle: 'Company', rule: 0 },
  { colName: 'contact', cellType: 'text', colTitle: 'Contact' },
  { colName: 'country', cellType: 'dropdown', colTitle: 'Country' },
  { colName: 'value', cellType: 'number', colTitle: 'Value (in $M)', rule: 1 },
  { colName: 'progress', cellType: 'color', colTitle: 'Progress' },
  { colName: 'dueDate', cellType: 'date', colTitle: 'Due Date' }];


export const newData = { _w123: { company: 'McLaren', contact: 'WL', country: 'United Kingdom', value: 26, progress: 'red', dueDate: '2018-03-17T10:39:57.362Z' },
  _1235d: { company: 'Koenigsegg', contact: 'JJ', country: 'Sweden', value: 54, progress: 'amber', dueDate: '2017-08-17T10:39:57.362Z' },
  _m7ad1: { company: 'Porche', contact: 'ZG', country: 'Germany', value: 78, progress: 'green' },
  _917gb: { company: 'Aston Martin', contact: 'JD', country: 'United Kindom', value: 132, progress: 'amber', dueDate: '1996-09-13T10:39:57.362Z' },
  _1236d: { company: 'Lamborghini', contact: 'BB', country: 'Italy', value: 64 },
  _k8450: { company: 'Bugatti', contact: 'DT', country: 'France', progress: 'red', dueDate: '2019-01-17T10:39:57.362Z' },
  _u184b: { company: 'Mercedes-Benz', contact: 'WL', country: 'Germany', progress: 'green' } };

export const cellTypes = {
  text: {
    display: <InputCellDisplay />,
    editor: <InputCellEditor />
  },
  dropdown: {
    display: <InputCellDisplay />,
    editor: <DropdownCellEditor dropdownList={countries} />
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
