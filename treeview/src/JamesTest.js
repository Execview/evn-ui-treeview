import React, { Component } from 'react';
import { SIGTRAP } from 'constants';

const JamesTest = () => {	
	const original = {
		a: [5,6,7,{x:true}],
		b: null,
		c: false,
		d: {
			dog: 4,
			cat: {foot: true, hair: ["okay"]}
		},
		e: 5
	}
	const updated = {
		a: [5,6,7],
		b: null,
		c: false,
		d: {
			dog: 4,
			cat: {foot: false, hair: ["okay"]}
		}
	}

	const diffs = NEWrecursiveDeepDiffs(original,updated)
	console.log(diffs)

	return (
		<div>
			JAMES TEST
		</div>
	);	
}


const NEWrecursiveDeepDiffs = (o,u,options={}) => {
	const sitoptions = options.sit || {}
	const stopRecursion = options.stopRecursion || (()=>false)

	const sitdefaults = {
		created: (o,u)=>{return u},
		updated: (o,u)=>{return u},
		deleted: (o,u)=>{return undefined},
		equal: 	"SDFHIASFOPIHESDUPRFHGYIPU4YR7T89YSIUDHF34P8R9YWPORWJHF" //HAS TO BE UNIQUE
	}
	const sit = {...sitdefaults,...sitoptions}
	const RDD = (o,u) => {
		switch(stopRecursion(o,u)){
	  	case "updated": return u
			case "ignore": return sit.equal
			default:break;
		}
		// created, deleted, updated, equal
		const utype = typeof u
		const otype = typeof o 
		if(otype === 'undefined' && utype !== 'undefined') {return sit.created(o,u)}
		if(otype !== 'undefined' && utype === 'undefined') {return sit.deleted(o,u)}	
		if(otype === 'undefined' && utype === 'undefined') {return sit.equal}
		if(otype !== 'undefined' && utype !== 'undefined') {
			const utypereal = Object.prototype.toString.apply(u)
			const otypereal = Object.prototype.toString.apply(o)
			if(utypereal!==otypereal) {return sit.updated(o,u)}
			if(utype === 'function'){
				if(o.toString()!==u.toString()){
					return sit.updated(o,u)
				} else {
					return sit.equal
				}
			}
			if (utype !== 'object') { //not array, not date, not object. Could be bool, number, string.
				if(o !== u) {
					return sit.updated(o,u);
				} else {
					return sit.equal
				}
			}		
			if(utypereal === '[object Date]') {
				if(o.toISOString() !== u.toISOString()) {
					return sit.updated(o,u);
				} else {
					return sit.equal
				}
			}
			if(utypereal === '[object Array]'){
				let newArr = []
				const ps = [...Array(Math.max(o.length,u.length)).keys()];
				ps.forEach(i=>{const newValue=propertyLoop(o[i],u[i]);if(newValue!==sit.equal){newArr[i]=newValue}})
				return newArr.length===0 ? sit.equal : newArr
			}
			if(utypereal === '[object Object]'){
				let newO = {}
				const ps = propertySet(o,u)
				ps.forEach(i=>{const newValue=propertyLoop(o[i],u[i]);if(newValue!==sit.equal){newO[i]=newValue}})
				return Object.keys(newO).length===0 ? sit.equal : newO
			}
			return sit.equal //both null? equal.
		}

		return u
	}

	const propertySet = (o,u) => {
		const okeys = Object.keys(o)
		return [...okeys,...Object.keys(u).filter(ukey=>!okeys.includes(ukey))]
	}
	const propertyLoop = (oi,ui) => {	
		return RDD(oi,ui)
	}

	const result = RDD(o,u)
	return result===sit.equal ? null : result
}
export default JamesTest;
