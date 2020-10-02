const makeRequest = async ({ endpoint, payload = {}, method = "POST" }) => {
    try {
        const { data } = await axios({
            method: method,
            url: `https://oauth2.googleapis.com/${endpoint}`,
            data: payload,
        });

        return data;
    } catch (error) {
        throw new Error(`Error making ${method} request to ${endpoint}`);
    }
};

module.exports = {
    makeRequest,
};
