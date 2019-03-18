import React, { PureComponent } from 'react';
import './CircleUser.css';

export default class UserAddedConfirmation extends PureComponent {
  	render() {
    	return (
     		<div>
				 Users Added Sucessfully!
				 {this.props.assignedUsers.map(id=>
					<div key={id}>
				 		<div>{id}</div>
						 <button onClick={()=>{this.props.addRoleTo(id)}}>Add role</button>
					</div>)}
      		</div>
    	);
 	}
}
