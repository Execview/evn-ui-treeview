export const getDisplayedTreeStructure = (tree, parentNodes)=>{
	//an array of arrays of the rows to display, their corresponding depths, and whether they are open/closed/neither.
	var newDisplayedRows = []
	const pushChildRows = (childnodes,currentdepth=0) => {
		for(let i=0;i<childnodes.length;i++){
		let currentRow = childnodes[i]
		let arrowstatus = tree[currentRow].open ? 'open': 'closed';
		if(tree[currentRow].ChildAssociatedBubbles.length===0){arrowstatus='none'}
		newDisplayedRows.push({	key:currentRow, 
								depth:currentdepth, 
								nodeStatus: arrowstatus
							})
		if(tree[currentRow].open){
			pushChildRows(tree[currentRow].ChildAssociatedBubbles,currentdepth+1)
		}
	}}
	pushChildRows(parentNodes)
	return newDisplayedRows
}

export const getDiffs = (original, updated)=>{
	let changeObject = {}
	let okeys = Object.keys(original)
	let ukeys = Object.keys(updated)

	const notequal = (a,b)=>{
		return JSON.stringify(a)!==JSON.stringify(b)
	}
	
	for(let okey of okeys){
		if(ukeys.includes(okey)){
			if(notequal(original[okey], updated[okey])){
				changeObject[okey] = updated[okey]
			}
		}
		//TODO else {}

	}

	return changeObject
}
//TODO Its pointless for this to be its own file if its usage is so dependent on the data structure.
export default 0