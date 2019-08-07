import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import TableWrapper from './tableWrapper/TableWrapper';
import './App.css';
import * as actionTypes from './store/actionTypes';
import { cellTypes, dataSort, rowValidation, rules, columnsInfo } from './store/configSwitch';
import cats from './store/ElCatso';

import InPlaceCell from './cells/InPlaceCell/InPlaceCell'
import ColorCellDisplay from './cells/colorCell/ColorCellDisplay'
import ColorCellEditor from './cells/colorCell/ColorCellEditor'
import DateCellDisplay from './cells/dateCell/DateCellDisplay'
import DateCellEditor from './cells/dateCell/DateCellEditor'
import DropdownCellEditor from './cells/dropdownCell/DropdownCellEditor'
import TextareaCellDisplay from './cells/TextAreaCell/TextareaCellDisplay'
import GenericAssignDisplay from './cells/genericAssignCell/GenericAssignDisplay'
import ImageDisplay from './cells/imageDisplay/ImageDisplay'

const App = (props) => {
	const [data, setData] = useState({})

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
	const randomNumber = Math.floor((Math.random() * cats.length));




	const InPlaceCellPropsText = { data: 'In Place Cell Text', onValidateSave: ((x) => { console.log(x); }) };
	const InPlaceCellPropsColour = { data: 'green', type: { display: <ColorCellDisplay />, editor: <ColorCellEditor /> }, onValidateSave: ((x) => { console.log(x) }) }
	const InPlaceCellPropsDate = { data: new Date('2019-12-25'), type: { display: <DateCellDisplay />, editor: <DateCellEditor /> }, onValidateSave: ((x) => { console.log(x) }) }
	const InPlaceCellPropsDropdown = { data: 'apple', type: { display: <TextareaCellDisplay />, editor: <DropdownCellEditor dropdownList={['apple', 'banana', 'cat']} /> }, onValidateSave: ((x) => { console.log(x); }) };

	const gaais = { a: { name: 'apple', image: 'https://i.imgur.com/ruSaBxM.jpg' }, b: { name: 'banana', image: 'https://i.imgur.com/6lreFDw.jpg' }, c: { name: 'cat', image: 'https://i.imgur.com/OYBnpPT.jpg' } };
	const Display = (props) => {
		const items = props.items || [];
		const imageDisplayData = gaais && (items.map(u => gaais[u].image) || []);
		return <ImageDisplay data={imageDisplayData} style={props.style} />;
	};
	const InPlaceCellPropsGenericAssign = { data: ['b', 'c'], type: { display: <GenericAssignDisplay items={gaais} getOption={id => <div>{gaais[id].name}</div>} getSearchField={id => gaais[id].name} display={<Display />} /> }, onValidateSave: ((x) => { console.log(x); }) };

	return (
		<div className="App">
			<div>
				<TableWrapper
					columnsInfo={columnsInfo}
					editableCells={props.editableCells}
					data={t2}
					cellTypes={cellTypes}
					onSave={props.onSave}
					rules={rules}
					dataSort={dataSort}
					tableWidth={1200}
				/>
			</div>
			<div style={{ margin: 'auto', marginTop: '30px', maxWidth: '400px' }}>
				<img style={{ marginTop: '30px', maxWidth: '100%' }} src={cats[randomNumber]} alt="xd" />
			</div>
			<div className="inplacecells">
				<InPlaceCell {...InPlaceCellPropsText} />
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
