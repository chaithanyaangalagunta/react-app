// https://freeipapi.com/api/json/${ipAddress}

const axios = require("axios");

const getMyLocation = async (r,args) => {
  const { context, payload } = args;
  const ipAddress = payload?.ipAddress;
  const response = await axios.get(
    `https://freeipapi.com/api/json/${ipAddress}`
  );
  return response.data;
};

module.exports = {
  getMyLocation,
};
