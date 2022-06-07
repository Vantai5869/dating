import React,{useEffect} from 'react';
import axiosClient from './api/axiosClient';
import AdminLayout from './layout/AdminLayout';

function App() {
  useEffect(()=>{
    const get= async()=>{
      const res = await axiosClient.get('user/test');
      console.log(res)
    }
    get()
  },[])
  return (
    <div className="App">
     <AdminLayout/>
    </div>
  );
}

export default App;
