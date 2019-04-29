var moment = require('moment')

const tryReturnValidTransformState = (bubbles,action) =>{
	const {key, changes} = action
	//Return the updated state if it is valid, else return false.
	var InvalidMovement = false //keep track if any previous steps have set StateInvalid to false

	//KNOWN BUG: If more than one Child associate and left side is dragged longer than the parent associate, the child will end up longer than the parent. Requires validation.Use cantMoveSide possibly? Use this to fix other validation rules 
	//KNOWN ISSUE: swapping 'middle' to 'start' if you only have 1 child associate is a bit hacky. Figure out why it doesnt work with just 1 child associate.
	
	const LinkForcingAlgorithm = (parentbubblekey) =>{
		//Move all bubbles based on links
		for(var childkey in bubbles[parentbubblekey]["ChildBubbles"]){
			var parentside = 'right'===bubbles[parentbubblekey]["ChildBubbles"][childkey].parentside ? "enddate" : "startdate"
			var childside = 'right'===bubbles[parentbubblekey]["ChildBubbles"][childkey].childside ? "enddate" : "startdate"
			//var childotherside = 'right'===bubbles[parentbubblekey]["ChildBubbles"][childkey].childside ? "startdate" : "enddate";
			var xGapx = bubbles[parentbubblekey]["ChildBubbles"][childkey].xGapDate
			var ChildSideMoment = moment(bubbles[childkey][childside])
			var ParentSideMoment = moment(bubbles[parentbubblekey][parentside]).add(xGapx)
			if(!ChildSideMoment.isSame(ParentSideMoment)){					
				//TransformBubble(childkey,'middle',ParentSideMoment.toDate()-ChildSideMoment.toDate())
				ShiftBubble(childkey,ParentSideMoment.toDate()-ChildSideMoment.toDate())
			}
		}
	}

	const AssociateForcingAlgorithm = (bubblekey) =>{
		if(bubbles[bubblekey].ParentAssociatedBubble){
			var parentassociatebubblekey = bubbles[bubblekey].ParentAssociatedBubble
			if(bubbles[parentassociatebubblekey]["ChildAssociatedBubbles"].length>0){
				var earliestDate = bubbles[bubbles[parentassociatebubblekey]["ChildAssociatedBubbles"][0]].startdate //Default is first associate
				var latestDate = bubbles[bubbles[parentassociatebubblekey]["ChildAssociatedBubbles"][0]].enddate
				for(var childkeyINDEX in bubbles[parentassociatebubblekey]["ChildAssociatedBubbles"]){
					var childkey = bubbles[parentassociatebubblekey]["ChildAssociatedBubbles"][childkeyINDEX]
					var childBubble = bubbles[childkey]
					if(childBubble.startdate<earliestDate){earliestDate=childBubble.startdate}
					if(childBubble.enddate>latestDate){latestDate=childBubble.enddate}
				}
				var startDiff = !moment(bubbles[parentassociatebubblekey].startdate).isSame(moment(earliestDate))
				var endDiff = !moment(bubbles[parentassociatebubblekey].enddate).isSame(moment(latestDate))
				var startshiftamount = earliestDate-bubbles[parentassociatebubblekey].startdate
				var endshiftamount = latestDate-bubbles[parentassociatebubblekey].enddate
				var multiside = Object.keys(bubbles[bubbles[bubblekey].ParentAssociatedBubble]["ChildAssociatedBubbles"]).length===1? 'start':'middle'
				if(startDiff){TransformBubble(parentassociatebubblekey,multiside,startshiftamount,bubblekey)} 
				if(endDiff){TransformBubble(parentassociatebubblekey,'end',endshiftamount,bubblekey)}
			}
		}
	}

	const ShiftBubble = (bubblekey,amount,keynottochange) =>{
		bubbles[bubblekey].startdate = moment(bubbles[bubblekey].startdate).add(amount).toDate()
		bubbles[bubblekey].enddate = moment(bubbles[bubblekey].enddate).add(amount).toDate()
		for(var childassociatekeyINDEX in bubbles[bubblekey]["ChildAssociatedBubbles"]){
			var childassociatekey= bubbles[bubblekey]["ChildAssociatedBubbles"][childassociatekeyINDEX]
			if(childassociatekey===keynottochange){continue;}
			//ShiftBubble(childassociatekey,amount)
		}
		for(var childkey in bubbles[bubblekey]["ChildBubbles"]){
			if(childkey===keynottochange){continue;}
			ShiftBubble(childkey,amount)
		}
	}

	const AlterBubbleLength = (bubblekey,amount) =>{
		bubbles[bubblekey].enddate = moment(bubbles[bubblekey].enddate).add(amount).toDate()
	}

	const cantMoveSide = (bubblekey,lockedSide)=>{
		if(bubbles[bubblekey].ParentBubble){
			return bubbles[bubbles[bubblekey].ParentBubble].ChildBubbles[bubblekey].childside===lockedSide}
		else{
			return false
		}
	}

	const TransformBubble = (bubblekey,part,amount,keynottochange) =>{
		if(InvalidMovement){return false}
		switch (part) {
			case 'start':
				if(cantMoveSide(bubblekey,'left')){InvalidMovement=true}
				ShiftBubble(bubblekey,amount,keynottochange)
				AlterBubbleLength(bubblekey,-1*amount); LinkForcingAlgorithm(bubblekey)
			break;
			case 'end':
				if(cantMoveSide(bubblekey,'right')){InvalidMovement=true}
				AlterBubbleLength(bubblekey,amount); LinkForcingAlgorithm(bubblekey)
			break;
			case 'middle':
				if(cantMoveSide(bubblekey,'left')){InvalidMovement=true}
				if(cantMoveSide(bubblekey,'right')){InvalidMovement=true}
				ShiftBubble(bubblekey,amount,keynottochange)
			break;
			default:
			break;
		}	
		//AssociateForcingAlgorithm(bubblekey)
	}
	const {startdate, enddate, ...rest} = changes

	bubbles[key] = {...bubbles[key],...rest}

	var part = ''
	var amountToShift = 0
	if(changes.startdate && changes.enddate){
		part = 'middle'
		amountToShift = changes.startdate - bubbles[key].startdate
	}
	if(changes.startdate && !changes.enddate){
		part = 'start'
		amountToShift = changes.startdate - bubbles[key].startdate
	}
	if(!changes.startdate && changes.enddate){
		part = 'end'
		amountToShift = changes.enddate - bubbles[key].enddate
	}		

	if(amountToShift**2>0){TransformBubble(key,part,amountToShift)} //Main bubble has already been shifted in bubbles
	if(InvalidMovement){return false}

	

	//Dont allow negative length bubbles
	if(!Object.keys(bubbles).every(bubblekey => {var bubble = bubbles[bubblekey];return bubble.startdate<bubble.enddate})){console.log('negative width!');return false}
	
	//Dont allow bubbles to collide
	//if(!Object.keys(bubbles).every(bubblekey => {var bubble = bubbles[bubblekey];return checkForNoBubbleCollisions(bubble,bubbles)})){/*console.log('collision!')*/;return false}
	return bubbles
}
/*
const checkForNoBubbleCollisions = (bubble,bubbles) => {
		var bubblekeyswithoutthis = []
		for (var bubblekey in bubbles){bubblekeyswithoutthis.push(bubblekey)}
		bubblekeyswithoutthis.splice(bubblekeyswithoutthis.indexOf(bubblekey),1)
		return bubblekeyswithoutthis.every((otherBubbleKey)=>{var otherBubble = bubbles[otherBubbleKey]
			return !(
			(	(bubble.startdate>otherBubble.startdate
				&&
				bubble.startdate<otherBubble.enddate)
			||
				(bubble.enddate>otherBubble.startdate
				&&
				bubble.enddate<otherBubble.enddate)
			||
				(bubble.startdate<=otherBubble.startdate
				&&
				bubble.enddate>=otherBubble.enddate)
			)			
			)
		})
}
*/
export default tryReturnValidTransformState