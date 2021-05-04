import React from "react";
import { RouteComponentProps } from "react-router";
import { useUsersQuery } from "../generated/graphql";

interface Props extends RouteComponentProps {}

const Home:React.FC<Props> = () =>{
  const {data,loading} = useUsersQuery({fetchPolicy: "network-only"});
  return(
    <div>
        <h1>HOME</h1>
        {
            loading?<h3>Loading.....</h3>
            :
            (
                data?.users.map((user, key)=>(
                    <div key={key} style={{border: "2px solid grey", padding: 10}}>
                        <div>{user.id}</div>
                        <div>{user.email}</div>
                    </div>
                ))
            )
        }
    </div>
  )
}

export default Home;
