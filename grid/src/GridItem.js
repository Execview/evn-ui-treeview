import React from 'react'
import ReactResizeDetector from 'react-resize-detector';

const GridItem = (props) => {
	const spacing = props.spacing || [0,0]
	const style = {
		paddingTop: spacing[1],
		paddingLeft: spacing[0]
	}

	return (
		<div>
			<ReactResizeDetector handleWidth handleHeight onResize={(w,h)=>props.onResize && props.onResize(h)}>
				<div style={style}>
					{props.children}
				</div>	
			</ReactResizeDetector>
		</div>
	)
}

export default GridItem