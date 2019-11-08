import React from 'react';
import OCO from '../OCO/OCO'
import classes from './GenericDropdown.module.css';

const GenericDropDown = (props) => {
	const handleClickOutside = props.onBlur || (() => { });

	const style = props.style
	const dropdownClasses = props.genericDropdownClasses || {};
	const submit = props.submit || (() => { });
	const options = props.options || {}
	return (
		<OCO OCO={handleClickOutside}>
			<div className={`${classes['dropdown']} ${dropdownClasses.dropdown || ''}`} style={style}>
				{props.canSearch && <input className={`${classes['dropdown-input']} ${dropdownClasses.dropdownInput || ''}`} autoFocus={props.autoFocus} type="text" value={props.searchString} onChange={e => props.onSearchChange(e.target.value)} placeholder={props.placeholder || 'Search..'} />}
				<ul className={`${classes['dropdown-menu']} ${dropdownClasses.dropdownMenu || ''}`}>
					{Object.keys(options).map((v, index) => <li className={`${classes['dropdown-item']} ${dropdownClasses.dropdownItem || ''}`} key={index} onClick={e => submit(v)}>{options[v]}</li>)}
				</ul>
			</div>
		</OCO>
	);
}

export default GenericDropDown;
