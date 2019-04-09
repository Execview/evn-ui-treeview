import React, { Component } from 'react';
import SchedulerOverlay from './SchedulerOverlay'

class SchedulerHeader extends Component {
	constructor(){
		super()
		this.state = {rowHeights:[], ref: null}
	}

  	render() {
		// console.log(this.props.data.snaps)
		let days = this.props.data.snaps.map((snap,index)=>{return <tspan alignmentBaseline="middle" key={index} x={snap[1]} y={'50%'}>{snap[0].getDate()+"/"+(snap[0].getMonth()+1)}</tspan>})
    	return (
			<div className="header-cell no-select" style={{width:this.props.style.width, touchAction: 'pan-y' }} onPointerDown={this.props.data.mouseOnScheduler}>
				<svg height='100%' width='100%'>
					<text style={{fill:'white'}} >{days}</text>
				</svg>
				<SchedulerOverlay rowHeights={this.state.rowHeights}/>		
			</div>
		);
  	}
	
	componentDidMount(){
		let rh = this.props.data.getRowHeights(this.props.data.tableRef)
		this.setState({rowHeights: rh })
		this.props.data.getWidth && this.props.data.getWidth(this.props.style.width)
	}
	componentDidUpdate(){
		const newRowHeights = this.props.data.getRowHeights(this.props.data.tableRef)
		if(JSON.stringify(this.state.rowHeights)!==JSON.stringify(newRowHeights)){
			this.setState({rowHeights: newRowHeights})
		}
		this.props.data.getWidth && this.props.data.getWidth(this.props.style.width)
	}
}

export default SchedulerHeader;
