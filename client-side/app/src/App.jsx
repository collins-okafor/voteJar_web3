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
  const [remainingTime, setRemainingTime] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState('');
  const [CanVote, setCanVote] = useState(true);

  useEffect(() =>
  {
    getCandidates();
    getRemainingTime();
    getCurrentStatus();
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

  async function vote()
  {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress, contractAbi, signer
    );

    const transaction = await contractInstance.vote(number);
    await transaction.wait();
    canVote();
  }

  async function canVote()
  {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress, contractAbi, signer
    );
    const voteStatus = await contractInstance.voters(await signer.getAddress());
    setCanVote(voteStatus);
  }

  async function getCandidates()
  {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress, contractAbi, signer
    );
    const candidatesList = await contractInstance.getAllVotesOfCandiates();
    const formattedCandidates = candidatesList.map((candidate, index) =>
    {
      return {
        index: index,
        name: candidate.name,
        voteCount: candidate.voteCount.toNumber()
      }
    });
    setCandidates(formattedCandidates);
  }

  async function getCurrentStatus()
  {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress, contractAbi, signer
    );
    const status = await contractInstance.getVotingStatus();
    console.log(status);
    setVotingStatus(status);
  }

  async function getRemainingTime()
  {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress, contractAbi, signer
    );
    const time = await contractInstance.getRemainingTime();
    setRemainingTime(parseInt(time, 16));
  }

  function handleAccountsChanged(accounts)
  {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      canVote();
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
        canVote();
      } catch (err)
      {
        console.error(err);
      }
    } else
    {
      console.error("Wallet is not detected in the browser!")
    }
  }

  async function handleNumberChange(e)
  {
    setNumber(e.target.value);
  }

  return (
    <div className='App'>
      {isConnected ? (<Connected
        account={account}
        candidates={candidates}
        remainingTime={remainingTime}
        number={number}
        handleNumberChange={handleNumberChange} />) : (<Login connectWallet={connectToWallet} />)}
      
    </div>
  )
}

export default App
