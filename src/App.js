import { useState } from 'react'
function App() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        let result = await fetch(
        'http://localhost:5000/user', {
            method: "post",
            body: JSON.stringify({ name, email }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        result = await result.json();
        console.warn(result);
        if (result) {
            alert("Data saved succesfully");
            setEmail("");
            setName("");
        }
    }
    return (
        <>
           {/* /* <h1>This is React WebApp</h1>
            <form action="">
                <input type="text" placeholder="name"
                value={name} onChange={(e) => setName(e.target.value)} />
                <input type="email" placeholder="email"
                value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type="submit"
                onClick={handleOnSubmit}>submit</button>
            </form> */ }
            
           
            
            
            <img class="logo" src="ephemere.svg"></img>
            
            
            <form class="post" action="">
                <textarea maxLength="300"name="text" placeholder='Send A Letter.' required></textarea>

                    <div>
                    <input maxLength="30" name="from" placeholder='From:'required></input>
                    <input maxLength="30" name="to" placeholder='To:'required></input>
                    <button>Send</button>
                    </div>
                
            </form>
            
            
            
            
            
            
            
            
            
 
        </>
    );
}
 
export default App;
