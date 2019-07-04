export const getYPositionFromRowNumber = (i,rowHeights) => {
		return [...rowHeights].splice(0,i).reduce((total,rh)=>total+rh,0)
}

export const getInternalMousePosition = (event) =>{
	const svg = event && event.target && event.target.closest('svg');
	if(!svg){return [0,0]}
	const CTM = svg.getScreenCTM()	
	const mouse = svg.createSVGPoint();
	mouse.x =event.clientX
	mouse.y = event.clientY
	const mouseSVG = CTM ? mouse.matrixTransform(CTM.inverse()) : {x:0,y:0}
	return [mouseSVG.x,mouseSVG.y]
}

export const getNearestSnapXToDate = (date,snaps)=>{
    const daterangems = snaps.map(dateX=>dateX[0].valueOf())
    const nearestms = getNearestValueInArray(daterangems,date.valueOf())
    const nearestmsindex = daterangems.indexOf(nearestms)
    const nearestXsnap = nearestmsindex !==-1 ? snaps[nearestmsindex][1] : 0
    return nearestXsnap
}

export const getNearestDateToX = (X,snaps)=>{
		var nearestsnap = getNearestValueInArray(snaps.map(i=>i[1]),X)
		var nearestsnapindex = snaps.map(i=>i[1]).indexOf(nearestsnap)
		return snaps[nearestsnapindex][0]
	}

export const getNearestValueInArray = (snaps,value)=>{ 
    if(snaps===[]){return value}
    const distancefromsnaps = snaps.slice().map((i)=>Math.abs(i-value))
    return snaps[distancefromsnaps.indexOf(Math.min(...distancefromsnaps))]
}
