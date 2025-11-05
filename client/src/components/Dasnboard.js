import React from 'react'
import { useSelector } from 'react-redux'
import TopNavigation from './TopNavigation';

function Dasnboard() {
  let userDetails = useSelector((store)=>{
    return store.userDetails;
  });

  let onDeleteProfile = async ()=>{
    let dataToSend  = new FormData();
    dataToSend.append("email",userDetails.email);

   let reqOptions={
      method:"DELETE",
      body:dataToSend
    };

    let JSONData = await fetch("http://localhost:3333/deleteProfile",reqOptions);
    let JSOData = await JSONData.json();
    console.log(JSOData);
    alert(JSOData.msg);
  }
  return (
    <div>
      <TopNavigation></TopNavigation>
      <h1>Dashboard</h1>
      <button type="button" onClick={()=>{
       onDeleteProfile();
      }}>Delete Account</button>
      <h1>{userDetails.firstName}{userDetails.lastName}</h1>
      <img src={`http://localhost:3333/${userDetails.profilePic}`} alt=''></img>
    </div>
  )
}

export default Dasnboard
