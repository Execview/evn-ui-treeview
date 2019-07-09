import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';
import classes from './ColorCell.module.css';

class ColorCellEditor extends Component {
	handleClickOutside = () => {
		this.props.onValidateSave(this.props.data);
	};

	render() {
		const colors = { green: 'On track', amber: 'At Risk', red: 'Blocked', grey: 'Unknown Status', blue: 'Completed'};
		const width = this.props.style.width >= 137 ? '100%' : 137;
		return (
			<div className={classes['color-dropdown']} style={{ width }}>
				<ul className={classes['color-dropdown-menu']}>
					{Object.keys(colors).map(objKey => <li className={classes['color-dropdown-item'] + ' ' + classes['hover-' + objKey]} key={objKey} onClick={(e) => { e.stopPropagation(); e.preventDefault(); this.props.onValidateSave(objKey); }}>{colors[objKey]}</li>)}
				</ul>
			</div>
		);
	}
}

export default onClickOutside(ColorCellEditor);
