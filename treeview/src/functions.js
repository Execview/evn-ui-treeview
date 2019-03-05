export const getDisplayedTreeStructure = (tree, parentNodes)=>{
	//an array of arrays of the rows to display, their corresponding depths, and whether they are open/closed/neither.
	var newDisplayedRows = []
	const pushChildRows = (childnodes,currentdepth=0) => {
		for(let i=0;i<childnodes.length;i++){
		let currentRow = childnodes[i]
		let arrowstatus = tree[currentRow].open ? 'open': 'closed';
		if(tree[currentRow].nodes.length===0){arrowstatus='none'}
		newDisplayedRows.push({	key:currentRow, 
								depth:currentdepth, 
								nodeStatus: arrowstatus
							})
		if(tree[currentRow].open){
			pushChildRows(tree[currentRow].nodes,currentdepth+1)
		}
	}}
	pushChildRows(parentNodes)
	return newDisplayedRows
}

export default 0