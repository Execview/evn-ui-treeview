import React, {useState, useEffect} from 'react'
import * as colorString from 'color-string'
import {RightClickMenuWrapper} from '@execview/reusable'
import { ChromePicker } from 'react-color'
const ColourPicker = ChromePicker

const ColorBox = (props) => {

	const [col, setCol] = useState()
	useEffect(()=>setCol(props.color),[props.color])

	const onClick = () => {
		const cleanCol = (col || 'transparent').toString().trim()
		const color = colorString.get.rgb(cleanCol)
		const clipboardText = `${color[0]}, ${color[1]}, ${color[2]}`
		copyToClipboard(clipboardText)
	}

	const style = {
		...props.style,
		backgroundColor: col
	}

	return (
		<div style={style} onClick={onClick}>
			{props.children}
			<RightClickMenuWrapper><ColourPicker color={col} onChangeComplete={c=>setCol(c.hex)}/></RightClickMenuWrapper>
		</div>
	)
}

export default ColorBox


const copyToClipboard = (text) => {
	if(!navigator.clipboard){return}
	navigator.clipboard.writeText(text)
	console.log(text)	
}