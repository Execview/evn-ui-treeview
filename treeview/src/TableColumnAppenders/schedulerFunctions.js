export const getYPositionFromRowNumber = (i,rowHeights) => {
		return [...rowHeights].splice(0,i).reduce((total,rh)=>total+rh,0)
}

class SVGHolder {
	SVG = null
	getSVG = (svg) => {
		if(svg) { 
			this.SVG = svg; 
		}
		return this.SVG
	}
}
const SVGH = new SVGHolder()

export const getInternalMousePosition = (event) =>{
	const currentSVG = event && event.target && event.target.closest('svg');
	const svg = SVGH.getSVG(currentSVG)
	if(!svg){return [0,0]}
	
	const CTM = svg.getScreenCTM()
	const mouse = svg.createSVGPoint();
	mouse.x =event.clientX
	mouse.y = event.clientY
	const mouseSVG = CTM ? mouse.matrixTransform(CTM.inverse()) : {x:0,y:0}
	return [mouseSVG.x,mouseSVG.y]
}

export const getNearestValueInArray = (snaps,value)=>{
    return getNearestValuesInArray(snaps,value)[0]
}

export const getNearestValuesInArray = (snaps,value)=>{ 
    if(snaps===[]){return [value]}
	return [...snaps].sort((a,b)=>{
		const aDistance = Math.abs(a-value)
		const bDistance = Math.abs(b-value)
		return aDistance-bDistance > 0 ? 1 : -1
	})
}

export const getNearestSnapXToDate = (date,snaps)=>{
	const val = date.valueOf()
    const daterangems = snaps.map(dateX=>dateX[0].valueOf())
	const nearestTwoVals = getNearestValuesInArray(daterangems,val).slice(0,2)
	const nearestTwoXs = nearestTwoVals.map(nt=>snaps[daterangems.indexOf(nt)][1])
	const percentBetween = (val-nearestTwoVals[1])/(nearestTwoVals[0]-nearestTwoVals[1])
	
	const valX = nearestTwoXs[1] + (nearestTwoXs[0]-nearestTwoXs[1])*percentBetween
    return valX
}

export const getExactNearestSnapDateToX = (X,snaps)=>{
	const nearestTwoXs = getNearestValuesInArray(snaps.map(i=>i[1]),X).slice(0,2)
	const nearestTwoDates = nearestTwoXs.map(nx=>snaps[snaps.map(i=>i[1]).indexOf(nx)][0])
	const percentBetween = (X-nearestTwoXs[1])/(nearestTwoXs[0]-nearestTwoXs[1])
	const Xdate = nearestTwoDates[1].getTime() + (nearestTwoDates[0]-nearestTwoDates[1])*percentBetween

	return new Date(Xdate)
}

export const getNearestSnapDateToX = (X,snaps)=>{
	const nearestTwoXs = getNearestValuesInArray(snaps.map(i=>i[1]),X).slice(0,2)
	const nearestTwoDates = nearestTwoXs.map(nx=>snaps[snaps.map(i=>i[1]).indexOf(nx)][0])
	const percentBetween = Math.round((X-nearestTwoXs[1])/(nearestTwoXs[0]-nearestTwoXs[1]))
	const Xdate = nearestTwoDates[1].getTime() + (nearestTwoDates[0]-nearestTwoDates[1])*percentBetween

	return new Date(Xdate)
}

export const getOldNearestSnapDateToX = (X,snaps)=>{
	var nearestsnap = getNearestValueInArray(snaps.map(i=>i[1]),X)
	var nearestsnapindex = snaps.map(i=>i[1]).indexOf(nearestsnap)
	return snaps[nearestsnapindex][0]
}






// const test = [5,6,2,8,9,20]
// const result = getNearestValueInArray(test,7)
// //console.log(result)

// const test2 = [[new Date('4-7-20'),0],[new Date('4-8-20'),10],[new Date('4-9-20'),20],[new Date('4-10-20'),30]]
// console.log('start test')
// const result2 = getNearestSnapXToDate(new Date('4-3-20'),test2)
// console.log(result2)
// console.log('end test')

// const test3 = [[new Date('4-7-20'),0],[new Date('4-8-20'),10],[new Date('4-9-20'),20],[new Date('4-10-20'),30]]
// const X = 15
// console.log(getNearestDateToX(X,test3))