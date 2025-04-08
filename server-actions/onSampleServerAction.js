const axios = require("axios");

const fullName = (user) => {
  return user?.firstName ?? "" + " " + user?.lastName ?? "";
};

module.exports = {
  run: async (args) => {
    const { context, payload } = args;
    console.log("Trying for user: " + fullName(context?.user));
    const id = Math.floor(Math.random() * 100) + 1;
    console.log("Id is: " + id);

    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/todos/${id}`
    );
    console.log({ response: response?.data });
    return response?.data;
  },
};
