import React, { useState, useEffect } from 'react'
import ReactGridLayout, { WidthProvider } from 'react-grid-layout'
import GridItem from './GridItem'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { withResizeDetector } from 'react-resize-detector';
const RGL = withResizeDetector(ReactGridLayout)

const Grid = (props) => {
	const makeKey = (i) => 'key'+i.toString()+'key'

	const cols = props.cols
	const defaultHeight = props.defaultHeight || 200
	const defaultWidth = props.defaultWidth || 1

	const [layout, actuallySetLayout] = useState([])

	const setLayout = (tryLayout) => {
		actuallySetLayout(tryLayout)
	}

	useEffect(()=>{
		let newLayout = layout
		props.children.forEach((child,i)=>{
			const childGrid = (child.props && child.props.grid) || {}
			const dataGrid = {i: makeKey(i), x: 0, y:i, w:defaultWidth, h:defaultHeight, ...childGrid};
			newLayout.push(dataGrid)
		})
		setLayout(newLayout)
	},[])


	const changeHeight = (key,height) => {
		const currentDataGrid = layout.find(el=>el.i===key)
		const filteredLayout = layout.filter(el=>el.i!==key)
		setLayout([...filteredLayout,{...currentDataGrid, h: height}])
	}
	
	const draggableHandle = props.draggableHandle

	return (
		<RGL layout={layout} cols={cols} rowHeight={1} margin={[0,0]} onLayoutChange={(newLayout) => setLayout(newLayout)} draggableHandle={`.${draggableHandle}`}>
			{props.children.map((child,i)=>{
				const key = makeKey(i)
				return (
					<div key={key}>
						<GridItem spacing={props.margin} onResize={(h)=>changeHeight(key,h)}>
							{child}
						</GridItem>
					</div>
				)
			})}
		</RGL>

	)
}

export default Grid