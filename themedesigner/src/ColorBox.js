import React, {useState, useEffect} from 'react'
import * as colorString from 'color-string'
import {RightClickMenuWrapper} from '@execview/reusable'
import { ChromePicker } from 'react-color'

const ColorBox = (props) => {

	const [col, setCol] = useState()
	useEffect(()=>setCol(props.color),[props.color])

	const style = {
		...props.style,
		backgroundColor: col
	}

	return (
		<div style={style} onClick={()=>copyToClipboard(col)}>
			{props.children}
			<RightClickMenuWrapper><ChromePicker disableAlpha color={col} onChangeComplete={c=>setCol(c.hex)}/></RightClickMenuWrapper>
		</div>
	)
}

export default ColorBox


const copyToClipboard = (text) => {
	if(!navigator.clipboard){return}
	navigator.clipboard.writeText(text)
	console.log(text)
}