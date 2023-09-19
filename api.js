const ethers = require('ethers');
const axios = require('axios');
const {getTokenSupply}=require('./totalSupply')
const {erc20Abi}=require('./abis')
const apiKey = 'N1T366MJ266A3AJH7BSZDZJNSTDUA239SI'; // Replace with your Etherscan API key
const walletAddress = '0x450d81a9979CF62A51a4e8a16635E0837a574472';
const providerUrl= 'https://eth-mainnet.g.alchemy.com/v2/t_3Q19UpuJyP_x4QdEGEfQdUjaYJvsP6';
const provider2 = new ethers.providers.JsonRpcProvider(providerUrl);
async function getTransactionHashes() {
  let provider = new ethers.providers.EtherscanProvider('sepolia', apiKey);


  // Fetch transaction history for the wallet address
  const transactions = await provider.getHistory(walletAddress);
 
  
    for (const transaction of transactions) {
        const transactionHash = transaction.hash;
        console.log(`transaction hash : ${transactionHash}`)
        
       
        try {
            
            const options = {
                method: 'GET',
                //just for testing 
                url: `https://api.syve.ai/v1/filter-api/prices_usd?eq:transaction_hash=0xf4e335d487dd8ee1674a759d1cd9cefe6fc06ba17884a730dc1b5d7525ce09eb`
                //uncomment this to run actual hashes
                //url: `https://api.syve.ai/v1/filter-api/prices_usd?eq:transaction_hash=${transactionHash}`

              };
 
              await axios
                .request(options)
                .then(function (response) {
                  

                 let oneTokenPrice=response.data[0].price_token_usd_tick_1;
                 let blockNumber=response.data[0].block_number;
                  
                  console.log(`Token symbol: ${response.data[0].token_symbol}`);
                  console.log(`Token name: ${response.data[0].token_name}`);
                  console.log(`Token price at time of trade : $${oneTokenPrice}`);
                  let tokenContractAddress=response.data[0].token_address;
                  
                
                  getMarketcap(tokenContractAddress,oneTokenPrice,blockNumber)
                
                 
                }
                
                )

              


              
        } catch (error) {
          console.error(error);
        }
}
  
  return transactions;
}
async function getMarketcap(tokenContractAddress,oneTokenPrice,blockNumber){
    
    const tokenContract = new ethers.Contract(tokenContractAddress, erc20Abi, provider2);
    //const totalSupply = await tokenContract.totalSupply();
   // const supplyInt=totalSupply.toString();
    const totalSupply=await getTokenSupply(tokenContractAddress,blockNumber,apiKey)
    console.log(totalSupply)
    const marketcap=totalSupply*oneTokenPrice;
    // console.log(supplyInt)
    console.log(`Token marketcap: ${marketcap}`);
    }


  


(async () => {
  try {
    const transactions = await getTransactionHashes();
    
   
  } catch (error) {
    console.error('Error:', error);
  }
})();




