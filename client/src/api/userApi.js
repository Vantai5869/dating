import axiosClient from "./axiosClient";

const userApi = {
  login(data) {
    const url = "auth/login";
    return axiosClient.post(url, data);
  },
  activeUser(data) {
    const url = "auth/active";
    return axiosClient.post(url, data);
  },
  getAll(p=null) {
    const url = "users/";
    return axiosClient.get(url,p);
  },
};

export default userApi;
