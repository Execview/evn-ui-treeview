import React, { useState } from 'react';
import {useFunctionalRef} from '@execview/reusable'
import classes from './App.module.css';
import ColorBox from './ColorBox';

const App = (props) => {
	const [ref,current] = useFunctionalRef()
	const [d, setD] = useState()
	let items = []
	const appEl = current
	console.log(appEl)

	for(let i=1; i<30; i++){
		const colorStyle = (appEl && getComputedStyle(appEl).getPropertyValue(`--color${i}`))
		const style = {
			height: '100px',
			width: '100px',
			padding: '10px'
		}
		const item = <ColorBox key={i} color={colorStyle} style={style}>Colour {i}</ColorBox>
		items.push(item)
	}

	return (
		<div id="app" ref={ref} className={`${classes['app']} ${classes['color-scheme']}`}>
			<button onClick={()=>setD(new Date())}>Render</button>
			<div className={classes['colors']}>
				{items}
			</div>
    	</div>
	);
}

export default App;
