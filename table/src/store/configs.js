import React from 'react';
import TextareaCellEditor from '../TextareaCell/TextareaCellEditor';
import DropdownCellEditor from '../dropdownCell/DropdownCellEditor';
import TextCellEditor from '../textCell/TextCellEditor';
import ColorCellEditor from '../colorCell/ColorCellEditor';
import ColorCellDisplay from '../colorCell/ColorCellDisplay';
import DateCellEditor from '../dateCell/DateCellEditor';
import DateCellDisplay from '../dateCell/DateCellDisplay';
import TextareaCellDisplay from '../TextareaCell/TextareaCellDisplay';
import UserRoleDisplay from '../UserRoleDisplay/UserRoleDisplay';
import GenericAssignDisplay from '../genericAssignCell/GenericAssignDisplay';
import UserHeaderDisplay from '../headers/UserHeaderDisplay';
import { countries, priority } from './constants';
import ImageDisplay from '../imageDisplay/ImageDisplay';
import GenericMenu from '../genericAssignCell/GenericMenu';
import AddGenericDropdown from '../genericAssignCell/AddGenericDropDown';
import GenericAddedConfirmation from '../genericAssignCell/GenericAddedConfirmation';
import AddExtra from '../genericAssignCell/AddExtraGeneric';


export const columnsInfo1 = {
	images: { cellType: 'images', headerData: 'Images', width: 4 },
	company: { cellType: 'textarea', headerData: 'CompanyCompanyCompanyCompanyCompany', rule: 'textSize' },
	contact: { cellType: 'textarea', headerData: 'Contact', rule: 'textSize' },
	country: { cellType: 'dropdown', headerData: 'Country' },
	dueDate: { cellType: 'date', headerData: 'Due Date' },
	value: { cellType: 'number', headerData: 'Value (in $M)', rule: 'numberHigher' },
	progress: { cellType: 'color', headerData: 'Progress' }
};

export const columnsInfo2 = {
	activityId: { cellType: 'textarea', headerData: 'Activity ID', width: 5, minWidth: 25 },
	startDate: { cellType: 'date', headerData: 'Start Date', width: 10 },
	dueDate: { cellType: 'date', headerData: 'Due Date', width: 10 },
	assignedUsers: { cellType: 'users', headerData: 'Assigned Users', width: 10, headerType: 'userHeader' },
	progress: { cellType: 'color', headerData: 'RAG', width: 10, minWidth: 25 },
	latestProgress: { cellType: 'textarea', headerData: 'Latest Progress' }
	// employeeName: { cellType: 'dropdown', headerData: 'Employee Name', width: 400 },
};

export const columnsInfo3 = {
	activityId: { cellType: 'textarea', headerData: 'Activity ID', width: 5, minWidth: 25 },
	startDate: { cellType: 'date', headerData: 'Start Date', width: 10 },
	dueDate: { cellType: 'date', headerData: 'Due Date', width: 10 },
	assignedGeneric: { cellType: 'genericAdder', headerData: 'Assigned Generic', width: 10, headerType: 'userHeader' },
	progress: { cellType: 'color', headerData: 'RAG', width: 10, minWidth: 25 },
	latestProgress: { cellType: 'textarea', headerData: 'Latest Progress' }
	// employeeName: { cellType: 'dropdown', headerData: 'Employee Name', width: 400 },
};

export const editableCells1 = {
	_w1232: ['company', 'contact', 'country', 'value', 'progress', 'dueDate'],
	_1235d: ['company', 'contact', 'country', 'value', 'progress', 'dueDate'],
	_m7ad1: ['company', 'contact', 'country', 'value', 'progress', 'dueDate'],
	_917gb: ['company', 'contact', 'country', 'value', 'progress', 'dueDate'],
	_1236d: ['company', 'contact', 'country', 'value', 'progress', 'dueDate'],
	_k8450: ['company', 'contact', 'country', 'value', 'progress', 'dueDate'],
	_u184b: ['company', 'contact', 'country', 'value', 'progress', 'dueDate']
};

export const editableCells2 = {
	_1: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
	_2: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
	_3: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
	_4: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
	_5: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
	_6: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
	_7: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName']
};

export const editableCells3 = {
	_1: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
	_2: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
	_3: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
	_4: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
	_5: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
	_6: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName'],
	_7: ['activityId', 'activityTitle', 'startDate', 'latestProgress', 'progress', 'dueDate', 'employeeName']
};


export const newData1 = {
	_w1232: { company: 'McLaren', contact: 'WL', country: 'United Kingdom', value: 26, progress: 'red', dueDate: '2018-03-17T10:39:57.362Z', images: ['https://upload.wikimedia.org/wikipedia/commons/c/c1/Mclaren_logo.jpg', 'https://www.supercars.net/blog/wp-content/uploads/2016/03/Screenshot-2016-03-24-12.48.38.png'] },
	_1235d: { company: 'Koenigsegg', contact: 'JJ', country: 'Sweden', value: 54, progress: 'amber', dueDate: '2017-08-17T10:39:57.362Z', images: ['https://fsa.zobj.net/crop.php?r=NLYiH-gLk0ZjeMxIBRcaC1knnxFlUJeM5ibM_-HgZVY0zWN3_50DxVgAS7-Zlfbwsd3Aw5han1TZbQEki6F_FzTTopRZsUDyTMsynwkA36kIMiyVnBNkyt2spNAOg5gUVP4TjHNTbzqzjY4A_OZ3mSl-D7s5hgAYfYu1Pb9PGhjAb6AtIwrzR8MtVQQ'] },
	_m7ad1: { company: 'Porche', contact: 'ZG', country: 'Germany', value: 78, progress: 'green', images: ['https://render.fineartamerica.com/images/rendered/default/poster/8/10/break/images/artworkimages/medium/1/19-porsche-logo-porsche-logo.jpg'] },
	_917gb: { company: 'Aston Martin', contact: 'JD', country: 'United Kingdom', value: 132, progress: 'amber', dueDate: '1996-09-13T10:39:57.362Z', images: ['https://upload.wikimedia.org/wikipedia/en/2/2c/Aston_Martin_Logo_2018.png'] },
	_1236d: { company: 'Lamborghini', contact: 'BB', country: 'Italy', value: 64, images: ['https://upload.wikimedia.org/wikipedia/en/d/df/Lamborghini_Logo.svg', 'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/model/huracan/evo-slider/model/Huracan%20Spyder_scontorno.png'] },
	_k8450: { company: 'Bugatti', contact: 'DT', country: 'France', progress: 'red', dueDate: '2019-01-17T10:39:57.362Z', images: ['https://3dexport.com/items/2011/07/05/74832/37701/bugatti_logo_3d_model_c4d_max_obj_fbx_ma_lwo_3ds_3dm_stl_247998.jpg'] },
	_u184b: { company: 'Mercedes-Benz', contact: 'WL', country: 'Germany', progress: 'green', images: ['https://i.ebayimg.com/images/g/J9sAAOSwol5Y17RS/s-l300.jpg'] }
};

export const newData2 = {
	_1: { activityId: '12425', activityTitle: 'Fix PDF', startDate: '2017-08-17T10:39:57.362Z', latestProgress: 'Fix Chromium', progress: 'green', dueDate: '2018-03-17T10:39:57.362Z', employeeName: '', assignedUsers: [{ user: 'abd4', role: 'Project Manager', department: 'Kitten Petter' }, { user: 'gte3', role: 'Project Manager' }, { user: 'plo4', role: 'Pleb' }] },
	_2: { activityId: '1251251', activityTitle: 'Mobile Shipment', startDate: '2017-08-17T10:39:57.362Z', latestProgress: 'The current task is in progress and about to be evaluated', progress: 'amber', dueDate: '2017-08-17T10:39:57.362Z', employeeName: 'Mark', assignedUsers: [{ user: 'abd4', role: 'Legendary Consumer' }] },
	_3: { activityId: '11241', activityTitle: 'Things to Do', startDate: '2017-08-17T10:39:57.362Z', latestProgress: 'In progress', progress: 'red', employeeName: 'Paul', assignedUsers: [{ user: 'rew7', role: 'Wizard' }, { user: 'gte3', role: 'Project Manager' }] },
	_4: { activityId: '765976', activityTitle: 'Replace Tire', startDate: '2017-08-17T10:39:57.362Z', latestProgress: 'Done', dueDate: '1996-09-13T10:39:57.362Z', employeeName: 'Agam', assignedUsers: [{ user: 'jio9', role: 'Project Manager' }] },
	_5: { activityId: '783434', activityTitle: 'ANUYIC', startDate: '2017-08-17T10:39:57.362Z', latestProgress: '', employeeName: 'James', progress: 'green', assignedUsers: [{ user: 'abd4', role: 'Peasant' }, { user: 'gte3', role: 'Project Manager' }, { user: 'plo4', role: 'Peasant' }, { user: 'rew7', role: 'Project Manager' }, { user: 'jio9', role: 'Slacker' }] },
	_6: { activityId: '12657', activityTitle: 'OAUWDA', startDate: '2017-08-17T10:39:57.362Z', latestProgress: '', dueDate: '2019-01-17T10:39:57.362Z', employeeName: 'Andras', assignedUsers: [], progress: 'red' },
	_7: { activityId: '612422', activityTitle: 'AWDIA', startDate: '2017-08-17T10:39:57.362Z', latestProgress: '', employeeName: 'Salman', progress: 'amber' }
};

export const newData3 = {
	_1: { activityId: '12425', activityTitle: 'Fix PDF', startDate: '2017-08-17T10:39:57.362Z', latestProgress: 'Fix Chromium', progress: 'green', dueDate: '2018-03-17T10:39:57.362Z', employeeName: '', assignedGeneric: ['abd4', 'gte3', 'plo4'] },
	_2: { activityId: '1251251', activityTitle: 'Mobile Shipment', startDate: '2017-08-17T10:39:57.362Z', latestProgress: 'The current task is in progress and about to be evaluated', progress: 'amber', dueDate: '2017-08-17T10:39:57.362Z', employeeName: 'Mark' },
	_3: { activityId: '11241', activityTitle: 'Things to Do', startDate: '2017-08-17T10:39:57.362Z', latestProgress: 'In progress', progress: 'red', employeeName: 'Paul' },
	_4: { activityId: '765976', activityTitle: 'Replace Tire', startDate: '2017-08-17T10:39:57.362Z', latestProgress: 'Done', dueDate: '1996-09-13T10:39:57.362Z', employeeName: 'Agam', assignedGeneric: ['abd4'] },
	_5: { activityId: '783434', activityTitle: 'ANUYIC', startDate: '2017-08-17T10:39:57.362Z', latestProgress: '', employeeName: 'James', progress: 'green' },
	_6: { activityId: '12657', activityTitle: 'OAUWDA', startDate: '2017-08-17T10:39:57.362Z', latestProgress: '', dueDate: '2019-01-17T10:39:57.362Z', employeeName: 'Andras', assignedGeneric: [], progress: 'red' },
	_7: { activityId: '612422', activityTitle: 'AWDIA', startDate: '2017-08-17T10:39:57.362Z', latestProgress: '', employeeName: 'Salman', progress: 'amber' }
};

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
		image: 'https://i.imgur.com/6YXGVoz.jpg',
		role: 'good lad'
	},
	gte3: {
		name: 'Samson',
		image: 'https://ae01.alicdn.com/kf/HTB1gfQdb9BYBeNjy0Feq6znmFXaO/2017-30x25CM-The-Scottish-Fold-Cat-Favorites-Diamond-Embroidery-DIY-Creative-Home-Decor-1PCS.jpg_640x640.jpg'
	},
	plo4: {
		name: 'Mr. Fluff',
		image: 'https://i.imgur.com/UDrEtib.jpg'
	},
	rew7: {
		name: 'Tom',
		image: 'https://i.imgur.com/upG3jXQ.jpg'
	},
	jio9: {
		name: 'Sylvester SylvesterSylvester',
		image: 'https://i.imgur.com/hGiJyW0.jpg'
	},
	ahwyd: {
		name: 'Billy',
		image: 'https://i.imgur.com/V7hvM91.jpg'
	},
	hawyd: {
		name: 'Billy&Lucky',
		image: 'https://i.imgur.com/gQo8FSe.jpg'
	}
};

//GenericAssignDisplay props
const ImageDisplayWrapperForAssign = (props) => {
	const items = props.items || [];
	const imageDisplayData = props.allItems && (items.map(u =>props.allItems[u].image) || []);
	return <ImageDisplay data={imageDisplayData} style={props.style} />;
};

const display = <ImageDisplayWrapperForAssign />;
const page1 = <GenericMenu />;
const page2 = <AddGenericDropdown />;
const page3 = <GenericAddedConfirmation />;
const page4 = <AddExtra />;


export const cellTypes = {
	textarea: {
		display: <TextareaCellDisplay />,
		editor: <TextareaCellEditor />
	},
	dropdown: {
		display: <TextareaCellDisplay />,
		editor: <DropdownCellEditor dropdownList={countries} />
	},
	users: {
		display: <UserRoleDisplay userProfiles={users} />,
	},
	genericAdder: {
		display: <GenericAssignDisplay display={display} page1={page1} page2={page2} page3={page3} page4={page4} items={users} />,
	},
	text: {
		display: <TextareaCellDisplay />,
		editor: <TextCellEditor />
	},
	number: {
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
	userHeader: {
		display: <UserHeaderDisplay />
	},
	images: {
		display: <ImageDisplay />
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
	textarea: defaultSort,
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
