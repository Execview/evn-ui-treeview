import React, { Component } from 'react';

class SchedulerOverlay extends Component {
  	render() {
		const tableHeight = this.props.tableHeight || 100
		const getLinkPath = (link)=>{
			const [fx,fy,tx,ty] = link //from co-ordinates and to co-ordinates.
			let ht = (tx-fx)/2 
			let path = null
			//path = `M ${fx} ${fy} L ${tx} ${ty}` // direct line
			//path = `M ${fx} ${fy} h ${(tx-fx)/2} v ${ty-fy} h ${(tx-fx)/2}` // x-y-x line
			path = `M ${fx} ${fy} C ${tx} ${fy} ${fx} ${ty} ${tx} ${ty}`
			return path
		}
    	return (		
			<svg height={tableHeight} width='100%' style={{border: '2px solid red',top:'0px', left: '0px', position: "absolute", pointerEvents: 'none',zIndex:'100'}}>
				<g style={{pointerEvents: 'auto'}}>						
					<circle cx="100" cy="130" r="10" stroke="black" strokeWidth="3" fill="red" onClick={()=>console.log("CIRCLE")}/>
					{this.props.links && this.props.links.map((l,index)=><path d={getLinkPath(l)} fill={'none'} stroke='rgb(240,240,240)' strokeWidth='2' key={index}/>)}
				</g>
			</svg>
		);
  	}
}

export default SchedulerOverlay;
