import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAbi, contractAddress } from '../constants/constant';
import Login from '../components/Login';
import Connected from '../components/connected';
 
import './App.css'

function App()
{
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);

  useEffect(() =>
  {
    if (window.ethereum)
    {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () =>
    {
      if (window.ethereum)
      {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    }
  })

  async function getCurrentStatus()
  {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress, contractAbi, signer
    );
    const status = await contractInstance.getVotingStatus();
    setVotingStatus(status);
  }

  async function setRemainingTime()
  {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress, contractAbi, signer
    );
    const status = await contractInstance.getVotingStatus();
    setVotingStatus(status);
  }

  function handleAccountsChanged(accounts)
  {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
    } else
    {
      setIsConnected(false);
      setAccount(null);
    }
  }

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
        setAccount(address);
        console.log("Wallet Account Connected: " + address);
        setIsConnected(true);

      } catch (err)
      {
        console.error(err);
      }
    } else
    {
      console.error("Wallet is not detected in the browser!")
    }
  }

  return (
    <div className='App'>
      {isConnected ? (<Connected account={account} />) : (<Login connectWallet={connectToWallet} />)}
      
    </div>
  )
}

export default App
