import React, {useState} from 'react';
import ReactGridLayout, { WidthProvider } from 'react-grid-layout'
import BadComponent from './BadComponent'
import './App.css';
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const RGL = WidthProvider(ReactGridLayout)


const App = (props) => {
	const [date, setDate] = useState(new Date())
	const [heights, setHeights] = useState({})

	console.log(heights)
	//const colors=['#eb4034','#376edb','#dbdb37','#44c950','purple', 'orange'];

	let divs = []
	let layouts = []
	for(let i=0; i<20; i++){
		const key = i.toString()
		const divLayout = {x: 0, y: i, w:1, h:heights[key] || 100, i: key, minH:50}
		layouts.push(divLayout)
		const newDiv = <div key={key}><BadComponent date={date} i={i} /*style={{backgroundColor:colors[i%6]}}*/ afterRender={(h)=>setHeights({...heights,[i]:h})}/></div>
		divs.push(newDiv)
	}

	return (
		<div className="App">
			<button onClick={()=>setDate(new Date())}>RENDER HACK</button>
			<RGL layout={layouts} cols={1} rowHeight={1} autoSize  margin={[0,0]} >
				{divs}
			</RGL>
		</div>
	);
}

export default App;
