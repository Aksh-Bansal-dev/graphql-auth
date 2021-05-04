import React, {useState} from "react";
import {useRegisterMutation} from "../generated/graphql";
import { RouteComponentProps } from "react-router";

interface RegisterProps extends RouteComponentProps {}

const Register:React.FC<RegisterProps> = ({history}) =>{
    const [register] = useRegisterMutation();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const handleSubmit = async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const res = await register({
            variables: {
                email, password
            }
        });

        setEmail("");
        setPassword("");

        console.log(res);
        history.push("/")
    }
  return(
    <div>
        <h1>REGISTER</h1>
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

export default Register;
