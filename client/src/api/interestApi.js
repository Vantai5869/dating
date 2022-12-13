import axiosClient from "./axiosClient";

const interestApi = {
  getAll() {
    const url = "interests/";
    return axiosClient.get(url);
  },
  create(data) {
    const url = "interests/";
    return axiosClient.post(url, data);
  },
  delete(id) {
    const url = `interests/${id}`;
    return axiosClient.delete(url, id);
  },
};

export default interestApi;
