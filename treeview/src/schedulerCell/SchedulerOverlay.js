import React, { Component } from 'react';
import SchedulerRightClickMenu from './SchedulerRightClickMenu'

class SchedulerOverlay extends Component {
  	render() {
		const tableHeight = this.props.tableHeight || 100
		const drawLink = (link,index)=>{
			const [fx,fy] = link.parent
			const [tx,ty] = link.child
			const [fvx,fvy] = link.parentVector
			const [tvx,tvy] = link.childVector
			let path = null
			//path = `M ${fx} ${fy} L ${tx} ${ty}` // direct line
			//path = `M ${fx} ${fy} h ${(tx-fx)/2} v ${ty-fy} h ${(tx-fx)/2}` // x-y-x line
			//path = `M ${fx} ${fy} C ${tx} ${fy} ${fx} ${ty} ${tx} ${ty}`
			path = `M ${fx} ${fy} C ${fvx} ${fvy} ${tvx} ${tvy} ${tx} ${ty}`

			let pathColour ='rgb(255,255,255)'
			const drawLink = (
				<g key={index}>
					<path d={path} fill={'none'} stroke={pathColour} strokeWidth='2'/>
					<circle cx={fx} cy={fy} r="5" stroke={pathColour}  strokeWidth="2" fill="none"/>
					<circle cx={tx} cy={ty} r="5" stroke={pathColour}  strokeWidth="2" fill={pathColour}/>
				</g>)
			return drawLink
		}
		let showMenu = this.props.contextMenu && this.props.contextMenu.key
    	return (		
			<svg height={tableHeight + (showMenu?500:0)} width='100%' style={{border: '2px solid red',top:'0px', left: '0px', position: "absolute", pointerEvents: 'none',zIndex:'100'}}>
				<g style={{pointerEvents: 'auto'}}>						
					<circle cx="100" cy="130" r="10" stroke="black" strokeWidth="3" fill="red" onClick={()=>console.log("CIRCLE")}/>
					{this.props.links && this.props.links.map((l, i)=>drawLink(l,i))}
				</g>
				{showMenu && <g style={{pointerEvents: 'auto'}}>
					<SchedulerRightClickMenu contextMenu={this.props.contextMenu}/>
				</g>}
			</svg>
		);
  	}
}

export default SchedulerOverlay;
