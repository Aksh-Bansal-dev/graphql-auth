import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import { setAccessToken } from "./store/accessToken";

interface Props {}

const App:React.FC<Props> = () =>{
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
        fetch("http://localhost:5000/refresh_token",{
            method: "POST",
            credentials: "include",
        }).then(async res=>{
            const data = await res.json();
            setAccessToken(data.accessToken);
            setLoading(false)
        })
    },[])
    
    if(loading){
        return <h1>Loading...</h1>
    }
  return(
    <Routes />
  )
}

export default App;
