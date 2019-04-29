import * as actionTypes from './actionTypes';

export const getInitialData = () => (dispatch) => {
	var token = ''
    fetch("https://evnext-api.evlem.net/api/login",
    {
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body:JSON.stringify({ username:"james.styman@execview.com",password:"password"})
    })
    .then(data=> data.text())
    .then(datatoken => {
		token=datatoken; 
		return Promise.all([
			fetch("https://evnext-api.evlem.net/api/activities",{method:"GET", headers: {Authorization: `Bearer ${token}`}}).then(data=> data.json()),
			fetch("https://evnext-api.evlem.net/api/activity_tree_list/e55f6ee3-a96e-4ea7-bcfa-b75e39ebcfb2",{method:"GET", headers: {Authorization: `Bearer ${token}`}}).then(data=> data.json())
		])
	})
    .then(([data,links]) => {
		const ourData = translateData(data,links)
		const newEditableCells = Object.keys(ourData).reduce((total,key)=>{return {...total,[key]:['activityTitle', 'startdate', 'progress', 'enddate']}},{})
		dispatch({
            type: actionTypes.LOAD_DATA_DEVELOPMENT,
			token: token,
			data: ourData,
			editableCells: newEditableCells
        })
    })
}

const translateData = (dbdata,dblinks) =>{
	const shapes = {activity:'square', task:'bubble', milestone:'triangle'}
	let newData = null
	newData = dbdata.reduce((total,el) => {
		const startdate = new Date(el.start)
		const enddate = new Date(el.end)
		const colour = el.colour || "Blue"
		return {
			...total,
			[el.id]: {
				startdate:(new Date(startdate.getFullYear(),startdate.getMonth(),startdate.getDate())),
				enddate:(new Date(enddate.getFullYear(),enddate.getMonth(),enddate.getDate())),
				colours: {left: colour, right: colour, middle: colour, original: colour},
				ChildAssociatedBubbles: [],
				ParentAssociatedBubble: "",
				ChildBubbles: {},
				ParentBubble: "",
				open: el.open || false,
				activityTitle: el.activityTitle || el.name,
				progress: el.progress || "amber",
				shape: shapes[el.type]
			}
		}
	},{})
	dblinks.forEach(link => {
		//id, children[], type
		link.children.forEach(child=>
				newData[child.id] = {...newData[child.id],
				ParentAssociatedBubble: link.id
			}
		)	
		newData[link.id] = { 
			...newData[link.id],
			ChildAssociatedBubbles: link.children.map(child=>child.id), 
			ChildBubbles:{},
			ParentBubble:""
		} 
	});
	return newData
}
