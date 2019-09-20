import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { Button } from '@execview/reusable';
import TableWrapper from './tableWrapper/TableWrapper';
import * as actionTypes from './store/actionTypes';
import { cellTypes, dataSort, rowValidation, rules, columnsInfo } from './store/configSwitch';
import cats from './store/ElCatso';
import InPlaceCell from './cells/InPlaceCell/InPlaceCell';
import ColorCell from './cells/colorCell/ColorCell';
import DateCell from './cells/dateCell/DateCell';
import DropdownCell from './cells/dropdownCell/DropdownCell';
import GenericAssignCell from './cells/genericAssignCell/GenericAssignCell';
import ImageDisplay from './cells/imageDisplay/ImageDisplay';
import classes from './App.module.css';
import Panel from './Panel/Panel';


const crypto = require('crypto');
const hash = crypto.createHash('sha256');

const App = (props) => {
	const [data, setData] = useState({})
	const [filters, setFilters] = useState({})

	useEffect(() => {
		setData(props.data);
	}, [props]);


	// const t1 = {};
	// for (let i = 0; i < 5; i++) {
	//   t1[Object.keys(data)[i]] = data[Object.keys(data)[i]];
	// }
	const dataKeys = Object.keys(data);
	const t2 = {};
	for (let i = 0; i < dataKeys.length; i++) {
		t2[dataKeys[i]] = data[dataKeys[i]];
	}
	const allData = t2

	let filteredData = allData
	Object.values(filters).forEach((colFilter)=>{
		Object.values(colFilter).forEach(subfilter=>{
			const filterFunction = subfilter.filter || (()=>{console.log('filter function does not exist')})
			const old = filteredData
			filteredData = filterFunction(filteredData)
		})
	})

	const randomNumber = Math.floor((Math.random() * cats.length));




	const InPlaceCellPropsText = { data: '', onValidateSave: ((x) => { console.log(x); }) };
	const InPlaceCellPropsTextarea = {...InPlaceCellPropsText, wrap:true, classes:{text:classes['black-text'], textareaPlaceholder:classes['red-text']}}
	const InPlaceCellPropsColour = { data: 'green', type: <ColorCell />, onValidateSave: ((x) => { console.log(x); }) };
	const InPlaceCellPropsDate = useMemo(() => { return { data: new Date('2019-12-25'), type: <DateCell />, onValidateSave: ((x) => { console.log(x); }) }}, []);
	const InPlaceCellPropsDropdown = { data: 'apple', type: <DropdownCell options={['apple', 'banana', 'cat']} />, onValidateSave: ((x) => { console.log(x); }) };

	const gaais = { a: { name: 'apple', image: 'https://i.imgur.com/ruSaBxM.jpg' }, b: { name: 'banana', image: 'https://i.imgur.com/6lreFDw.jpg' }, c: { name: 'cat', image: 'https://i.imgur.com/OYBnpPT.jpg' } };
	const Display = (props) => {
		const items = props.items || [];
		const imageDisplayData = gaais && (items.map(u => gaais[u].image) || []);
		return <ImageDisplay data={imageDisplayData} style={props.style} />;
	};
	const InPlaceCellPropsGenericAssign = { data: ['b', 'c'], type: <GenericAssignCell items={gaais} getOption={id => <div>{gaais[id].name}</div>} getSearchField={id => gaais[id].name} display={<Display />} />, onValidateSave: ((x) => { console.log(x); }) };

	const addRow = () => {
		console.log('adding new row')
		const newId = '_' + hash.update(Date.now() + Math.random().toString()).digest('hex').substring(0, 5);
		props.onSave(newId, {}, Object.keys(columnsInfo));
	}
	const [cmv, setCmv] = useState('')
	const getContextMenu = (col) => {
		const filterComponent = columnsInfo[col].filter || null
		return (
			<Panel panelClass={classes["header-context-menu"]}>
				{col+cmv}
				<Button onClick={()=>setCmv(cmv ? '' :' toggled!')}>Test re-render</Button>
				{filterComponent && React.cloneElement(filterComponent,{...filterComponent.props, allData: allData, activeFilter: filters[col], onValidateSave: ((newFilters)=>setFilters({...filters,[col]:newFilters})), className: classes['context-filter']})}
			</Panel>
		)
	}

	return (
		<div className={`${classes["App"]} ${classes["color-scheme"]}`}>
			<div>
				<Button style={{margin:'10px', padding: '30px', paddingTop:'15px', paddingBottom:'15px'}} onClick={addRow}>Add row</Button>
				<TableWrapper
					columnsInfo={columnsInfo}
					editableCells={props.editableCells}
					data={filteredData}
					cellTypes={cellTypes}
					onSave={props.onSave}
					rules={rules}
					dataSort={dataSort}
					tableWidth={1200}
					selectedRow={'_2'}
					getContextMenu={getContextMenu}
				/>
			</div>
			<div style={{ margin: 'auto', marginTop: '30px', maxWidth: '400px' }}>
				<img style={{ marginTop: '30px', maxWidth: '100%' }} src={cats[randomNumber]} alt="xd" />
			</div>
			<div className={classes["inplacecells"]}>
				<InPlaceCell {...InPlaceCellPropsText} />
				<InPlaceCell {...InPlaceCellPropsTextarea} />
				<InPlaceCell {...InPlaceCellPropsColour} />
				<InPlaceCell {...InPlaceCellPropsDate} />
				<InPlaceCell {...InPlaceCellPropsDropdown} />
				<InPlaceCell {...InPlaceCellPropsGenericAssign} />
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		data: state.data,
		editableCells: state.editableCells,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onSave: (rowId, rowValues, editableValues) => dispatch({ type: actionTypes.SAVE, rowId, rowValues, editableValues }),
		onAddRow: () => dispatch({ type: actionTypes.ADD_ROW })
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
