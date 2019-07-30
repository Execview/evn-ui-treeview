import React, {useState} from 'react';
import './App.css';
import Button from './Components/Button/Button'
import InPlaceCell from './Components/InPlaceCell/InPlaceCell';
import CircleUser from './Components/CircleUser/CircleUser'
import GenericDropdown from './Components/GenericDropdown/GenericDropdown'
import TripleFill from './Components/TripleFill/TripleFill'

import ColorCellDisplay from './Components/colorCell/ColorCellDisplay'
import ColorCellEditor from './Components/colorCell/ColorCellEditor'
import DateCellDisplay from './Components/dateCell/DateCellDisplay'
import DateCellEditor from './Components/dateCell/DateCellEditor'
import DropdownCellEditor from './Components/dropdownCell/DropdownCellEditor'
import TextareaCellDisplay from './Components/Cell/CellTypes/TextAreaCells/TextareaCellDisplay'
import GenericAssignDisplay from './Components/genericAssignCell/GenericAssignDisplay'
import ImageDisplay from './Components/imageDisplay/ImageDisplay'

import injectObjectInObject from './Functions/injectObjectInObject'
import objectCopierWithStringToDate from './Functions/objectCopierWithStringToDate'
import orderedObjectAssign from './Functions/orderedObjectAssign'
import recursiveDeepAssign from './Functions/recursiveDeepAssign'
import recursiveDeepCopy from './Functions/recursiveDeepCopy'
import recursiveDeepDiffs from './Functions/recursiveDeepDiffs'
import sendEvent from './Functions/sendEvent'

function App() {
	
	const InPlaceCellPropsText = {data: 'In Place Cell Text', onValidateSave:((x) => { console.log(x) })}
	const InPlaceCellPropsColour = {data: 'green', type: {display:<ColorCellDisplay/>,editor:<ColorCellEditor/>}, onValidateSave:((x) => { console.log(x) })} 
	const InPlaceCellPropsDate = {data: new Date('2019-12-25'), type: {display:<DateCellDisplay/>, editor:<DateCellEditor/>}, onValidateSave:((x) => { console.log(x) })} 
	const InPlaceCellPropsDropdown = {data: 'apple', type: {display:<TextareaCellDisplay/>, editor:<DropdownCellEditor dropdownList={['apple','banana','cat']}/>}, onValidateSave:((x) => { console.log(x) })} 

	const gaais = {a:{name:'apple', image:'https://i.imgur.com/ruSaBxM.jpg'},b:{name:'banana',image:'https://i.imgur.com/6lreFDw.jpg'},c:{name:'cat',image:'https://i.imgur.com/OYBnpPT.jpg'}}
	const Display = (props) => {
			const items = props.items || [];
			const imageDisplayData = gaais && (items.map(u => gaais[u].image) || []);
			return <ImageDisplay data={imageDisplayData} style={props.style} />;
	};	
	const InPlaceCellPropsGenericAssign = {data: ['b','c'], type: {display:<GenericAssignDisplay items={gaais} getOption={(id)=><div>{gaais[id].name}</div>} getSearchField={(id)=>gaais[id].name} display={<Display/>}/>}, onValidateSave:((x) => { console.log(x) })} 
	const ButtonProps = {onClick:(() => console.log('xd'))}
	const CircleUserProps = {size: 50, url: 'https://i.imgur.com/OYBnpPT.jpg'}

	const [genericDropdownPropsSearchString, setGenericDropdownPropsSearchString] = useState('')
	const GenericDropdownPropsAllOptions = {
		a: {name: 'apple', comp: <div>apple</div>},
		b: {name: 'banana', comp: <div>banana</div>},
		c: {name: 'cat', comp: <img style={{width: '200px'}} src='https://i.imgur.com/VqZOPIw.jpg' alt='cat'/>}
	}
	const GenericDropdownPropsOptions = Object.keys(GenericDropdownPropsAllOptions).filter(id=>GenericDropdownPropsAllOptions[id].name.includes(genericDropdownPropsSearchString)).reduce((t,i)=>{ return {...t,[i]:GenericDropdownPropsAllOptions[i].comp}},{})
	const GenericDropdownProps = {
		submit: ((optionid)=>console.log(optionid)),
		options: GenericDropdownPropsOptions,
		canSearch: true,
		searchString: genericDropdownPropsSearchString,
		onSearchChange: (v=>setGenericDropdownPropsSearchString(v))
	}

	return (
		<div className="App">
			<InPlaceCell {...InPlaceCellPropsText} />
			<InPlaceCell {...InPlaceCellPropsColour} />
			<InPlaceCell {...InPlaceCellPropsDate} />
			<InPlaceCell {...InPlaceCellPropsDropdown} />
			<InPlaceCell {...InPlaceCellPropsGenericAssign} />
			<Button {...ButtonProps}>test button</Button>
			<TripleFill left={<div>left</div>} center={<div>middle</div>} right={<div>right</div>}/>
			<CircleUser {...CircleUserProps}/>
			<GenericDropdown {...GenericDropdownProps}/>
		</div>
	);
}

export default App;

	//FUNCTIONS
	//injectObjectInObject
		// const ioioa = {a:3,b:4,c:[5,4,7],d:{test:1}}
		// const ioiob = {z:4}
		// console.log(injectObjectInObject(ioioa,ioiob,0))
		// console.log(injectObjectInObject(ioioa,ioiob,1))
		// console.log(injectObjectInObject(ioioa,ioiob,4))
		// console.log(injectObjectInObject(ioioa,ioiob,5))
		// console.log(injectObjectInObject(ioioa,ioiob,8))
		// console.log(injectObjectInObject(ioioa,ioiob,-1))
		// console.log(injectObjectInObject(ioioa,ioiob,-2))
		// console.log(injectObjectInObject(ioioa,ioiob,-4))
		// console.log(injectObjectInObject(ioioa,ioiob,-5))
		// console.log(injectObjectInObject(ioioa,ioiob,-6))
		// console.log(injectObjectInObject(ioioa,ioiob,'start'))
		// console.log(injectObjectInObject(ioioa,ioiob,'end'))
	
	//objectCopierWithStringToDate
		// const ocwstda = {a: 'oompa loompa', b: [1,2,'three'], c: null, d: (new Date()).toISOString()}
		// console.log(objectCopierWithStringToDate(ocwstda))

	//orderedObjectAssign
		// const ooaa = {a: 'oompa loompa', b: [1,2,'three'], c: null, d: (new Date()).toISOString()}
		// console.log(orderedObjectAssign(ooaa,'b','ok'))

	//recursiveDeepAssign
		// const rdaa = {a: 'oompa loompa', b: [1,2,{thr:'thr'}], c: null, d: (new Date()).toISOString()}
		// const rdab = {b: [1,2,{ee:'ee'}], c: 'altered', d: (new Date()).toISOString()}
		// console.log(recursiveDeepAssign(rdaa,rdab))

	//recursiveDeepCopy
		// const rdc = {a: 'oompa loompa', b: [1,2,'three'], c: null, d: (new Date()).toISOString()}
		// console.log(recursiveDeepCopy(rdc))

	//recursiveDeepDiffs
		// const rdda = {a: 'oompa loompa', b: [1,2,{thr:'thr'}], c: null, d: (new Date()).toISOString()}
		// const rddb = {a: 'oompa loompa', b: [1,4,{thr:'thr'}], c: 'test', d: (new Date()).toISOString()}
		// console.log(recursiveDeepDiffs(rdda,rddb))
	
	//sendEvent
		// sendEvent('token','localhostDummy',{testing:'potato'},{holder:'farm',debug:true}).catch(res=>console.log(res.text()))