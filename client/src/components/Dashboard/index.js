import React from 'react'
import { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import './style.css';

export default function Dashboard() {
  const [email, setEmail]= useState('')
  const [content, setContent]= useState('')
  const [loading, setLoading]= useState(false)
  const submit= async()=>{
    if(email!='' && content!='')
      try {
          setLoading(true)
          const response = await axiosClient.post('/send-mail', {email,content});
          console.log('response')
          console.log(response)
          if(response.msg=='ok'){
            setLoading(false)
            alert('Gửi email thành công')

          }
      } catch (error) {
          setLoading(false)
          console.log(error);
          alert('Gửi email thất bại, liên hệ SUCWIN')
      }
  }
  return (
    <div className="container">
      <h3 className="title">Sucwin never die</h3>
      <input type="text" value={email}
       className="textInput"
        placeholder="Nhập Email nhận"
        onChange={(e) =>setEmail(e.target.value)}
        />
      <textarea 
        placeholder="Nội dung email(code html)"
        className="contentMail"
        value={content}
        onChange={(e) =>setContent(e.target.value)}
      />
      <button 
        className="btnSubmit"
        onClick={submit}
      >
        {loading?'Đang gửi....':'SUBMIT'}
      </button>
    </div>
  )
}
