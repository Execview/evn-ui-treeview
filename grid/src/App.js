import React, {useState} from 'react';
import BadComponent from './BadComponent'
import Grid from './Grid';
import classes from './App.module.css';
const App = (props) => {

	let childItems = []
	for(let i=0; i<20; i++){
		const item = <BadComponent key={i} i={i}/>
		childItems.push(item)
	}

	return (
		<div className={classes["main"]}>
			<div className={classes["grid"]}>
				<Grid cols={2} margin={[10,10]}>
					{childItems}
				</Grid>
			</div>
		</div>
	);
}

export default App;
