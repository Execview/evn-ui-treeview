import React, { Component } from 'react';
import TripleFill from './TripleFill'
import './CircleUser.css';

export default class UserDetails extends Component {
  render() {
	const user = this.props.user || {}
	const editRole = this.props.editExistingRole || ((user)=>{})
    return (
      <div>
        <TripleFill
			style={{ height: '20px', cursor: 'pointer' }}
			center={<p className="user-toggle-detail" style={{display:'inline-block'}}><b>Role:</b> {user.role}</p>}
			right={<i className="fas fa-user-edit" style={{cursor:'pointer', marginLeft: '10px',display:'inline-block'}} onClick={()=>editRole(user.user)}></i>}
		/>

		{user.department &&
			<TripleFill
				style={{ height: '20px', cursor: 'pointer' }}
				center={<p className="user-toggle-detail"><b>Department:</b> {user.department}</p> }
				right={<i className="fas fa-user-edit" style={{cursor:'pointer', marginLeft: '10px',display:'inline-block'}} onClick={()=>editRole(user.user)} />}
			/>
		}
      </div>);
  }
}
