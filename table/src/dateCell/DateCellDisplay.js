import React from 'react';
import './DateCell.css';
import moment from 'moment';

const DateCellDisplay = (props) => {
    const formatString = props.format || 'ddd DD/MMM/YYYY';
    const style = props.style || {};
    const dateString = props.data !== '' ? moment(props.data).format(formatString) : 'Date Unknown';

    return (
      <div className="cell-container no-select" style={props.style}>
        <p className="cell-text" style={{ overflow: style.overflow, textOverflow: style.textOverflow, whiteSpace: style.whiteSpace }}> 		{dateString}
        </p>
      </div>
    );
};

export default DateCellDisplay;
