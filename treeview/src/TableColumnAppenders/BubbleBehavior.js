export const getColourFromMap = (lookup,map)=>{
	let colourindex = map.map(el=>el[0]).indexOf(lookup)
	let displaycolour = colourindex!==-1 ? map[colourindex][1] : 'white'
	return displaycolour
}