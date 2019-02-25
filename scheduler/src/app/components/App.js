import React, { Component } from 'react';
import logo from '../../favicon.ico';
//import logo from '../../favicon.ico';
import '../css/App.css';
import Scheduler from './Scheduler'

class App extends Component {	
  render() {
    return (
    	<div className="App">
    		<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
        		<h1 className="App-title">Execview Scheduler</h1>
        	</header>
			<div className="App-scheduler">		
				<Scheduler/>		
			</div>	
      </div>
    );
  }
}

export default App;
