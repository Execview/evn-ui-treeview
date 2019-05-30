import {recursiveDeepDiffs, sendEvent} from '@execview/reusable'

// shouldnt be part of treeview. move this into its own package
export class EventStoreSynchroniser {
	oldState = {}
	ACTUALLY_SEND_TO_DB = true
	sendToDB = (token, state, send_events=true) =>{
		this.ACTUALLY_SEND_TO_DB = send_events
		if(Object.keys(this.oldState).length===0){this.oldState=state; return}
		let stateChanges = recursiveDeepDiffs(this.oldState,state);
		this.oldState = state
		if(stateChanges){
			for(let key in stateChanges._data){			
				const bubbleChanges = stateChanges._data[key]
				if(bubbleChanges===undefined){
					//console.log(key+" has been deleted")
					this.sendTheEvent(token,"https://evnext-api.evlem.net/api/command/delete/"+key,"activity.deleted",{})
					continue}
				//ASSOCIATE LINKS
				if(Object.keys(bubbleChanges).includes("ParentAssociatedBubble")){
					if(bubbleChanges.ParentAssociatedBubble){
						//console.log("CHANGED PARENT OF: "+key)
						//delete
						//create						
					}
					else{
						// not sure this will ever be reached... 
						//console.log("DELETED PARENT OF: "+key)
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

				
				this.sendTheEvent(token,"https://evnext-api.evlem.net/api/command/mutate/"+key,"activity.mutated",Bubblepayload)
				
			}
		}

	}

	sendTheEvent = (token,link,type,aggregate,payload)=>{	
		if(!this.ACTUALLY_SEND_TO_DB){return}
		//console.log("send event")
		sendEvent(token,link,type,aggregate,payload)
	}
}



export default EventStoreSynchroniser