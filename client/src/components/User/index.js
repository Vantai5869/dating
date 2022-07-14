import { Box, Breadcrumbs, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useState } from "react";
import userApi from "../../api/userApi";
import { ToastContainer, toast } from "react-toastify";
import { imageUpload } from "../../helper/imageUpload";
import Modal from "@mui/material/Modal";
import "./style.css";
import axiosClient from "../../api/axiosClient";

export default function User() {
  const [userList, setUserList] = useState();
  const [images, setImages] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setIsFetching(true);
    const abortController = new AbortController();

    (async function fetchUsers() {
      try {
        const response = await userApi.getAll({
          signal: abortController.signal,
        });

        setIsFetching(false);

        if (response) {
          setUserList(response.users);
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    })();

    return () => abortController.abort();
  }, []);

  const formDataUploadServer = async () => {
    try {
      const res = await imageUpload(images);
      const arr = [];
      for (var i = 0; i < res.length; i++) {
        arr.push(res[i].url);
      }
      console.log(arr);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDeleteuser = async (id) => {
    try {
      const res = await userApi.deleteUser(id);
      if (res.success) {
        toast.success(res.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <Box margin="100px 30px 0 30px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5" fontWeight={500} marginBottom="15px">
            Quản lý người dùng
          </Typography>
          <Breadcrumbs aria-label="breadcrumb">
            <Typography color="inherit">Trang chủ</Typography>
            <Typography color="primary" fontWeight={500}>
              Người dùng
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      <Box margin="20px 0 40px">
        <Table
          sx={{
            border: "1px solid #e2e2e2",

            "& .MuiTableCell-head": {
              borderRight: "1px solid #e2e2e2",
              fontWeight: 600,
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>avatar</TableCell>
              <TableCell>username</TableCell>
              <TableCell align="center">email</TableCell>
              <TableCell align="center">role</TableCell>
              <TableCell align="center">gender</TableCell>
              <TableCell align="center">address</TableCell>
              <TableCell align="center">action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userList &&
              userList.length > 0 &&
              userList.map((row, id) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{id + 1}</TableCell>
                  <TableCell>
                    <img src={row?.avatar} width={120} height={150}></img>
                  </TableCell>
                  <TableCell>{row?.username}</TableCell>
                  <TableCell align="center">{row?.email}</TableCell>
                  <TableCell align="center">{row?.role}</TableCell>
                  <TableCell align="center">{row?.gender}</TableCell>
                  <TableCell align="center">{row?.address}</TableCell>
                  <TableCell align="center">
                    {row.role === "user" && (
                      <Button
                        variant="contained"
                        color={row.active === 1 ? "primary" : "error"}
                        onClick={() => handleDeleteuser(row._id)}
                      >
                        Xóa người dùng
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>

      <ToastContainer position="top-right" autoClose={1000} closeOnClick />
    </Box>
  );
}
