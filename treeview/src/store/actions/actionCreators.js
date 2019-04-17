import * as actionTypes from './actionTypes';
import {translateData, getParentNodes} from '../functions'

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
            type: actionTypes.LOAD_DATA,
			token: token,
			data: ourData,
			parentNodes: getParentNodes(ourData),
			editableCells: newEditableCells
        })
    })
}
