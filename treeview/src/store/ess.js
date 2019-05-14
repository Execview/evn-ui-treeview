import {recursiveDeepDiffs} from '@execview/reusable'
import jwtDecode from 'jwt-decode'

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
					this.sendEvent(token,"https://evnext-api.evlem.net/api/command/delete/"+key,"activity.deleted","activity",{})
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

				
				this.sendEvent(token,"https://evnext-api.evlem.net/api/command/mutate/"+key,"activity.mutated","activity",Bubblepayload)
				
			}
		}

	}

	sendEvent = (token,link,type,aggregate,payload)=>{	
		if(!this.ACTUALLY_SEND_TO_DB){return}
		//console.log("send event")
		let Eventbody = {
			type: type,
			aggregate: aggregate,
			data: {
				meta: {
					source: "local",
					correlation_id: null,
					causation_id: null,
					//holder: `user/${jwtDecode(token).id}`// what to link to. users have activity links. Link to user's root activity.
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

}



export default EventStoreSynchroniser