import { Box } from "@mui/material";
import { Route } from "react-router-dom";
import { useRouteMatch  } from "react-router-dom";
import { Switch } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import Interest from "../components/Interest";
import Post from "../components/Post";
import User from "../components/User";
import Wapper from "../components/Wapper";
import { Path } from "../constants/path";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

const AdminLayout = () => {
  const match = useRouteMatch();

  return (
    <Box
      display="grid"
      gridTemplateAreas={`'sidebar header' 'sidebar main'`}
      gridTemplateColumns="280px 1fr"
      gridTemplateRows="auto 1fr"
      minHeight="100vh"
    >
      <Box gridArea="sidebar">
        <Sidebar />
      </Box>
      <Box gridArea="header" >
        <Header />
      </Box>
      <Box gridArea="main" bgcolor="#f4f5f7">
        <Switch>

          <Route path={Path.DASHBOARD}>
           <Wapper>
             <Dashboard/>
           </Wapper>
          </Route>

          <Route path={Path.USER}>
            <Wapper>
              <User/>
            </Wapper>
          </Route>

          <Route path={Path.INTEREST}>
            <Wapper>
              <Interest/>
            </Wapper>
          </Route>

          <Route path={Path.POST}>
            <Wapper>
              <Post/>
            </Wapper>
          </Route>

        </Switch>
      </Box>
    </Box>
  );
};

export default AdminLayout;
