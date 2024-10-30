import axios from "axios";

//this is an example service file



export const getTitle = () => {
  try {
    return axios.get(`${process.env.REACT_APP_TITLE_BASE_URL}/title`);
  } catch (error) {
    return error;
  }
};
