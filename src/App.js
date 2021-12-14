import React, { useState, useEffect } from "react";
import ItemManagerContract from "./artifacts/contracts/ItemManager.sol/ItemManager.json";
import ItemContract from "./artifacts/contracts/Item.sol/Item.json";
import {ethers} from 'ethers';

import "./App.css";

const App = () =>  {
  const [currentAccount, setCurrentAccount ] = useState(null);
  const [itemManagerContract, setItemManagerContract] = useState(null);
  const [ isLoading, setIsLoading] = useState(true);
  const [costInWei, setCostInWei ] = useState(0);
  const [itemName, setItemName ] = useState("");
  const [currentItem, setCurrentItem ] = useState({
    id: null,
    step: null,
    address: null
  })
  const ITEMMANAGER_CONTRACT_ADDRESS = "0xF1e396B9528EfBCE40Db6Ba0962EbcdF947Cb590";
  // const ITEM_CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

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
          setIsLoading(false);
          return;
        }

				const accounts = await ethereum.request({ method: 'eth_accounts' });

				if (accounts.length !== 0) {
					const account = accounts[0];
					console.log('Found an authorized account:', account);
          // toast.success('Connected!')
					setCurrentAccount(account);
          setIsLoading(false);
				} else {
					console.log('No authorized account found');
          setIsLoading(false);
				}
			}
		} catch (error) {
			console.log(error);
      setIsLoading(false);
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
      setIsLoading(false);
		} catch (error) {
			console.log(error);
      setIsLoading(false);
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
      itemManagerContractEther.on('SupplyChainStep', (index, step, address) => {
        console.log("listing ...")
      } )
      setIsLoading(false);
		} else {
			console.log('Ethereum object not found');
      setIsLoading(false);
		}
	}, []);

  const handlerSubmit = async () => {
    if (costInWei > 0 && itemName !== "" ) {
      try {
        const newItem = await itemManagerContract.createItem(itemName, costInWei);
        console.log('mining ....' , newItem);
        await newItem.wait();
        console.log('Mined' , newItem.hash);
        itemManagerContract.on('SupplyChainStep', (index, step, address) => {
          console.log(index.toNumber(), step.toNumber(), address)
          alert("Send "+costInWei+" Wei to "+address);
          setCurrentItem({
            id: index.toNumber(),
            step: step.toNumber(),
            address
          })
        } )
        setIsLoading(false);
      } catch(err) {
        console.log(err);
      }
    }
  }

  console.log(currentItem);

  return (
    <>
      <header className="App-header">
      <h2>Re-think your supply-chain</h2>
        {
          currentAccount === null ? 
          <button onClick={connectWalletAction}>Get connected</button>
          : ''
        }
        <input
          type={"number"} 
          placeholder={"Enter the cost in wei"}
          value={costInWei}
          onChange={(event) => setCostInWei(event.target.value)}
          className="inputs-form"
        />
        <input 
          placeholder={"Enter itemName"}
          value={itemName}
          onChange={(event) => setItemName(event.target.value)}
          className="inputs-form"
        />
        <button onClick={handlerSubmit} className="button">Create Item</button>
      </header>
    </>
  );
}

export default App;
