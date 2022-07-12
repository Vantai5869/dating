import React from "react";
import { Box, Breadcrumbs, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import userApi from "../../api/userApi";
import { ToastContainer, toast } from "react-toastify";
import { imageUpload } from "../../helper/imageUpload";
import Modal from "@mui/material/Modal";

export default function Interest() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <h1>Interest</h1>
      {/* Create */}
      <div className="brandCreate" onClick={()=>setOpen(true)}>
        <Button variant="contained" >Thêm sở thích</Button>
      </div>
      <Modal
        open={open}
        onClose={() => {}}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            pt: 2,
            px: 4,
            pb: 3,
            width: 600,
          }}
        >
          <h2 id="parent-modal-title">Thêm Sở Thích</h2>

          <input
            type="text"
            className="textInput"
            name="username"
            placeholder="Nhập tên user"
          />
          <input
            type="text"
            className="textInput"
            name="email"
            placeholder="Nhập email"
          />
          <input
            type="text"
            className="textInput"
            name="address"
            placeholder="Nhập quê quán"
          />

          <div className="groupButtonBrand">
            <div onClick={()=>setOpen(!open)}>
              <Button variant="contained">Hủy Tạo</Button>
            </div>
            <div>
              <Button variant="contained">
                Tạo mới
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
