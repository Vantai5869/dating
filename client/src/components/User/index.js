import { Box, Breadcrumbs, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useState } from "react";
import userApi from "../../api/userApi";
import { ToastContainer, toast } from 'react-toastify';
import { imageUpload } from "../../helper/imageUpload";
import Modal from '@mui/material/Modal';
import './style.css';

export default function User() {
  const [userList, setUserList] = useState();
  const [images, setImages] = useState([])
  const [isFetching, setIsFetching] = useState(false);
  const [open, setOpen] = React.useState(false);
  
  useEffect(() => {
         setIsFetching(true);
         const abortController = new AbortController();
 
         (async function fetchUsers() {
             try {
                 const response = await userApi.getAll( {
                     signal: abortController.signal,
                 });
 
                  setIsFetching(false);
 
                 if (response) {
                     setUserList(response);
                 } else {
                 }
             } catch (error) {
                 console.log(error);
             }
         })();
 
         return () => abortController.abort();
 },[] );

  //image
const handleChangeImages = e => {
  const files = [...e.target.files]
  let err = ""
  let newImages = []
  files.forEach(file => {
      if (!file) return err = "File does not exist."

      if (file.size > 1024 * 1024 * 5) {
          return err = "The image largest is 5mb."
      }

      return newImages.push(file)
  })
  if (err) {
      console.log("err roi nhe!")
  }
  setImages([...images, ...newImages])
}

 const formDataUploadServer = async () => {

  try {
    const res = await imageUpload(images);
    const arr = [];
    for (var i = 0; i < res.length; i++) {
        arr.push(res[i].url)
    }
     
  } catch (error) {
    toast.error(error)
  }
}

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
      <div className="brandCreate" onClick={()=>setOpen(true)}>
            <Button variant="contained" >Tạo User</Button>
        </div>

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
              userList.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{row?.id}</TableCell>
                  <TableCell>{row?.avatar}</TableCell>
                  <TableCell>{row?.username}</TableCell>
                  <TableCell align="center">{row?.email}</TableCell>
                  <TableCell align="center">{row?.role}</TableCell>
                  <TableCell align="center">{row?.gender}</TableCell>
                  <TableCell align="center">
                    {row?.address}
                  </TableCell>
                  <TableCell align="center">
                    {row.role === "user" && (
                      <Button
                        variant="contained"
                        color={row.active === 1 ? "primary" : "error"}
                        onClick={() => {}}
                      >
                        {row.active === 1 ? "Kích hoạt" : "Không kích hoạt"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>

        {/* Create */}
        <Modal
            open={open}
            onClose={()=>{}}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={{    
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              pt: 2,
              px: 4,
              pb: 3,
              width: 600 
            }}>
                <h2 id="parent-modal-title">Tạo User</h2>

                <input type="text" className="textInput" placeholder="Nhập tên user"/>
                <input type="text" className="textInput" placeholder="Nhập tên user"/>
                <input type="text" className="textInput" placeholder="Nhập tên user"/>

                <div className="textimage"> Ảnh Product: </div>
                <span className="btn-file">
                  Chọn ảnh<input type="file" multiple onChange={handleChangeImages} />
                </span>

                <div className="groupButtonBrand">
                    <div onClick={()=>setOpen(false)}>
                        <Button variant="contained" >Hủy Tạo</Button> 
                    </div>
                    <div>   
                      <Button variant="contained" onClick={formDataUploadServer} >Tạo mới</Button> 
                    </div>
                </div>

            </Box>

        </Modal>

      <ToastContainer
        position="top-right"
        autoClose={1000}
        closeOnClick />
    </Box>
  );
}
