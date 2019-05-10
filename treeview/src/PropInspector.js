import React, { Component } from 'react';

//Wrap some components with this to inspect the props it recieves
class PropInspector extends Component {
	// shouldComponentUpdate(nextProps) {
	// 	console.log(this.props)
	// 	console.log("==========================")
	// 	for(const inspectId of ['_1235d','_m7ad1']){
	// 		console.log(inspectId)
	// 		const oldCell = this.props.data[inspectId].scheduler
	// 		const newCell = nextProps.data[inspectId].scheduler	
	// 		console.log(`New: ${newCell.startpoint} | Old: ${oldCell.startpoint}`)
	// 		for(const property in oldCell){				
	// 			const same = oldCell[property]===newCell[property]
	// 			if(!same){					
	// 				console.log(`${property}: ${same}`)
	// 			}
				
	// 		}
	// 	}

	// 	return true
	// }

	render(){   
		console.log(`All the way: ${(new Date())-this.props.oogaaa}`)
		const newProps = {...this.props}
        return React.cloneElement(newProps.children,
				{...newProps,
					children: newProps.children && newProps.children.props.children,
				}
			)
    }
}
export default PropInspector;