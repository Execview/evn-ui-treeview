import React from 'react';
import OCO from '../OCO/OCO'
import './DropdownCell.css';

const GenericDropDown = (props) => {
	const handleClickOutside = props.onBlur || (() => { });

	const style = props.style
	const classes = props.genericDropDownClasses || {};
	const submit = props.submit || (() => { });
	const options = props.options || {}
	return (
		<OCO OCO={handleClickOutside}>
			<div className={classes.dropdown || 'dropdown'} style={style}>
				<div className="dropdown-content">
					{props.canSearch && <input className={classes.dropdownInput || 'dropdown-input'} autoFocus={props.autoFocus} type="text" value={props.searchString} onChange={e => props.onSearchChange(e.target.value)} placeholder={props.placeholder || 'Search..'} />}
					<ul className={classes.dropdownMenu || 'dropdown-menu'}>
						{Object.keys(options).map((v, index) => <li className={classes.dropdownItem || 'dropdown-item'} key={index} onClick={e => submit(v)}>{options[v]}</li>)}
					</ul>
				</div>
			</div>
		</OCO>
	);
}

export default GenericDropDown;
