import React from "react";
import { RouteComponentProps } from "react-router";
import { useProfileQuery } from "../generated/graphql";
interface Props extends RouteComponentProps {}

const Profile:React.FC<Props> = () =>{
    let {data, loading, error}  = useProfileQuery({fetchPolicy: "network-only"});

    if(loading)return <h1>Loading.. from profile</h1>

    if(error){
      
        return <h1>{error.message}</h1>
    }
    
  return(
    <div>
        <h1>PROFILE</h1>
        <h2>{data?.profile}</h2>
    </div>
  )
}

export default Profile;
