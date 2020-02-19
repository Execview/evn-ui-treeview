import React from 'react';
import { TripleFill, CircleUser } from '@execview/reusable';
import DropdownCell from '../cells/DropdownCell/DropdownCell';
import ImageDisplay from '../cells/ImageDisplay/ImageDisplay';
import GenericAssignCell from '../cells/GenericAssignCell/GenericAssignCell';
import ColorCell from '../cells/ColorCell/ColorCell';
import ColorFilter, {filter as ColorFilterFunction} from '../cells/ColorCell/ColorFilter';
import DateCell from '../cells/DateCell/DateCell';
import DateFilter, {filter as DateFilterFunction} from '../cells/DateCell/DateFilter'
import TextCell from '../cells/TextCell/TextCell'
import TextFilter, {filter as TextFilterFunction} from '../cells/TextCell/TextFilter'

import UserRoleDisplay from '../UserRoleDisplay/UserRoleDisplay';
import UserHeader from '../headers/UserHeader/UserHeader';
import { countries, progressValues } from './constants';
import classes from '../App.module.css';


//#region  GenericAssignDisplay props
const allItems = users;
const Display = (props) => {
	const items = props.items || [];
	const imageDisplayData = items.map(u => users[u].image);
	return <ImageDisplay data={imageDisplayData} style={props.style} isEditable={props.isEditable} placeholder={'Assign a user...'}/>;
};
const getSearchField = (id) => {
	return allItems[id].name;
};

const getOption = (id) => {
	return (
		<div className="user-row">
			<TripleFill
				style={{ height: '40px', cursor: 'pointer' }}
				left={<CircleUser url={allItems[id].image} />}
				center={<p className={classes["tripleFill-user-name"]}>{allItems[id].name}</p>}
			/>
		</div>
	);
};

const leftTitle = <p className={classes["dropdown-title"]}>Assigned Users</p>;
const rightTitle = <p className={classes["dropdown-title"]}>Available Users</p>;

//#endregion

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
		name: 'Sylvester SylvesterSylvesterSylvesterSylvester',
		image: 'https://i.imgur.com/hGiJyW0.jpg'
	},
	ahwyd: {
		name: 'Billy',
		image: 'https://i.imgur.com/V7hvM91.jpg'
	},
	hawyd: {
		name: 'Billy&Lucky',
		image: 'https://i.imgur.com/gQo8FSe.jpg'
	},
	awdaww: {
		name: 'Tom',
		image: 'https://i.imgur.com/upG3jXQ.jpg'
	},
	ncncnc: {
		name: 'Tom',
		image: 'https://i.imgur.com/upG3jXQ.jpg'
	},
	papapap: {
		name: 'Tom',
		image: 'https://i.imgur.com/upG3jXQ.jpg'
	},
	wowowo: {
		name: 'Tom',
		image: 'https://i.imgur.com/upG3jXQ.jpg'
	},
	ldldldl: {
		name: 'Tom',
		image: 'https://i.imgur.com/upG3jXQ.jpg'
	},

};

export const cellTypes = {
	text: <TextCell />,
	textarea: <TextCell wrap={true} />,
	number: <TextCell />,
	dropdown: <DropdownCell options={countries} canSearch={true} inline={true} />,
	users: <UserRoleDisplay userProfiles={users} />,
	genericAdder: <GenericAssignCell display={<Display />} getOption={getOption} getSearchField={getSearchField} items={Object.keys(users)} leftTitle={leftTitle} rightTitle={rightTitle} />,
	color: <ColorCell colorStrings={progressValues} inline={true}/>,
	date: <DateCell />,
	images: <ImageDisplay />
};

export const columnsInfo1 = {
	images: { cellType: cellTypes['images'], headerType: <ImageDisplay data={['https://i.imgur.com/w2pv5Ux.png']} />, width: 4 },
	company: { cellType: cellTypes['text'], headerType: 'CompanyCompanyCompanyCompanyCompany', rule: 'textSize' },
	contact: { cellType: cellTypes['text'], headerType: 'Contact', rule: 'textSize' },
	country: { cellType: cellTypes['dropdown'], headerType: 'Country' },
	dueDate: { cellType: cellTypes['date'], headerType: 'Due Date' },
	value: { cellType: cellTypes['number'], headerType: 'Value (in $M)', rule: 'numberHigher' },
	progress: { cellType: cellTypes['color'], headerType: 'Progress' }
};

export const columnsInfo2 = {
	activityId: { cellType: cellTypes['text'], headerType: 'Activity ID', width: 5, minWidth: 45, rule: 'textSize', filter:<TextFilter filterProperties={['activityId']}  text={{placeholder: 'Search for ID...'}}/>, filterFunction: TextFilterFunction},
	startDate: { cellType: cellTypes['date'], headerType: 'Start Date', width: 10, rule: 'dateExists', filter: <DateFilter filterProperties={['startDate']}/>, filterFunction: DateFilterFunction  },
	latestProgress: { cellType: cellTypes['textarea'], headerType: 'Latest Progress', rule: 'textSize', filter: <TextFilter filterProperties={['latestProgress']}/>, filterFunction: TextFilterFunction},
	dueDate: { cellType: cellTypes['date'], headerType: 'Due Date', width: 10, filter: <DateFilter filterProperties={['dueDate']}/>, filterFunction: DateFilterFunction },
	progress: { cellType: cellTypes['color'], headerType: 'RAG', width: 10, minWidth: 45, filter: <ColorFilter colorStrings={progressValues} filterProperties={['progress']}/>, filterFunction: ColorFilterFunction  },
	assignedUsers: { cellType: cellTypes['users'], headerType: 'Assigned Users', width: 10, headerType: <UserHeader/> },
};

export const columnsInfo3 = {
	activityId: { cellType: cellTypes['text'], headerType: 'Activity ID', width: 5, minWidth: 25 },
	startDate: { cellType: cellTypes['date'], headerType: 'Start Date', width: 10 },
	dueDate: { cellType: cellTypes['date'], headerType: 'Due Date', width: 10 },
	assignedGeneric: { cellType: cellTypes['genericAdder'], headerType: 'Assigned Generic', width: 10, headerType: <UserHeader/>, height: 40 },
	// latestProgress: { cellType: cellTypes['textarea'], headerType: 'Latest Progress' }
	// employeeName: { cellType: cellTypes['dropdown'], headerType: 'Employee Name', width: 400 },
};

export const permissions1 = {
	editableRows: [
		'_w1232','_1235d','_m7ad1','_917gb','_1236d','_k8450','_u184b'
	]
};

export const permissions2 = {
	editableRows: [
		'_1','_2','_4','_5'
	],
	exceptions: [
		{row: '_2', col: 'start'},
		{row: '_4', col: 'start'},
	]
};

export const permissions3 = {
	editableRows: [
		'_1','_2','_3','_4','_5','_6','_7'
	]
};

export const newData1 = {
	_w1232: { company: 'McLaren', contact: 'WL', country: 'United Kingdom', value: 26, progress: 'red', dueDate: new Date('2018-03-17T10:39:57.362Z'), images: ['https://upload.wikimedia.org/wikipedia/commons/c/c1/Mclaren_logo.jpg', 'https://www.supercars.net/blog/wp-content/uploads/2016/03/Screenshot-2016-03-24-12.48.38.png'] },
	_1235d: { company: 'Koenigsegg', contact: 'JJ', country: 'Sweden', value: 54, progress: 'amber', dueDate: new Date('2017-08-17T10:39:57.362Z'), images: ['https://fsa.zobj.net/crop.php?r=NLYiH-gLk0ZjeMxIBRcaC1knnxFlUJeM5ibM_-HgZVY0zWN3_50DxVgAS7-Zlfbwsd3Aw5han1TZbQEki6F_FzTTopRZsUDyTMsynwkA36kIMiyVnBNkyt2spNAOg5gUVP4TjHNTbzqzjY4A_OZ3mSl-D7s5hgAYfYu1Pb9PGhjAb6AtIwrzR8MtVQQ'] },
	_m7ad1: { company: 'Porsche', contact: 'ZG', country: 'Germany', value: 78, progress: 'green', images: ['https://render.fineartamerica.com/images/rendered/default/poster/8/10/break/images/artworkimages/medium/1/19-porsche-logo-porsche-logo.jpg'] },
	_917gb: { company: 'Aston Martin', contact: 'JD', country: 'United Kingdom', value: 132, progress: 'amber', dueDate: new Date('1996-09-13T10:39:57.362Z'), images: ['https://upload.wikimedia.org/wikipedia/en/2/2c/Aston_Martin_Logo_2018.png'] },
	_1236d: { company: 'Lamborghini', contact: 'BB', country: 'Italy', value: 64, images: ['https://upload.wikimedia.org/wikipedia/en/d/df/Lamborghini_Logo.svg', 'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/model/huracan/evo-slider/model/Huracan%20Spyder_scontorno.png'] },
	_k8450: { company: 'Bugatti', contact: 'DT', country: 'France', progress: 'red', dueDate: new Date('2019-01-17T10:39:57.362Z'), images: ['https://3dexport.com/items/2011/07/05/74832/37701/bugatti_logo_3d_model_c4d_max_obj_fbx_ma_lwo_3ds_3dm_stl_247998.jpg'] },
	_u184b: { company: 'Mercedes-Benz', contact: 'WL', country: 'Germany', progress: 'green', images: ['https://i.ebayimg.com/images/g/J9sAAOSwol5Y17RS/s-l300.jpg'] }
};

export const newData2 = {
	_1: { activityId: '', activityTitle: 'Fix PDF', progress: 'green', dueDate: new Date('2018-03-17T10:39:57.362Z'), employeeName: '', assignedUsers: [{ user: 'abd4', role: 'Project Manager', department: 'Kitten Petter' }, { user: 'gte3', role: 'Project Manager' }, { user: 'plo4', role: 'Pleb' }] },
	_2: { activityId: '1251251', activityTitle: 'Mobile Shipment', startDate: new Date('2017-08-17T10:39:57.362Z'), latestProgress: 'The current task is in progress and about to be evaluated', progress: 'amber', dueDate: new Date('2017-08-17T10:39:57.362Z'), employeeName: 'Mark', assignedUsers: [{ user: 'abd4', role: 'Legendary Consumer' }] },
	_3: { activityId: '11241', activityTitle: 'Things to Do', startDate: new Date('2017-08-17T10:39:57.362Z'), latestProgress: 'In progress', progress: 'red', employeeName: 'Paul', assignedUsers: [{ user: 'rew7', role: 'Wizard' }, { user: 'gte3', role: 'Project Manager' }] },
	_4: { activityId: '765976', activityTitle: 'Replace Tire', startDate: new Date('2017-08-17T10:39:57.362Z'), latestProgress: 'Done', dueDate: new Date('1996-09-13T10:39:57.362Z'), employeeName: 'Agam', assignedUsers: [{ user: 'jio9', role: 'Project Manager' }] },
	_5: { activityId: '783434', activityTitle: 'ANUYIC', startDate: new Date('2017-08-17T10:39:57.362Z'), latestProgress: '', employeeName: 'James', progress: 'blue', assignedUsers: [{ user: 'abd4', role: 'Peasant' }, { user: 'gte3', role: 'Project Manager' }, { user: 'plo4', role: 'Peasant' }, { user: 'rew7', role: 'Project Manager' }, { user: 'jio9', role: 'Slacker' }] },
	_6: { activityTitle: 'OAUWDA', startDate: new Date('2017-08-17T10:39:57.362Z'), latestProgress: '', dueDate: new Date('2019-01-17T10:39:57.362Z'), employeeName: 'Andras', assignedUsers: [], progress: 'red' },
	_7: { activityId: '612422', activityTitle: 'AWDIA', startDate: new Date('2017-08-17T10:39:57.362Z'), latestProgress: '', employeeName: 'Salman', progress: 'amber' }
};

export const newData3 = {
	_1: { activityId: '12425', activityTitle: 'Fix PDF', startDate: new Date('2017-08-17T10:39:57.362Z'), latestProgress: 'Fix Chromium', progress: 'green', dueDate: new Date('2018-03-17T10:39:57.362Z'), employeeName: '', assignedGeneric: ['abd4', 'gte3', 'plo4'] },
	_2: { activityId: '1251251', activityTitle: 'Mobile Shipment', startDate: new Date('2017-08-17T10:39:57.362Z'), latestProgress: 'The current task is in progress and about to be evaluated', progress: 'amber', dueDate: new Date('2017-08-17T10:39:57.362Z'), employeeName: 'Mark' },
	_3: { activityId: '11241', activityTitle: 'Things to Do', startDate: new Date('2017-08-17T10:39:57.362Z'), latestProgress: 'In progress', progress: 'red', employeeName: 'Paul' },
	_4: { activityId: '765976', activityTitle: 'Replace Tire', startDate: new Date('2017-08-17T10:39:57.362Z'), latestProgress: 'Done', dueDate: new Date('1996-09-13T10:39:57.362Z'), employeeName: 'Agam', assignedGeneric: ['abd4'] },
	_5: { activityId: '783434', activityTitle: 'ANUYIC', startDate: new Date('2017-08-17T10:39:57.362Z'), latestProgress: '', employeeName: 'James', progress: 'green' },
	_6: { activityId: '12657', activityTitle: 'OAUWDA', startDate: new Date('2017-08-17T10:39:57.362Z'), latestProgress: '', dueDate: new Date('2019-01-17T10:39:57.362Z'), employeeName: 'Andras', assignedGeneric: [], progress: 'red' },
	_7: { activityId: '612422', activityTitle: 'AWDIA', startDate: new Date('2017-08-17T10:39:57.362Z'), latestProgress: '', employeeName: 'Salman', progress: 'amber' }
};

const crypto = require('crypto');
const hash = crypto.createHash('sha256');

const columnsInfo0 = columnsInfo1;
const newData0 = {};
const permissions0 = {
	editableRows:[]
};
for (let i = 0; i < 120; i++) {
	const newId = '_' + hash.update(Date.now() + Math.random().toString()).digest('hex').substring(0, 5);
	newData0[newId] = { company: 'McLaren', contact: 'WL', country: 'United Kingdom', value: 26, progress: 'green', dueDate: new Date('2018-03-17T10:39:57.362Z') };
	permissions0.editableRows.push(newId)
}
export { newData0, permissions0, columnsInfo0 };
