import React, { useState, useEffect } from "react";
import ItemManagerContract from "./artifacts/contracts/ItemManager.sol/ItemManager.json";
import ItemContract from "./artifacts/contracts/Item.sol/Item.json";
import {ethers} from 'ethers';

import "./App.css";

const App = () =>  {
  const [currentAccount, setCurrentAccount ] = useState(null);
  const [itemManagerContract, setItemManagerContract] = useState(null);
  const [itemContract, setItemContract ] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const ITEMMANAGER_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const ITEM_CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

	const checkIfWalletIsConnected = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				console.log('Make sure you have MetaMask!');
				setIsLoading(false);
				return;
			} else {
				console.log('We have the ethereum object', ethereum);
        
        let chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log("Connected to chain " + chainId);
        // String, hex code of the chainId of the Rinkebey test network
        const rinkebyChainId = "0x4"; 
        if (chainId !== rinkebyChainId) {
          alert("You are not connected to the Rinkeby Test Network!");
          return;
        }

				const accounts = await ethereum.request({ method: 'eth_accounts' });

				if (accounts.length !== 0) {
					const account = accounts[0];
					console.log('Found an authorized account:', account);
          // toast.success('Connected!')
					setCurrentAccount(account);
				} else {
					console.log('No authorized account found');
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	const connectWalletAction = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert('Get MetaMask!');
				return;
			}
      

			const accounts = await ethereum.request({
				method: 'eth_requestAccounts'
			});
      // toast.success('Connection established!')
			console.log('Connected', accounts[0]);
			setCurrentAccount(accounts[0]);
		} catch (error) {
			console.log(error);
		}
	};

  useEffect(() => {
		checkIfWalletIsConnected();
		setIsLoading(false);
	}, []);

  useEffect(() => {
		const { ethereum } = window;

		if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const itemManagerContractEther = new ethers.Contract(ITEMMANAGER_CONTRACT_ADDRESS, ItemManagerContract.abi, signer);
			setItemManagerContract(itemManagerContractEther);

      const itemContractEther = new ethers.Contract(ITEM_CONTRACT_ADDRESS, ItemContract.abi, signer);
			setItemContract(itemContractEther);
		} else {
			console.log('Ethereum object not found');
		}
	}, []);


  return (
    <>
      <h2>hello</h2>
    </>
  );
}

export default App;
