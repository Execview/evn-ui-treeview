import {recursiveDeepDiffs} from '../bubbleCopy'
const ACTUALLY_SEND_TO_DB = false

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

export const translateData = (dbdata,dblinks) =>{
	// console.log(dbdata)
	// console.log(dblinks)
	const shapes = {activity:'square', task:'bubble', milestone:'triangle'}
	let newData = null
	newData = dbdata.reduce((total,el) => {
		const startdate = new Date(el.start)
		const enddate = new Date(el.end)
		return {
			...total,
			[el.id]: {
				startdate:(new Date(startdate.getFullYear(),startdate.getMonth(),startdate.getDate())).toISOString(),
				enddate:(new Date(enddate.getFullYear(),enddate.getMonth(),enddate.getDate())).toISOString(),
				colour:el.colour || "Blue",
				ChildAssociatedBubbles: [],
				ParentAssociatedBubble: "",
				ChildBubbles: {},
				ParentBubble: "",
				open: el.open || false,
				activityTitle: el.activityTitle || el.name,
				progress: el.progress || "amber",
				shape: shapes[el.type]
			}
		}
	},{})
	dblinks.forEach(link => {
		//id, children[], type
		link.children.forEach(child=>
				newData[child.id] = {...newData[child.id],
				ParentAssociatedBubble: link.id
			}
		)	
		newData[link.id] = { 
			...newData[link.id],
			ChildAssociatedBubbles: link.children.map(child=>child.id), 
			ChildBubbles:{},
			ParentBubble:""
		} 
	});
	return newData
}

export class EventStoreSynchroniser {
	
	oldState = {}
	sendToDB = (token, state) =>{
		

		if(Object.keys(this.oldState).length===0){this.oldState=state; return}
		let stateChanges = getDiffs(this.oldState,state);
		this.oldState = state
		if(stateChanges){
			for(let key in stateChanges._data){				
				const bubbleChanges = stateChanges._data[key]
				//ASSOCIATE LINKS
				if(Object.keys(bubbleChanges).includes("ParentAssociatedBubble")){
					console.log(bubbleChanges)
					console.log(bubbleChanges.ParentAssociatedBubble)
					if(bubbleChanges.ParentAssociatedBubble){
						console.log("CHANGED PARENT OF: "+key)
						//delete
						//create						
					}
					else{
						// not sure this will ever be reached... 
						console.log("DELETED PARENT OF: "+key)
					}
				}

				//REMOVE EVERYTHING ELSE
				const {
					startdate,
					enddate,
					colours,
					ParentAssociatedBubble,
					ChildAssociatedBubbles,
					...otherChanges} = bubbleChanges
				const Bubblepayload = {
					...otherChanges
				}
				//RENAME PROPERTIES
				if(startdate){Bubblepayload.start = startdate}
				if(enddate){Bubblepayload.end = enddate}

				
				sendEvent(token,"https://evnext-api.evlem.net/api/command/mutate/"+key,"activity.mutated","activity",Bubblepayload)
				
			}
		}

	}
}

export const sendEvent = (token,link,type,aggregate,payload)=>{
	if(!ACTUALLY_SEND_TO_DB){return}
	console.log("send event")
	let Eventbody = {
		type: type,
		aggregate: aggregate,
		data: {
			meta: {
				source: "local",
				correlation_id: "00000000-0000-0000-0000-000000000000",
				causation_id: "00000000-0000-0000-0000-000000000000"
			},
			payload: payload
		}
	}
	return fetch(link, {
		method:"POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		},
		body:JSON.stringify(Eventbody)
	})
	.then(response=>response.text())
}


export default 0