import {recursiveDeepDiffs} from '../bubbleCopy'

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
	return recursiveDeepDiffs(original,updated)
}

export const getParentNodes = (data) => {
	return Object.keys(data).filter(key=>data[key].ParentAssociatedBubble==='')
}

export const translateData = (db) =>{
	return db.reduce((total,el) => {
		const startdate = new Date(el.start)
		const enddate = new Date(el.end)
		return {
			...total,
			[el.id]: {
				startdate:(new Date(startdate.getFullYear(),startdate.getMonth(),startdate.getDate())).toISOString(),
				enddate:(new Date(enddate.getFullYear(),enddate.getMonth(),enddate.getDate())).toISOString(),
				colour:el.colour || "Blue",
				ChildAssociatedBubbles: el.ChildAssociatedBubbles || [],
				ParentAssociatedBubble: el.ParentAssociatedBubble || "",
				ChildBubbles: el.ChildBubbles || {},
				ParentBubble: el.ParentBubble || "",
				open: el.open || false,
				activityTitle: el.activityTitle || el.name,
				progress: el.progress || "amber"
			}
		}
	},{})
}

export class EventStoreSynchroniser {
	oldState = {}
	sendToDB = (token, state) =>{
		if(Object.keys(this.oldState).length===0){this.oldState=state; return}
		let stateChanges = getDiffs(this.oldState,state);
		this.oldState = state
		const baseUrl = "https://evnext-api.evlem.net/api/command/mutate/"
		if(stateChanges._data){
			for(let key in stateChanges._data){
				const bubbleChanges = stateChanges._data[key]

				const {startdate,enddate,colours,...otherChanges} = bubbleChanges
				const Bubblepayload = {
					...otherChanges
				}
				if(startdate){Bubblepayload.start = startdate}
				if(enddate){Bubblepayload.end = enddate}

				console.log(Bubblepayload)

				const body = {
					type: "activity.mutated",
					aggregate: "activity",
					data: {
						meta: {
							source: "local",
							correlation_id: "00000000-0000-0000-0000-000000000000",
							causation_id: "00000000-0000-0000-0000-000000000000"
						},
						payload: Bubblepayload
					}
				}

				const x = 'dont run please';
				if(x==="run please"){
					console.log("send event")
					fetch(baseUrl+key, {
						method:"POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`
						},
						body:JSON.stringify(body)
					})
					.then(response=>response.text())
					.then(txt=>console.log(txt))
				}
			}
		}

	}
}














export default 0