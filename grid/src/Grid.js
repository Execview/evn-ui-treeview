import React, { useState, useEffect } from 'react'
import ReactGridLayout, { WidthProvider } from 'react-grid-layout'
import GridItem from './GridItem'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
const RGL = WidthProvider(ReactGridLayout)

const Grid = (props) => {
	const makeKey = (i) => 'key'+i.toString()+'key'

	const cols = props.cols
	const defaultItemDimensions = props.defaultItemDimensions || [1,200]

	const [layout, setLayout] = useState([])	

	useEffect(()=>{
		let newLayout = layout
		props.children.forEach((child,i)=>{
			const childGrid = (child.props && child.props.grid) || {}
			const dataGrid = {i: makeKey(i), x: 0, y:i, w:defaultItemDimensions[0], h:defaultItemDimensions[1], ...childGrid};
			newLayout.push(dataGrid)
		})
		setLayout(newLayout)
	},[])


	const changeHeight = (key,height) => {
		const currentDataGrid = layout.find(el=>el.i===key)
		const filteredLayout = layout.filter(el=>el.i!==key)
		setLayout([...filteredLayout,{...currentDataGrid, h: height}])
	}
	

	return (
		<RGL layout={layout} cols={cols} rowHeight={1} margin={[0,0]} onLayoutChange={(newLayout) => setLayout(newLayout)}>
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