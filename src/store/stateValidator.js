const moment = require('moment-business-time')
moment.locale('en', {
    // workinghours: {
    //     0: null,
    //     1: ['09:00:00', '17:00:00'],
    //     2: ['09:00:00', '17:00:00'],
    //     3: ['09:00:00', '13:00:00'],
    //     4: ['09:00:00', '17:00:00'],
    //     5: ['09:00:00', '17:00:00'],
    //     6: null
    // }
	workinghours: {
        0: null,
        1: ['00:00:00', '23:59:59.999'],
        2: ['00:00:00', '23:59:59.999'],
        3: ['00:00:00', '23:59:59.999'],
        4: ['00:00:00', '23:59:59.999'],
        5: ['00:00:00', '23:59:59.999'],
        6: null
    }
});

const tryReturnValidTransformState = (bubbles,key,changes) =>{
	//Return the updated state if it is valid, else return false.
	var InvalidMovement = false //keep track if any previous steps have set StateInvalid to false

	const LinkForcingAlgorithm = (parentbubblekey,amount,side) =>{
		//Move all bubbles based on links
		for(var childkey in (bubbles[parentbubblekey].ChildBubbles || {})){
			var parentside = 'right'=== bubbles[parentbubblekey].ChildBubbles[childkey].parentside ? 'end' : 'start'
			
			
			if(side === parentside || side === 'middle'){
				let bubbleChanges = {};
				if (amount > 0) {
					bubbleChanges.startdate = moment(bubbles[childkey].startdate).addWorkingTime(amount, 'ms').add(1000).toDate();
					bubbleChanges.enddate = moment(bubbles[childkey].enddate).addWorkingTime(amount, 'ms').add(1000).toDate();
				} else {
					bubbleChanges.startdate = moment(bubbles[childkey].startdate).addWorkingTime(amount, 'ms').toDate();
					bubbleChanges.enddate = moment(bubbles[childkey].enddate).addWorkingTime(amount, 'ms').toDate();
				}	
				TransformBubble(childkey,'middle_ignore_rules',bubbleChanges)
			}
		}
	}

	const cantMoveSide = (bubblekey,lockedSide)=>{
		const parentBubble = bubbles[bubblekey].ParentBubble
		if(parentBubble){
			const childBubbles = bubbles[parentBubble].ChildBubbles || {};
			return (childBubbles[bubblekey] || {}).childside===lockedSide
		}
		return false
	}
	//doesn't work properly on hours
	const TransformBubble = (bubblekey,part,bubbleChanges) =>{
		if(InvalidMovement){return false}
		let amount;
		switch (part) {
			case 'start':
				if(cantMoveSide(bubblekey,'left')){InvalidMovement=true;return;}
				if(!moment(bubbleChanges.startdate).isWorkingTime()){InvalidMovement=true;return;}

				amount = moment(bubbleChanges.startdate).workingDiff(bubbles[key].startdate)
				if (amount > 0) {
					bubbles[bubblekey].startdate = moment(bubbles[bubblekey].startdate).addWorkingTime(amount,'ms').add(1000).toDate()//getNewWorkingDate(bubbles[bubblekey].startdate,amount);
				} else {
					bubbles[bubblekey].startdate = moment(bubbles[bubblekey].startdate).addWorkingTime(amount,'ms').toDate()
				}

				LinkForcingAlgorithm(bubblekey,amount,'start')
				break;
			case 'end':
				if(cantMoveSide(bubblekey,'right')){InvalidMovement=true;return;}
				bubbleChanges.enddate = new Date(bubbleChanges.enddate.getTime()-1000);
				if(!moment(bubbleChanges.enddate).isWorkingTime()){InvalidMovement=true;return;}
				
				amount = moment(bubbleChanges.enddate).workingDiff(bubbles[key].enddate)

				if (amount > 0) {
					bubbles[bubblekey].enddate = moment(bubbles[bubblekey].enddate).addWorkingTime(amount,'ms').add(1000).toDate()
				} else if (amount < 0) {
					bubbles[bubblekey].enddate = moment(bubbles[bubblekey].enddate).addWorkingTime(amount-1000,'ms').add(2000).toDate()
				}
				
				LinkForcingAlgorithm(bubblekey,amount,'end')
				break;
			case 'middle':
				if(cantMoveSide(bubblekey,'left')){InvalidMovement=true;return;}
				if(cantMoveSide(bubblekey,'right')){InvalidMovement=true;return;}
				if(!moment(bubbleChanges.startdate).isWorkingTime()){InvalidMovement=true;return;}
				TransformBubble(bubblekey,'middle_ignore_rules',bubbleChanges)
				break;
			case 'middle_ignore_rules': {
				bubbleChanges.enddate = new Date(bubbleChanges.enddate.getTime()-1000);

				let amount = moment(bubbleChanges.startdate).workingDiff(bubbles[bubblekey].startdate);

				if (amount > 0) {
					bubbles[bubblekey].startdate = moment(bubbles[bubblekey].startdate).addWorkingTime(amount + 1000,'ms').subtract(1000).toDate()//getNewWorkingDate(bubbles[bubblekey].startdate,amount);
					bubbles[bubblekey].enddate = moment(bubbles[bubblekey].enddate).addWorkingTime(amount,'ms').add(1000).toDate()
				} else {
					bubbles[bubblekey].startdate = moment(bubbles[bubblekey].startdate).addWorkingTime(amount,'ms').toDate()
					bubbles[bubblekey].enddate = moment(bubbles[bubblekey].enddate).addWorkingTime(amount-1000,'ms').add(2000).toDate()
				}


				LinkForcingAlgorithm(bubblekey,amount, 'middle')
				break;
			}
			default:
				break;
		}
	}

	var part = ''
	if(changes.startdate && changes.enddate){
		part = 'middle'
	} else if(changes.startdate && !changes.enddate){
		part = 'start'
	} else if(!changes.startdate && changes.enddate){
		part = 'end'
	}		

	TransformBubble(key,part,changes) 
	//Main bubble has already been shifted in bubbles

	if(InvalidMovement){return false}

	



	//Dont allow negative length bubbles
	if(!Object.keys(bubbles).every(bubblekey => {var bubble = bubbles[bubblekey]; return bubble.startdate<bubble.enddate})){console.log('negative width!');return false}
	
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