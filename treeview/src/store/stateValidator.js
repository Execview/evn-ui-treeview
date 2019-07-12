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

const tryReturnValidTransformState = (bubbles,action) =>{
	const {key, changes} = action
	//Return the updated state if it is valid, else return false.
	var InvalidMovement = false //keep track if any previous steps have set StateInvalid to false

	const LinkForcingAlgorithm = (parentbubblekey) =>{
		//Move all bubbles based on links
		for(var childkey in bubbles[parentbubblekey]["ChildBubbles"]){
			var parentside = 'right'===bubbles[parentbubblekey]["ChildBubbles"][childkey].parentside ? "enddate" : "startdate"
			var childside = 'right'===bubbles[parentbubblekey]["ChildBubbles"][childkey].childside ? "enddate" : "startdate"
			//var childotherside = 'right'===bubbles[parentbubblekey]["ChildBubbles"][childkey].childside ? "startdate" : "enddate";
			var xGapx = bubbles[parentbubblekey]["ChildBubbles"][childkey].xGapDate
			var ChildSideMoment = moment(bubbles[childkey][childside])
			var ParentSideMoment = moment(bubbles[parentbubblekey][parentside]).addWorkingTime(xGapx,'ms')
			if(!ChildSideMoment.isSame(ParentSideMoment)){					
				TransformBubble(childkey,'middle_ignore_rules',ParentSideMoment.workingDiff(ChildSideMoment))
			}
		}
	}

	const cantMoveSide = (bubblekey,lockedSide)=>{
		if(bubbles[bubblekey].ParentBubble){
			return bubbles[bubbles[bubblekey].ParentBubble].ChildBubbles[bubblekey].childside===lockedSide}
		else{
			return false
		}
	}

	const weekendGenerator = (a,b) => {
		const realA = moment(a).startOf('isoWeek').subtract(1,'w').toDate()
		const realB = moment(b).endOf('isoWeek').add(1,'w').toDate()
		let weekends = []
		for(let currentdate=moment(realA); currentdate.isSameOrBefore(realB); currentdate.add(1,'w')){
			const sundayEvening = moment(currentdate.startOf('isoWeek')).add(1,'w')
			const saturdayMorning = moment(currentdate.startOf('isoWeek').add(5,'d'))
			weekends.push([saturdayMorning.toDate(),sundayEvening.toDate()])
		}
		console.log(weekends)
		return weekends
	}

	const getNonWorkingAmount = (ia,ib) => {
		const a = new Date(Math.min(ia,ib))
		const b = new Date(Math.max(ia,ib))
		console.log(a.getDate(),b.getDate())
		const nonWorkingRegions = weekendGenerator(a,b)
		const nearbyNonWorkingRegions = nonWorkingRegions.filter(nwr=>(moment(nwr[0]).isBetween(a,b,null,'[]') || moment(nwr[1]).isBetween(a,b,null,'[]')))
		console.log(nearbyNonWorkingRegions)
		let nonWorkingAmout = 0
		nearbyNonWorkingRegions.forEach(nwr=>{
			nonWorkingAmout += (Math.min(nwr[1],b) - Math.max(nwr[0],a)) //(nwr[1]-nwr[0]) //only if a and b fully enclose the non working region.
			
		})
		console.log(nonWorkingAmout);
		return nonWorkingAmout
	}

	const getNewWorkingDate = (d, a) => {
		const nd = moment(d).add(a).toDate()
		const nonWorkingAmount = getNonWorkingAmount(d,nd);
		if (nonWorkingAmount>0) {			
			return getNewWorkingDate(nd,nonWorkingAmount*(a>0?1:-1))
		} else {
			return nd;
		}
	}
	const TransformBubble = (bubblekey,part,amount) =>{
		if(InvalidMovement){return false}
		switch (part) {
			case 'start':
				if(cantMoveSide(bubblekey,'left')){InvalidMovement=true}
				if (amount > 0) {
					bubbles[bubblekey].startdate = moment(bubbles[bubblekey].startdate).addWorkingTime(amount + 1000,'ms').toDate()//getNewWorkingDate(bubbles[bubblekey].startdate,amount);
				} else {
					bubbles[bubblekey].startdate = moment(bubbles[bubblekey].startdate).addWorkingTime(amount,'ms').toDate()
				}
				console.log(bubbles[bubblekey].startdate)

				LinkForcingAlgorithm(bubblekey)
				break;
			case 'end':
				if(cantMoveSide(bubblekey,'right')){InvalidMovement=true}
				if (amount > 0) {
					bubbles[bubblekey].enddate = moment(bubbles[bubblekey].enddate).addWorkingTime(amount,'ms').add(1000).toDate()
				} else if (amount < 0) {
					bubbles[bubblekey].enddate = moment(bubbles[bubblekey].enddate).addWorkingTime(amount-1000,'ms').toDate()
				}
				//getNewWorkingDate(bubbles[bubblekey].enddate,amount);
				console.log(bubbles[bubblekey].enddate)
				LinkForcingAlgorithm(bubblekey)
				break;
			case 'middle':
				if(cantMoveSide(bubblekey,'left')){InvalidMovement=true}
				if(cantMoveSide(bubblekey,'right')){InvalidMovement=true}
				TransformBubble(bubblekey,'middle_ignore_rules',amount)
				break;
			case 'middle_ignore_rules': {
				if (amount > 0) {
					bubbles[bubblekey].startdate = moment(bubbles[bubblekey].startdate).addWorkingTime(amount + 1000,'ms').toDate()//getNewWorkingDate(bubbles[bubblekey].startdate,amount);
					bubbles[bubblekey].enddate = moment(bubbles[bubblekey].enddate).addWorkingTime(amount,'ms').add(1000).toDate()
				} else {
					bubbles[bubblekey].startdate = moment(bubbles[bubblekey].startdate).addWorkingTime(amount,'ms').toDate()
					bubbles[bubblekey].enddate = moment(bubbles[bubblekey].enddate).addWorkingTime(amount-1000,'ms').toDate()
				}
				console.log(bubbles[bubblekey].startdate);
				console.log(bubbles[bubblekey].enddate);
				LinkForcingAlgorithm(bubblekey)
				break;
			}
			default:
				break;
		}
	}
	const {startdate, enddate, ...rest} = changes

	bubbles[key] = {...bubbles[key],...rest}

	var part = ''
	var amountToShift = 0
	if(changes.startdate && changes.enddate){
		changes.enddate = new Date(changes.enddate.getTime()-1000);
		part = 'middle'
		amountToShift = moment(changes.startdate).workingDiff(bubbles[key].startdate)
	}
	if(changes.startdate && !changes.enddate){
		console.log(bubbles[key].startdate)
		console.log(changes.startdate)
		if(!moment(changes.startdate).isWorkingTime()){return false}
		part = 'start'
		amountToShift = moment(changes.startdate).workingDiff(bubbles[key].startdate)

	}
	if(!changes.startdate && changes.enddate){
		changes.enddate = new Date(changes.enddate.getTime()-1000);
		if(!moment(changes.enddate).isWorkingTime()){return false}
		console.log(changes.enddate)
		console.log(bubbles[key].enddate)
		part = 'end'
		amountToShift = moment(changes.enddate).workingDiff(bubbles[key].enddate)
	}		

	console.log('here')

	//amountToShift = amountToShift == '-0' ? 1 : amountToShift

	console.log(amountToShift)



		console.log('xd')
		TransformBubble(key,part,amountToShift) 
	//Main bubble has already been shifted in bubbles

	if(InvalidMovement){return false}

	




	//Dont allow negative length bubbles
	if(!Object.keys(bubbles).every(bubblekey => {var bubble = bubbles[bubblekey];return bubble.startdate<bubble.enddate})){console.log('negative width!');return false}
	
	//Dont allow bubbles to collide
	//if(!Object.keys(bubbles).every(bubblekey => {var bubble = bubbles[bubblekey];return checkForNoBubbleCollisions(bubble,bubbles)})){/*console.log('collision!')*/;return false}
	console.log('returned')
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