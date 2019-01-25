import React, { Component } from 'react';
import { days, months } from './store/constants';

export default class DateCellDisplay extends Component {
  render() {
    // console.log(this.props.text);
    const myDate = new Date(this.props.text);
    const toReturn = this.props.text !== '' ? days[myDate.getDay()] + ' ' + myDate.getDate() + '/' + months[myDate.getMonth()] + '/' + myDate.getFullYear() : 'Date Unknown';
    return (<div className="cell-container"><p className="cell-text">{toReturn}</p></div>);
  }
}
