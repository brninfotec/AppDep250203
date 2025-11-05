
import { useEffect, useRef,useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'


function Login() {
 
  let emailInputRef = useRef();
  let passwordInputRef = useRef();
  let navigate = useNavigate();
  let dispatch = useDispatch();

  axios.defaults.baseURL = '';

  useEffect(()=>{
    if(localStorage.getItem("token")){
      // axios.defaults.headers.common['Authorization'] =localStorage.getItem("token") ;
     
    //  validateToken();
    }
  },[])

  
  let validateToken = async()=>{
    let dataToSend = new FormData();
    
    dataToSend.append("token",localStorage.getItem("token"))
  

    let response = await axios.post("/validateToken",dataToSend);
    
    console.log(response);
    alert(response.data.msg);
    if(response.data.status === "Success"){
 
     dispatch({type:"login",data:response.data.data})
       navigate("/dashboard")
    }
  }

  let onLogIn = async()=>{
    let dataToSend = new FormData();
    
    dataToSend.append("email",emailInputRef.current.value)
    dataToSend.append("password",passwordInputRef.current.value)
    

    let response = await axios.post("/login",dataToSend);
    
    console.log(response);
    alert(response.data.msg);
    if(response.data.status === "Success"){
   localStorage.setItem("token",response.data.data.token)
     dispatch({type:"login",data:response.data.data})
       navigate("/dashboard")
    }
  }
  return (
    <div className="App">
     
      <form>
        <h1>Login</h1>
       <div>
          <label>Email</label>
          <input type="email" ref={emailInputRef}></input>
        </div>
         <div>
          <label>Password</label>
          <input ref={passwordInputRef}></input>
        </div>
    <div>
        <button type='button' onClick={()=>{
          onLogIn();
        }}>login</button>
        </div>
      </form>
      <br></br>
      <br></br>
      <Link to={"/signup"}>Signup</Link>
          </div>
  );
}

export default Login;

