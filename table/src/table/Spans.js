import React from 'react';

const Spans = (props) => {
	let spans = (
		<div className="span-container">
			<span className="arrow-up" />
			<span className="arrow-down" />
		</div>
	);
	if (props.spans === '') {
		spans = '';
	} else if (props.spans !== 'both') {
		spans = (
			<div className="span-container">
				<span className={props.spans} />
			</div>
		);
	}
	return (spans);
};

export default Spans;
