import React from 'react';
import './App.css';
import Button from './Components/Button/Button'
import InPlaceCell from './Components/InPlaceCell/InPlaceCell';

function App() {
  return (
    <div className="App">
		{/* <Button style={{width:'250px'}} onClick={()=>{console.log('testing')}}>Testing <img style={{width:'200px'}} src={'https://img.purch.com/h/1400/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzEwNC84MzAvb3JpZ2luYWwvc2h1dHRlcnN0b2NrXzExMTA1NzIxNTkuanBn'}/></Button> */}
    <InPlaceCell data={'testing'} onValidateSave={(x)=>{console.log(x)}} />
    </div>
  );
}

export default App;
