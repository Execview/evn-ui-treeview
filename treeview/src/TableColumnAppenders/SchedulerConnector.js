import React, { Component } from 'react';
import SchedulerAppender from './SchedulerAppender'
import { connect } from 'react-redux';

class SchedulerConnector extends Component {
	// SchedulerConnector -> SchedulerAppender -> TreeConnector -> TreeAppender -> Table
  	render() {
    	return (
			<div>
				<SchedulerAppender 
				    {...this.props}
				/>
			</div>
		);
  	}
}

const mapStateToProps = state => {
	return {
	}
}

const mapDispatchToProps = dispatch => {
	return {
        
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(SchedulerConnector);