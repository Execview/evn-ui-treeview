import * as actionTypes from './actionTypes';
import {translateData} from './functions'

export const getInitialData = () => (dispatch) => {
	var token = ''
    fetch("https://evnext-api.evlem.net/api/login",
    {
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body:JSON.stringify({ username:"james.styman@execview.com",password:"password"})
    })
    .then(data=>{return data.text()})
    .then(datatoken => {token=datatoken; return fetch("https://evnext-api.evlem.net/api/activities",{method:"GET", headers: {Authorization: `Bearer ${token}`}})})
	.then(data=>{return data.json()})
	.then(data=>{
		const ourData = translateData(data)
		dispatch({
            type: actionTypes.LOAD_DATA,
			token: token,
			data: ourData,
			parentNodes: getParentNodes(ourData)
        })
	})
}

const getParentNodes = (data) => {	
	return Object.keys(data).filter(key=>data[key].ParentAssociatedBubble==='')
}