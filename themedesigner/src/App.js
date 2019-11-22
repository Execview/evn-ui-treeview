import React from 'react';
import {useFunctionalRef} from '@execview/reusable'
import classes from './App.module.css';
import ColorBox from './ColorBox';
import useThemeApplier from './useThemeApplier';

import colorDescriptions from './colorDescriptions.json'
import defaultTheme from './themes/default.json'

const App = (props) => {
	useThemeApplier(defaultTheme)
	const [ref,current] = useFunctionalRef()
	let items = []
	const appEl = current

	for(let i=1; i<30; i++){

		const colorCSSVariable = (appEl && getComputedStyle(appEl).getPropertyValue(`--color${i}`))
		const colorStyle = colorCSSVariable && `rgb(${colorCSSVariable})`
		const style = {
			minHeight: '100px',
			width: '100px',
			padding: '10px',
			cursor: 'pointer'
		}
		const item = <ColorBox key={i} color={colorStyle} style={style}>{`Colour ${i} - ${colorDescriptions['color'+i]}`}</ColorBox>
		items.push(item)
	}

	return (
		<div id="app" ref={ref} className={`${classes['app']}`}>
			<div className={classes['colors']}>
				{items}
			</div>
    	</div>
	);
}

export default App;
