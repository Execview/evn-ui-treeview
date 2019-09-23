import React from 'react';
import OCO from '../OCO/OCO'
import classes from './DropdownCell.module.css';

const GenericDropDown = (props) => {
	const handleClickOutside = props.onBlur || (() => { });

	const style = props.style
	const dropdownClasses = props.genericDropdownClasses || {};
	const submit = props.submit || (() => { });
	const options = props.options || {}
	return (
		<OCO OCO={handleClickOutside}>
			<div className={dropdownClasses.dropdown || classes['dropdown']} style={style}>
				{props.canSearch && <input className={dropdownClasses.dropdownInput || classes['dropdown-input']} autoFocus={props.autoFocus} type="text" value={props.searchString} onChange={e => props.onSearchChange(e.target.value)} placeholder={props.placeholder || 'Search..'} />}
				<ul className={dropdownClasses.dropdownMenu || classes['dropdown-menu']}>
					{Object.keys(options).map((v, index) => <li className={dropdownClasses.dropdownItem || classes['dropdown-item']} key={index} onClick={e => submit(v)}>{options[v]}</li>)}
				</ul>
			</div>
		</OCO>
	);
}

export default GenericDropDown;
