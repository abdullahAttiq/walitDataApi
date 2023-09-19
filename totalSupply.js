const axios = require('axios');

async function getTokenSupply(contractAddress, blockNumber, apiKey) {
  try {
    // Define the API URL
    const apiUrl = 'https://api.etherscan.io/api';

    // Define the API parameters
    const params = {
      module: 'stats',
      action: 'tokensupplyhistory',
      contractaddress: contractAddress,
      blockno: blockNumber,
      apikey: apiKey,
    };

    
    const response = await axios.get(apiUrl, { params });

    const data = response.data;
    if (data.status === '1') {
      
      const tokenSupplyHistory = data.result;
      return tokenSupplyHistory;
    } else {
     
      throw new Error(`Error: ${data.message}`);
    }
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
}

module.exports = {
  getTokenSupply,
};

// Usage example:
// const contractAddress = '0x57d90b64a1a57749b0f932f1a3395792e12e7055';
// const blockNumber = 8000000;
// const apiKey = 'YourApiKeyToken';

// getTokenSupply(contractAddress, blockNumber, apiKey)
//   .then((tokenSupply) => {
//     console.log('Token Supply History:', tokenSupply);
//   })
//   .catch((error) => {
//     console.error(error);
//   });
