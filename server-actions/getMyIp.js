const axios = require("axios");

const getMyIp = async (r, args) => {
  const { payload } = args;
  const type = payload?.type;
  const api = type === "v4" ? "api" : "api6";
  r.logger.log("Type is: ", type);


  await r.kv.setAppValue({
    key: "test",
    value: "test-value",
    ttlInSeconds: 100000000,
  });
  const test = await r.kv.getAppValue("test");
  r.logger.log("Test is: ", test);
  const allAppValues = await r.kv.getAllAppValues();
  r.logger.log(JSON.stringify(allAppValues));
  const apiKey = await r.installationParams["apiKeySecure"];
  r.logger.log("Api key is: ", apiKey);

  const response = await axios.get(`https://${api}.ipify.org?format=json`);
  return response.data;
};

module.exports = {
  getMyIp,
};
