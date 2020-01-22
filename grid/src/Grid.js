import React, { useState, useEffect } from 'react'
import ReactGridLayout, { WidthProvider } from 'react-grid-layout'
import GridItem from './GridItem'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './Grid.css'
import { withResizeDetector } from 'react-resize-detector';
import DraggableContext from './HandlerTools/DraggableContext'
import classes from './Grid.module.css'

const RGL = withResizeDetector(ReactGridLayout)

const draggableHandle = classes['draggable-handle']

const Grid = (props) => {
	const makeKey = (i) => i.toString()
	const ourPropertyKeys = ['className','draggable']

	const cols = props.cols
	const defaultHeight = props.defaultHeight || 200
	const defaultWidth = props.defaultWidth || 1
	const margin = props.margin || [0,0]

	const getLayoutAndOurProperties = (layout=[], ourProperties={}) => {
		let newLayout = layout
		let newOurProperties = ourProperties
		const maxYSoFar = Math.max(...props.children.map(child=>((child && child.props && child.props.grid && child.props.grid.y) || 0)))
		props.children.forEach((child,i)=>{
			if(!child){return}
			const childGridProps = (child.props && child.props.grid) || {}
			const RGLParentClassName = child.props.RGLParentClassName
			const RGLChildClassName = child.props.RGLChildClassName
			const childGrid = Object.fromEntries(Object.entries(childGridProps).filter(([k,v])=>!ourPropertyKeys.includes(k)))
			const ourValues = Object.fromEntries(Object.entries(childGridProps).filter(([k,v])=>ourPropertyKeys.includes(k)))
			const dataGrid = {i: makeKey(i), x: 0, y:maxYSoFar+i, w:defaultWidth, h:defaultHeight, ...childGrid };
			newLayout.push(dataGrid)
			newOurProperties[dataGrid.i] = {className: RGLParentClassName, childClassName: RGLChildClassName,...ourValues}
		})
		return [newLayout, newOurProperties]
	}

	const isInternalLayout = !props.setLayout
	const [internalLayout, setInternalLayout] = useState([])
	const [internalOurProperties, setInternalOurProperties] = useState({})
	
	const [layoutFromChildren, ourPropertiesFromChildren] = isInternalLayout ? [null,null] : getLayoutAndOurProperties()

	const externalSetLayout = (newLayout) => {
		newLayout.sort((a,b)=>{
			return a.i-b.i
		})
		const filteredNewLayout = newLayout.map(blockLayout=>{
			const filterProperties = ["i","minW","maxW","minH","maxH","moved","static","isDraggable","isResizable"]
			let newBlockLayout = blockLayout || []
			filterProperties.forEach(p=>{
				const {[p]:_, ...rest} = newBlockLayout
				newBlockLayout = rest
			})
			return newBlockLayout
		})
		props.setLayout && props.setLayout(filteredNewLayout)
	}
	const [layout, setLayout] = isInternalLayout ? [internalLayout, setInternalLayout] : [layoutFromChildren, externalSetLayout]

	const [ourProperties, setOurProperties] = isInternalLayout ? [internalOurProperties, setInternalOurProperties] : [ourPropertiesFromChildren, (()=>console.log('you shouldnt see this'))]

	useEffect(()=>{
		if(isInternalLayout){
			const [newLayout, newOurProperties] = getLayoutAndOurProperties(layout, ourProperties)
			setLayout(newLayout)
			setOurProperties(newOurProperties)
		}
	},[])

	const changeHeight = (key,height) => {
		const currentDataGrid = layout.find(el=>el.i===key)
		const filteredLayout = layout.filter(el=>el.i!==key)
		setLayout([...filteredLayout,{...currentDataGrid, h: height+margin[1]}])
	}

	return (
		<DraggableContext.Provider value={draggableHandle}>
		<RGL layout={layout} cols={cols} rowHeight={1} margin={[0,0]} onLayoutChange={(newLayout) => setLayout(newLayout)} draggableHandle={`.${draggableHandle}`}>
			{props.children.map((child,i)=>{
				const key = makeKey(i)
				const parentClassName = (ourProperties[key] && ourProperties[key].className) || ''
				const childClassName = (ourProperties[key] && ourProperties[key].childClassName) || ''
				return (
					<div key={key} className={parentClassName}>
						<div style={{height:'100%'}} className={childClassName} style={{marginTop: margin[1], marginLeft: margin[0]}}>
							<GridItem onResize={(h)=>changeHeight(key,h)}>
								{child}
							</GridItem>
						</div>
					</div>
				)
			})}
		</RGL>
		</DraggableContext.Provider>
	)
}

export default Grid
