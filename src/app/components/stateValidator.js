var moment = require('moment')
function tryReturnValidTransformState(teststate) 
	{	//Return the updated state if it is valid, else return false.
		//Move all bubbles based on links
		const LinkForcingAlgorithm = (parentbubblekey) =>{
			for(var childkey in teststate.bubbles[parentbubblekey]["ChildBubbles"]){
				var parentside = 'right'===teststate.bubbles[parentbubblekey]["ChildBubbles"][childkey].parentside ? "enddate" : "startdate"
				var childside = 'right'===teststate.bubbles[parentbubblekey]["ChildBubbles"][childkey].childside ? "enddate" : "startdate"
				var xGapx =teststate.bubbles[parentbubblekey]["ChildBubbles"][childkey].xGapDate
				if(!moment(teststate.bubbles[parentbubblekey][parentside]).add(xGapx).isSame(moment(teststate.bubbles[childkey][childside]))){
					var childotherside = 'right'===teststate.bubbles[parentbubblekey]["ChildBubbles"][childkey].childside ? "startdate" : "enddate";
					var childwidth = (teststate.bubbles[childkey][childotherside]-teststate.bubbles[childkey][childside]);
					var newChildDate = moment(teststate.bubbles[parentbubblekey][parentside]).add(xGapx).toDate()
					teststate.bubbles[childkey][childside]=newChildDate;
					teststate.bubbles[childkey][childotherside]=moment(newChildDate).add(childwidth).toDate()
					}
				LinkForcingAlgorithm(childkey) //get all child bubbles to move their children
				}
			}

		teststate.parentbubbles.forEach((parentbubblekey)=>{
			LinkForcingAlgorithm(parentbubblekey)
		})

		//Dont allow negative length bubbles
		if(!Object.keys(teststate.bubbles).every(bubblekey => {var bubble = teststate.bubbles[bubblekey];return bubble.startdate<bubble.enddate})){console.log('negative width!');return false}
		
		//Dont allow bubbles to collide
		if(!Object.keys(teststate.bubbles).every(bubblekey => {var bubble = teststate.bubbles[bubblekey];return checkForNoBubbleCollisions(bubble,teststate)})){console.log('collision!');return false}

		//Dont allow bubbles on the same line
		//if(!Object.keys(teststate.bubbles).every(bubblekey => {var bubble = teststate.bubbles[bubblekey];return checkForNoSameLine(bubble,teststate)})){console.log('same line!');return false}


		return teststate
	}

function checkForNoSameLine(bubble,teststate)
	{
		var bubblekeyswithoutthis = []
		for (var bubblekey in teststate.bubbles){bubblekeyswithoutthis.push(bubblekey)}
		bubblekeyswithoutthis.splice(bubblekeyswithoutthis.indexOf(bubble.key),1)
		return bubblekeyswithoutthis.every((otherBubbleKey)=>{var otherBubble = teststate.bubbles[otherBubbleKey]
			return !((otherBubble.y===bubble.y)			
			)
		})
	}


function checkForNoBubbleCollisions(bubble,teststate)
	{
		var bubblekeyswithoutthis = []
		for (var bubblekey in teststate.bubbles){bubblekeyswithoutthis.push(bubblekey)}
		bubblekeyswithoutthis.splice(bubblekeyswithoutthis.indexOf(bubble.key),1)
		return bubblekeyswithoutthis.every((otherBubbleKey)=>{var otherBubble = teststate.bubbles[otherBubbleKey]
			return !((otherBubble.y===bubble.y) && 
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
export default tryReturnValidTransformState