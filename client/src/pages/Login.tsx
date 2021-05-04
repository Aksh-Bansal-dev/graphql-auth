import React, {useState} from "react";
import {useLoginMutation} from "../generated/graphql";
import { RouteComponentProps } from "react-router";
import { setAccessToken } from "../store/accessToken";

interface Props extends RouteComponentProps {}

const Login:React.FC<Props> = ({history}) =>{
    const [login] = useLoginMutation();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const handleSubmit = async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const res = await login({
            variables: {
                email, password
            }
        });

        setEmail("");
        setPassword("");

        // console.log(res);

        if(res.data?.login.accessToken)
            setAccessToken(res.data?.login.accessToken);

        history.push("/")
    }
  return(
    <div>
        <h1>LOGIN</h1>
        <form>
            <label>email</label>
            <input type="email" name="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="off"/>
            <label>password</label>
            <input type="password" name="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="off"/>
            <button onClick={handleSubmit}>submit</button>
        </form>
    </div>
  )
}


export default Login;
