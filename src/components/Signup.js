// /src/components/Signup.js

import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"


function Signup() {
    const history=useNavigate();

    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')

    async function submit(e){
        e.preventDefault();

        try{

            await axios.post("http://localhost:5000/signup",{
                email,password
            })
            .then(res=>{
                console.log(res.data);
                if(res.data==="exist"){
                    alert("User already exists. Please use a different email.")
                }
                else if(res.data==="notexist"){
                    alert("Registered User");
                    history("/", { state: { id: email, role: 'user' } }) //redirect to login page upon success
                }
            })
            .catch(e=>{
                alert("Error signing up. Wrong details. Please try again.")
                console.error('Signup error:', e);
                console.log(e);
            })

        }
        catch(e){
            console.log(e);

        }

    }


    return (
        <div className="login">

            <h1>Signup</h1>

            <form action="POST">
                <input type="email" onChange={(e) => { setEmail(e.target.value) }} placeholder="email"  />
                <input type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" />
                <input type="submit" onClick={submit} />

            </form>

            <br />
            <p>OR</p>
            <br />

            <Link to="/">Login Page</Link>

        </div>
    )
}

export default Signup