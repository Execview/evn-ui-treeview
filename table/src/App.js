import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, RightClickMenuWrapper } from '@execview/reusable';
import TableWrapper from './tableWrapper/TableWrapper';
import * as actionTypes from './store/actionTypes';
import { cellTypes, columnsInfo as columnsInfoConfig } from './store/configSwitch';
import cats from './store/ElCatso';
import InPlaceCell from './cells/InPlaceCell/InPlaceCell';
import ColorCell from './cells/ColorCell/ColorCell';
import DateCell from './cells/DateCell/DateCell';
import DropdownCell from './cells/DropdownCell/DropdownCell';
import GenericAssignCell from './cells/GenericAssignCell/GenericAssignCell';
import ImageDisplay from './cells/ImageDisplay/ImageDisplay';
import { useThemeApplier, defaultTheme } from '@execview/themedesigner'
import classes from './App.module.css';

const crypto = require('crypto');
const hash = crypto.createHash('sha256');

const App = (props) => {
	useThemeApplier(defaultTheme)
	const data = props.data
	const columnsInfo = columnsInfoConfig
	//const [columnsInfo, setColumnsInfo] = useState(columnsInfoConfig)
	const [config, setConfig] = useState({depth:0,columns:{}})
	const setFilterMeta = (col,newMeta) => {
		setConfig({
			...config,
			columns: {
				...config.columns,
				[col]: {
					...config.columns[col],
					filters: newMeta
				}
			}
		})
	}

	let filteredData = data
	Object.keys(config.columns).forEach((col)=>{
		const meta = config.columns[col] && config.columns[col].filters
		if(columnsInfo[col].filterFunction){
			// console.log(col)
			// console.log(meta)
			filteredData = columnsInfo[col].filterFunction(filteredData,col,meta)
		} else { /*console.log(`filter function does not exist for: ${col}`)*/ }
	})

	const randomNumber = Math.floor((Math.random() * cats.length));


	const gaais = { a: { name: 'apple', image: 'https://i.imgur.com/ruSaBxM.jpg' }, b: { name: 'banana', image: 'https://i.imgur.com/6lreFDw.jpg' }, c: { name: 'cat', image: 'https://i.imgur.com/OYBnpPT.jpg' } };
	const Display = (props) => {
		const items = props.items || [];
		const imageDisplayData = gaais && (items.map(u => gaais[u].image) || []);
		return <ImageDisplay data={imageDisplayData} style={props.style} />;
	};

	const addRow = () => {
		console.log('adding new row')
		const newId = '_' + hash.update(Date.now() + Math.random().toString()).digest('hex').substring(0, 5);
		props.onAddRow(newId, {});
	}
	const getContextMenu = (col) => {
		const filterComponent = columnsInfo[col] && columnsInfo[col].filter
		if (!filterComponent) { return null; }
		return (
			<RightClickMenuWrapper>
				<div className={classes['rcm']}>

				{filterComponent && React.cloneElement(filterComponent, {
					...filterComponent.props,
					meta: config.columns[col] && config.columns[col].filters,
					setMeta: ((newMeta)=>setFilterMeta(col,newMeta)),
					className: classes['context-filter']
				})}
				</div>
			</RightClickMenuWrapper>
		)
	}

	return (
		<div className={`${classes["App"]}`}>
			<div>
				<Button style={{margin:'10px', padding: '30px', paddingTop:'15px', paddingBottom:'15px'}} onClick={addRow}>Add row</Button>
				<TableWrapper
					columnsInfo={columnsInfo}
					data={filteredData}
					cellTypes={cellTypes}
					onSave={props.onSave}
					selectedRow={'_3'}
					getContextMenu={getContextMenu}
				/>
			</div>
			<div style={{ margin: 'auto', marginTop: '30px', maxWidth: '400px' }}>
				<img style={{ marginTop: '30px', maxWidth: '100%' }} src={cats[randomNumber]} alt="xd" />
			</div>
			<div className={classes["inplacecells"]}>
				<InPlaceCell data=''  />
				<InPlaceCell data='' wrap={true} classes={{text:classes['black-text'], textareaPlaceholder:classes['red-text']}} />
				<InPlaceCell data='green' type={<ColorCell />} />
				<InPlaceCell data={new Date('2019-12-25')} type={ <DateCell /> } />
				<InPlaceCell data='apple' type={<DropdownCell options={['apple', 'banana', 'cat']} />} />
				<InPlaceCell data={['b', 'c']} type={<GenericAssignCell items={gaais} getOption={id => <div>{gaais[id].name}</div>} getSearchField={id => gaais[id].name} display={<Display />} />} style={{width: '70px'}} />
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		data: state.data
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onSave: (row, col, data) => dispatch({ type: actionTypes.SAVE, row, col, data }),
		onAddRow: (id, data) => dispatch({ type: actionTypes.ADD_ROW, id, data })
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
