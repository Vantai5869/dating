import React, { useEffect, useState } from "react";
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
import interestApi from "../../api/interestApi";

export default function Interest() {
	const [open, setOpen] = React.useState(false);
	const [images, setImages] = useState([]);
	const [imgUploaded, setImgUploaded] = useState('');
	const [title, setTitle] = useState('');
	const [isFetching, setIsFetching] = useState(false);
	//image
	const handleChangeImages = (e) => {
		try {
			const img = e.target?.files[0]
			setImages(img);
		} catch (error) {

		}
	};
	useEffect(() => {

		const upload = async () => {
			try {
				const res = await imageUpload([images]);
				if (!!res && !!res[0]?.url) {
					setImgUploaded(res[0]?.url)
				}
				console.log({ res })
			} catch (error) {

			}
		}
		upload();
	}, [images])

	useEffect(() => {
		const getInterest = async () => {
			const response = await interestApi.getAll();
			if (response) {
				console.log({ response })
			}
		}
		getInterest();
	}, [])

	const handleCreateInterest = async () => {
		try {
			const response = await interestApi.create({
				text: title,
				icon: imgUploaded
			});


			if (response) {
				console.log(response);
			} else {
			}
		} catch (error) {
			console.log(error);
		}
	}
	console.log({ images })
	return (
		<Box margin="100px 30px 0 30px">
			<Box display="flex" justifyContent="space-between" alignItems="center">
				<Box>
					<Typography variant="h5" fontWeight={500} marginBottom="15px">
						Quản lý sở thích
						<div className="brandCreate" onClick={() => setOpen(true)}>
							<Button variant="contained">Thêm sở thích</Button>
						</div>
						<Modal
							open={open}
							onClose={() => { }}
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
									name="name"
									placeholder="Nhập tên sở thích"
									onChange={(e) => setTitle(e.target.value)}
								/>
								<div className="textimage"> Ảnh Icon: </div>
								{
									imgUploaded ? <div> <img src={imgUploaded} height={30} /> <span onClick={() => setImgUploaded('')} style={{ position: 'absolute', left: 120 }}>Hủy</span></div> :
										<span className="btn-file">
											Chọn ảnh
											<input type="file" multiple onChange={handleChangeImages} />
										</span>
								}

								<div className="groupButtonBrand">
									<div onClick={() => setOpen(!open)}>
										<Button variant="contained">Hủy Tạo</Button>
									</div>
									<div>
										<Button onClick={handleCreateInterest} variant="contained">Tạo mới</Button>
									</div>
								</div>
							</Box>
						</Modal>
					</Typography>
					<Breadcrumbs aria-label="breadcrumb">
						<Typography color="inherit">Trang chủ</Typography>
						<Typography color="primary" fontWeight={500}>
							Danh sách sở thích
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
							<TableCell>Icon</TableCell>
							<TableCell>Name</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{/* {userList &&
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
              ))} */}
					</TableBody>
				</Table>
			</Box>

			<ToastContainer position="top-right" autoClose={1000} closeOnClick />
		</Box>
	);
}
