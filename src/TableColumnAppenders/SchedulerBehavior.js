var moment = require('moment')

export const getDrawnLinksFromData = (data,getBubbleYById,getBubbleXFromDate) => {
	let drawLinks = []
	const displayedRows = Object.keys(data)
	
	for(let i=0; i<displayedRows.length; i++){
		const rowId = displayedRows[i]
		let childlinks = data[rowId].ChildBubbles || {};
		for(const childId in childlinks){
			if(!(data[rowId] && data[childId])) {continue;}
			const parentdate = data[rowId]['right'=== childlinks[childId].parentside ? "enddate" : "startdate"]
			const childdate = data[childId]['right'=== childlinks[childId].childside ? "enddate" : "startdate"]

			const parentx = getBubbleXFromDate(parentdate)
			const parenty = getBubbleYById(rowId)

			const childx = getBubbleXFromDate(childdate) 
			const childy = getBubbleYById(childId)

			const xDirection = Math.abs((childx-parentx)/2)

			const parentvectorx = parentx + xDirection * ('right'=== childlinks[childId].parentside ? 1 : -1)
			const parentvectory = parenty

			const childvectorx = childx + xDirection * ('right'=== childlinks[childId].childside ? 1 : -1)
			const childvectory = childy			

			const link = {
				parent: [parentx,parenty],
				parentVector: [parentvectorx,parentvectory],
				child: [childx,childy],					
				childVector: [childvectorx,childvectory]
			}
			drawLinks.push(link)
		}
	}
	return drawLinks
}

export const getBubbleColours = (id, data, overrides={}) => {
	const self = data[id]
	const original = self.colour
	let right = original
	let left = original

	if(self.ParentBubble && data[self.ParentBubble]){
		const parent = data[self.ParentBubble]
		const linkedSide = parent.ChildBubbles[id].childside
		if(linkedSide==='left'){
			left = parent.colour
		} else {
			right = parent.colour
		}
	}

	const override = overrides[id]

	return {
		right:right,
		middle:original,
		left:left,
		...override
	}
}

export const getSnaps = (start, schedulerResolution, schedulerWidth, timeWidth, extrasnaps) =>{
	if(!schedulerWidth){return []}
	const resolutionMap = {hour:'h', day:'d', week:'w', month:'M', quarter: 'Q'}
	const timeIncrement = resolutionMap[schedulerResolution]
	// console.log(timeIncrement)
	// console.log(start)

	const getDateRange = (start, number)=>{
		var daterange = []
		for(let i=0; i<number; i++){
			let currentdate = moment(start).add(i, timeIncrement).toDate()
			// if([0,6].includes(moment(currentdate).day())){number++;continue;}

			//EXPERIMENTAL -- deals with months that start with saturday/sunday/monday. pls remove
			if (schedulerResolution === 'month' || schedulerResolution === 'quarter') {
				while (!moment(currentdate).isWorkingTime()) {
					currentdate = moment(currentdate).add(1,'d').toDate();
				}
				if (moment(currentdate).day() === 1) {
					currentdate = moment(currentdate).add(1,'d').toDate()
				}
			}
			daterange.push(currentdate)
		}
		return daterange
	}

	const numberOfTimeIncrements = schedulerWidth/timeWidth
	var daterange = getDateRange(moment(start).subtract(extrasnaps,timeIncrement).toDate(),numberOfTimeIncrements+2*extrasnaps);
	let newXsnaps = []
	for(let i=0;i<daterange.length;i++){
		newXsnaps.push([daterange[i],(i-extrasnaps)*timeWidth])
	}
	return newXsnaps
}

export const getTimeFormatString = (resolution) => {
	let formatString;
	switch(resolution){
		case 'hour': {
			formatString = 'ha'
			break;
		}
		case 'day': {
			formatString = 'ddd Do'
			break;
		}
		case 'week': {
			formatString = 'MMM Do'
			break;
		}
		case 'month': {
			formatString = 'MMM'
			break;
		}
		case 'quarter': {
			formatString = '[Q]Q YYYY'
			break;
		}
		default: {
			formatString = 'DD/MM'
			break;
		}
	}
	return formatString
}

export const getMajorStartOf = (mode) => {
	let majorStartOf = ''
		switch(mode){
			case 'hour': {
				majorStartOf='day'
				break;
			}
			case 'day': {
				majorStartOf='isoWeek'
				break;
			}
			case 'week': {
				majorStartOf='month'
				break;
			}
			case 'month': {
				majorStartOf='year'
				break;
			}
			default: {
				majorStartOf='day'
			}
		}
	return majorStartOf
}

export const getMajorLegend = (date, mode) => {
	let legend = ''
		switch(mode){
			case 'hour': {
				legend=moment(date).format('Do MMM')
				break;
			}
			case 'day': {
				legend = moment(date).format('MMMM')
				break;
			}
			case 'week': {
				legend=moment(date).format('MMMM')
				break;
			}
			case 'month': {
				legend=moment(date).format('YYYY')
				break;
			}
			default: {
				legend=''
			}
		}
	return legend
}
