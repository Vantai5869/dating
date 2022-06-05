import React,{useEffect} from 'react';
import axios from 'axios';

function App() {
  useEffect(()=>{
    const get= async()=>{
      const res = await axios.get('/api/');
      console.log(res)
    }
    get()
  },[])
  return (
    <div className="App">
     <h1>HELLO</h1>
     <h1>HELLO</h1>
     <h1>HELLO</h1>
     <h1>HELLO</h1>
     <h1>HELLO</h1>
     <h1>HELLO</h1>
     <h1>HELLO</h1>
     <h1>HELLO</h1>
    </div>
  );
}

export default App;
