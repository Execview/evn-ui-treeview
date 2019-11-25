import React, {useState} from 'react';
import BadComponent from './BadComponent'
import Grid from './Grid';
import classes from './App.module.css';
import Handler from './Handlers/Handler';
import EmptyHandler from './Handlers/EmptyHandler'
import { useThemeApplier, defaultTheme } from '@execview/themedesigner'

const App = (props) => {
	useThemeApplier(defaultTheme)
	const draggableHandle = classes['draggable-handle']

	let childItems = []
	for(let i=0; i<20; i++){
		const handler = i%2 === 0 ? <Handler /> : <EmptyHandler className={classes['empty-handler']} />
		const content = <BadComponent i={i}/>
		const item = React.createElement(handler.type,{key: i, draggableHandle:draggableHandle,...handler.props},content)
		childItems.push(item)
	}

	return (
		<div className={classes["main"]}>
			<div className={classes["grid"]}>
				<Grid cols={2} margin={[0,0]} draggableHandle={draggableHandle}>
					{childItems}
				</Grid>
			</div>
		</div>
	);
}

export default App;
