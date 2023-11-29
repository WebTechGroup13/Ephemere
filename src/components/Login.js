// /src/components/Login.js

import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import '../styles/LoginSignup.css'


function Login() {

    const history=useNavigate();

    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')

    async function submit(e){
        e.preventDefault();

        try{

            await axios.post("http://localhost:5000/login",{
                email,password
            })
            .then(res=>{
                if(res.data==="exist"){
                    alert("Login successful!"); // Set the success message
                    history("/home",{state:{id:email}}) //Redirect to the home page after success
                }
                else if(res.data==="notexist"){
                    alert("No email associated or incorrect login plaese try again or register.");
                }
            })
            .catch(e=>{
                alert("Error logging in. Wrong details. Please try again");
                console.error('Login error:', e);
                console.log(e);
            })

        }
        catch(e){
            console.log(e);

        }

    }


    return (
        <div className="login">
            {/* Image for landing page */}
            <img className="loginlogo" src="ephemere.svg" alt="Ephemere Logo"></img>
            <div className="loginbox">
                <h1>Login</h1>

                <form action="POST">
                    <input type="email" onChange={(e) => { setEmail(e.target.value) }} placeholder="Email:"  /><br></br>
                    <input type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="Password:"  /><br></br>
                    <button onClick={submit}>Login</button><br></br>
                    <Link to="">Change Password?</Link>
                    <Link ClassName to="/signup">Create An Account</Link>
                </form>
            </div>
        </div>
    )
}

export default Login