import React, { PureComponent } from 'react';
import './CircleUser.css';

export default class UserAddedConfirmation extends PureComponent {
  	render() {
    	return (
     		<div>
				 User Added Sucessfully!
				 <button onClick={this.props.nextScreen}>Add role</button>
      		</div>
    	);
 	}
}
