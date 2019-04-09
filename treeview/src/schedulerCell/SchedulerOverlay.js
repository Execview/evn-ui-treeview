import React, { Component } from 'react';

class SchedulerOverlay extends Component {
  	render() {
		const tableHeight = this.props.rowHeights ? this.props.rowHeights.reduce((total,rh)=>total+rh,0) : 100
    	return (		
				<svg height={tableHeight} width='100%' style={{top:'0px', left: '0px', position: "absolute", pointerEvents: 'none',zIndex:'100'}}>
					<g style={{pointerEvents: 'auto'}}>						
						<circle cx="10" cy="20" r="10" stroke="black" strokeWidth="3" fill="red" onClick={()=>console.log("CIRCLE")}/>
					</g>
				</svg>
		);
  	}
}

export default SchedulerOverlay;
