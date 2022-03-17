const initAPI = (apiEndpoint) => {
  return async (endpoint) => {
    const url = `${apiEndpoint}/${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  };
};

export default initAPI;
