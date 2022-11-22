import { data as configData} from '../config.js'

export const LOAD_FROM_CONFIG = (state,action,reducer) => {
	const translateConfigData = (data) => {
		let newData = {}
		newData = Object.keys(data).reduce((total,elkey) => {
			const el = data[elkey]
			return {
				...total,
				[elkey]: {
					...el,
					startdate: new Date(el.startdate),
					enddate: new Date(el.enddate),
					colours: {left: el.colour, right: el.colour, middle: el.colour, original: el.colour},
					shape: el.type,
					meta: el.meta || {permission: 1}
				}
			}
		},{})
		return newData
	}
    return {
		...state,
		_data: translateConfigData(configData)
	}
}
