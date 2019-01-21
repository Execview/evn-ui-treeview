import React from 'react';
import InputCellEditor from '../InputCellEditor';
import DropdownCellEditor from '../DropdownCellEditor';
import NumberCellEditor from '../NumberCellEditor';
import ColorCellEditor from '../ColorCellEditor';
import ColorCellDisplay from '../ColorCellDisplay';
import DateCellEditor from '../DateCellEditor';
import DateCellDisplay from '../DateCellDisplay';
// import { countries } from './constants';
import InputCellDisplay from '../InputCellDisplay';

export const dataConfig = [
  { colName: 'company', cellType: 'text', colTitle: 'Company', labelType: 'text', rule: 0 },
  { colName: 'contact', cellType: 'text', colTitle: 'Contact', labelType: 'text' },
  { colName: 'country', cellType: 'dropdown', colTitle: 'Country', labelType: 'text' },
  { colName: 'value', cellType: 'number', colTitle: 'Value (in $M)', labelType: 'text', rule: 1 },
  { colName: 'progress', cellType: 'color', colTitle: 'Progress', labelType: 'color' },
  { colName: 'dueDate', cellType: 'date', colTitle: 'Due Date', labelType: 'date' }];

export const newData = [{ id: 1, company: 'McLaren', contact: 'WL', country: 'United Kingdom', value: 26, progress: 'red', dueDate: '2018-03-17T10:39:57.362Z' },
  { id: 2, company: 'Koenigsegg', contact: 'JJ', country: 'Sweden', value: 54, progress: 'amber', dueDate: '2017-08-17T10:39:57.362Z' },
  { id: 3, company: 'Porche', contact: 'ZG', country: 'Germany', value: 78, progress: 'green' },
  { id: 4, company: 'Aston Martin', contact: 'JD', country: 'United Kindom', value: 132, progress: 'amber', dueDate: '1996-09-13T10:39:57.362Z' },
  { id: 5, company: 'Lamborghini', contact: 'BB', country: 'Italy', value: 64 },
  { id: 6, company: 'Bugatti', contact: 'DT', country: 'France', progress: 'red', dueDate: '2019-01-17T10:39:57.362Z' },
  { id: 7, company: 'Mercedes-Benz', contact: 'WL', country: 'Germany', progress: 'green' }];

export const cellTypes = {
  text: {
    display: <InputCellDisplay />,
    editor: <InputCellEditor />
  },
  dropdown: {
    display: <InputCellDisplay />,
    editor: <DropdownCellEditor />
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
