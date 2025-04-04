import api from "./api";
//The "..." API service:

/**
 * The main list of basic info
 * @param props currently generate the data (currently permanently "usd")
 * @returns the response data
 */
export const getRoomsList = async (params: object) => {
    const data = await api.get("/coins/markets", { params: params });
    // console.log(data.data);
    return data;
};

/**
 * More Information per ID
 * @param props pathParams - the ID requested. queryParams - the history range. Made to change upon user change selection.
 * @returns the response data
 */
export const getRoomsInfoById = async (params: object, pathParams: string) => {
    const data = await api.get(`/coins/${pathParams}/market_chart`, { params: params });
    // console.log(data.data);
    return data;
};
