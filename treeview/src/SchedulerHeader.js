import React, { Component } from 'react';

class SchedulerHeader extends Component {
	constructor(){
		super()
		this.state = {rowHeights:[]}
	}

  	render() {	
		const text = parseInt(this.props.data.start)+'th       '+parseInt(this.props.data.start+1)+'th       '+parseInt(this.props.data.start+2)+'th'
		const tableHeight = this.state.rowHeights ? this.state.rowHeights.reduce((total,rh)=>total+rh,0) : 100
    	return (
			<div>
				<pre>{text}</pre>
				<svg height={tableHeight} width='100%' style={{top:'0px', left: '0px', position: "absolute", pointerEvents: 'none',zIndex:'100'}}>
					<g style={{pointerEvents: 'auto'}}>
						<circle cx="50" cy="20" r="50" stroke="black" strokeWidth="3" fill="red" onClick={()=>console.log("CIRCLE")}/>
					</g>
				</svg>
			</div>
		);
  	}

	getRowHeights = (ref)=>{
		return (ref && ref.current) ? [...ref.current.getElementsByTagName('tr')].map(el=>el.clientHeight) : []
	}
	componentDidMount(){
		let rh = this.getRowHeights(this.props.data.tableRef)
		this.setState({rowHeights: rh })}
	componentDidUpdate(){
		const newRowHeights = this.getRowHeights(this.props.data.tableRef)
		if(JSON.stringify(this.state.rowHeights)!==JSON.stringify(newRowHeights)){
			this.setState({rowHeights: newRowHeights})
		}
	}
}

export default SchedulerHeader;
