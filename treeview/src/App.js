import React, { Component } from 'react';
import {connect} from 'react-redux';
import './App.css';
import SchedulerConnector from './TableColumnAppenders/SchedulerConnector'
import { columnsInfo, cellTypes, editableCells } from './config';

class App extends Component {
	// App -> SchedulerConnector -> SchedulerAppender -> TreeConnector -> TreeAppender -> Table
	//React.cloneElement(this.props.children, {...this.props})}

  	render() {
    	return (
			<div className="App">
				<SchedulerConnector 
					data={this.props.data}
					columnsInfo={columnsInfo}
					editableCells={editableCells}
					cellTypes={cellTypes}
					tableWidth={1800}
					dontPreserveOrder={true}
					wrap={true}
				/>	
			</div>
		);
  	}
}

const mapStateToProps = state => {
	return {
		data: state.displayedData,
	}
}

export default connect(mapStateToProps)(App);
