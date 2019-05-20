const injectObjectInObject = (o,a,pos) => {
	let n;
	switch(pos){
		case 'start': n=0; break;
		case 'end': n=-1; break;
		default: n = pos || (pos===0 ? 0 : -1)
	}


	const okeys = Object.keys(o)
	n = n > okeys.length ? okeys.length : n
	n = n < -1 * okeys.length ? 0 : n
	n = n < 0 ? okeys.length + 1 + n : n

	if(n===0){return {...a,...o};}
	if(n===okeys.length){return {...o,...a};}

	let newO = {}	
	okeys.forEach((id,i)=>{
		if(i===n){newO={...newO,...a};}
		newO[id] = o[id]
	})
	return newO
}

export default injectObjectInObject;


// let a;
// let b;

// a = {a:3,b:4,c:[5,4,7],d:{test:1}}
// b = {z:4}

// console.log(injectObjectInObject(a,b,0))
// console.log(injectObjectInObject(a,b,1))
// console.log(injectObjectInObject(a,b,4))
// console.log(injectObjectInObject(a,b,5))
// console.log(injectObjectInObject(a,b,8))
// console.log(injectObjectInObject(a,b,-1))
// console.log(injectObjectInObject(a,b,-2))
// console.log(injectObjectInObject(a,b,-4))
// console.log(injectObjectInObject(a,b,-5))
// console.log(injectObjectInObject(a,b,-6))
// console.log(injectObjectInObject(a,b,'start'))
// console.log(injectObjectInObject(a,b,'end'))