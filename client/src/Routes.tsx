import React from "react";
import { BrowserRouter,Link, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import checker from "./utils/checker";
import {useLogoutMutation} from "./generated/graphql";
import { setAccessToken } from "./store/accessToken";

interface RoutesProps {}

const Routes:React.FC<RoutesProps> = () =>{
  const [logout, {client}] = useLogoutMutation();
  const MINUTE_MS = 100000;
  React.useEffect(()=>{
    const interval = setInterval(() => {
      console.log('Logs every minute');
      checker();
    }, MINUTE_MS );

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  },[])

  const handleLogout = async() =>{
    await logout();
    setAccessToken("");
    await client!.resetStore();
  }

  return(
    <BrowserRouter>
      <nav>
          <Link to="/register">Register Here</Link>
          {"<"}===============<Link to="/">Home page</Link>==============<Link to="/profile">See your profile</Link>========={">"}
          <Link to="/login">Log me In</Link>
          <button onClick={handleLogout}>Logout</button>
      </nav>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/register" exact component={Register} />
        <Route path="/login" exact component={Login} />
        <Route path="/profile" exact component={Profile} />
      </Switch>
    </BrowserRouter>
  )
}

export default Routes;
