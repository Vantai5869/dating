import {
  Dashboard, Interests, People, PostAdd
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
// import logo from "../assets/images/logo.png";
import { Path } from "../constants/path";
import ListMenu from "./ListMenu";

const MAIN_MENU = [
  {
    icon: <Dashboard />,
    label: "Dashboard",
    path: Path.DASHBOARD,
  },
];

const MANAGEMENT_MENU = [
  {
    icon: <People />,
    label: "Quản lý người dùng",
    path: Path.USER,
  },
  {
    icon: <Interests />,
    label: "Quản lý Sở thích",
    path: Path.INTEREST,
  },
  {
    icon: <PostAdd />,
    label: "Quản lý bài viết",
    path: Path.POST,
  },
];

export function Sidebar() {
  return (
    <Box borderRight="1px solid rgba(0, 0, 0, 0.05)" height="100%">
      <Box
        padding="15px 0 0"
        marginBottom="30px"
        textAlign="center"
        borderBottom="1px solid rgba(0, 0, 0, 0.05)"
      >
        {/* <img src={logo} alt="logo" width="120px" height="80px" /> */}
      </Box>
      <Box>
        <Box marginBottom="10px">
          <Typography
            variant="caption"
            color="GrayText"
            padding="5px 25px 5px 25px"
          >
            MAIN
          </Typography>
          <ListMenu options={MAIN_MENU} />
        </Box>
        <Box>
          <Typography
            variant="caption"
            color="GrayText"
            padding="5px 25px 5px 25px"
          >
            Quản lý
          </Typography>
          <ListMenu options={MANAGEMENT_MENU} />
        </Box>
      </Box>
    </Box>
  );
}
