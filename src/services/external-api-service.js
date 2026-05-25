import axios from "axios";

export const callExternalApi = async (options) => {
    const response = await axios(options.config);
    const { data } = response;
    return data;
};