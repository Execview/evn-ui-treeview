import React from 'react';

const RenameModal = (props) => {
	var inputvalue = props.startingText.slice()
	return <g>
				<rect 	x={props.startpoint[0]}
						y={props.startpoint[1]}
						width={props.endpoint[0]-props.startpoint[0]}
						height={props.endpoint[1]-props.startpoint[1]}
						style={{fill:"rgba(0,0,0,0.5)"}} 
						onMouseDown={(event)=>{event.preventDefault();props.onMouseDown(inputvalue)}}/>
				<foreignObject x={0} width={props.endpoint[0]-props.startpoint[0]}>
					<form onSubmit={(event)=>{event.preventDefault();props.onSubmit(inputvalue)}}>
						<input 
							autoFocus 
							type='text' 
							defaultValue={inputvalue} 
							onChange={(event)=>{event.preventDefault();
							inputvalue=event.target.value}}
							style={{
								width:'80%',
								fontSize: '60px',
								color:'white',
								paddingleft:'5px',
								border: 'none',
								backgroundColor: 'rgba(0,0,0,0.5)',
								margin:0,
								fontfamily: 'Arial, Helvetica, sans-serif'
								}}/>
					</form>
				</foreignObject>
			</g>
}

export default RenameModal