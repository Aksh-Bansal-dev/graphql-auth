import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ApolloClient, ApolloLink, ApolloProvider, createHttpLink,  from,  InMemoryCache } from '@apollo/client';
import { getAccessToken } from "./store/accessToken";

const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql',
  credentials: "include"
});

// @ts-ignore
// const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  // let token = getAccessToken();
  
  // const {exp} = token?jwt_decode<JwtPayload>(token): {exp: null};

  // if(exp &&  Date.now()>=exp*1000){
  //   console.log("expired");
  //   fetch("http://localhost:5000/refresh_token",{
  //       method: "POST",
  //       credentials: "include",
  //   })
  //   .then(async res=>{
  //       const data = await res.json();
  //       setAccessToken(data.accessToken);

  //       console.log(data)
  //   })
  // }
  // ZUSTAND
        // return forward(operation);

// })

const afterAuthMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  let token = getAccessToken();
    // console.log("after auth: \n"+token)
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token?`bearer ${token}`: "",
    }
  }));

  return forward(operation);
})


const client = new ApolloClient({
  // link: authLink.concat(httpLink),
  // link: concat(authMiddleware,httpLink),
  link: from([
    // authMiddleware,
    afterAuthMiddleware,
    httpLink
  ]),
  cache: new InMemoryCache(),
});


ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

