import React from 'react';

const BubbleContextMenu = (props) => {
	const options = props.options || [["Example",()=>{console.log("this is an example")}]]
	const rightClickItems = options.map((optionAndOnclick, index) => {
		var listItemColour = index%2===0? 'rgb(230,230,250)':'white'
		return <li	key={index} 
					style={{padding: '7px 0',
							background:listItemColour
					}}
					onClick={()=>optionAndOnclick[1]()}>
				{optionAndOnclick[0]}
				</li>
			})
	return (
		<foreignObject x={props.x} y={props.y} width="200" height="100%" style={{MozUserSelect:"none", WebkitUserSelect:"none",msUserSelect:"none"}}>
		<ul style={{
				paddingLeft:'5px',
				paddingTop:'3px',
				paddingRight:'5px',
				alignItems:"center",
				textAlign:"left",
				background:'white',
				listStyleType: 'none'			
				}}>
			{rightClickItems}
			<li><img alt="Whats this?" style={{width:'100%'}} src="https://ichef.bbci.co.uk/images/ic/720x405/p0517py6.jpg"/></li>
		</ul>
		</foreignObject>
	)
}
export default BubbleContextMenu