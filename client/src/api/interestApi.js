import axiosClient from "./axiosClient";

const interestApi = {
  getAll(p = null) {
    const url = "interests/";
    return axiosClient.get(url, p);
  },
  create() {
    const url = "interests/";
    return axiosClient.post(url, p);
  },
  delete(id) {
    const url = `interests/${id}`;
    return axiosClient.delete(url, id);
  },
};

export default interestApi;
