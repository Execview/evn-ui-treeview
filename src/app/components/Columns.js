import React from 'react';
import '../css/Scheduler.css';

const Columns = React.memo((props)=>{
		var onMouseDownHandler = props.onMouseDown || (()=>{console.log("[Scheduler] Mouse Down")})
		var colLetterShift = props.colLetterShift || [5,15];
		var horizontalBreakLineHeight = props.horizontalBreakLineHeight || 20;
		var colsToShow = props.xsnaps
		//console.log(props.xsnaps)
		//console.log(colsToShow)	 //TODO DO THIS	
		var columnTitles = colsToShow.map(dateX=>{return dateX[0].getDate()+"/"+(dateX[0].getMonth()+1)})
		var dayElements = []
		var dayBreakLines = []

		for(var i=0; i<columnTitles.length; i++){
			var xpos = colsToShow[i][1];
			//Day
			dayElements.push(<tspan style={{fill:'white'}} 
									key={2*i} x={xpos+colLetterShift[0]}
									y={props.startpoint[1]+colLetterShift[1]}>
								{columnTitles[i]}
							</tspan>)
			//Linebreak
			dayBreakLines.push(<line 	key={2*i+1} 
										stroke='white' 
										strokeWidth='0.5' 
										x1={xpos} 
										x2={xpos} 
										y1={props.startpoint[1]} 
										y2={props.endpoint[1]}/>)
		}
		return <g 	onMouseDown={onMouseDownHandler} 
					style={{MozUserSelect:"none", WebkitUserSelect:"none", msUserSelect:"none"}}>
					<rect 	x={props.startpoint[0]}
							y={props.startpoint[1]+horizontalBreakLineHeight}
							width={props.endpoint[0]-props.startpoint[0]}
							height={props.endpoint[1]-props.startpoint[1]}
							style={{fill:"rgba(0,0,0,0)"}} />
					<line stroke='white' 
						strokeWidth='1' 
						x1={props.startpoint[0]} 
						x2={props.endpoint[0]} 
						y1={props.startpoint[1]+horizontalBreakLineHeight} 
						y2={props.startpoint[1]+horizontalBreakLineHeight}/>
					<text>{dayElements}</text>
					{dayBreakLines}
				</g>
	})
export default Columns