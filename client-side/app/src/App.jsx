import { useState, useEffect } from 'react';
import { SocketProvider, ethers } from 'ethers';
import { contractAbi, contractAddress } from '../constants/constant';
import Login from '../components/Login';
 
import './App.css'

function App()
{
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected]


  async function connectToWallet()
  {
    if (window.ethereum)
    {
      try
      {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log("Wallet Account Connected: " + address);

      } catch (err)
      {
        console.error(err);
      }
    } else
    {
      
    }
  }

  return (
    <div className='App'>
     <Login />
    </div>
  )
}

export default App
