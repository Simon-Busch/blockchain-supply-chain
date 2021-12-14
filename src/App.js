import React, { useState, useEffect } from "react";
import ItemManagerContract from "./contracts/ItemManager.json";
import ItemContract from "./contracts/Item.json";
import getWeb3 from "./getWeb3";
import "./App.css";

const App = () =>  {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts ] = useState(null);
  const [contract, setContract ] = useState(null);
  const [storageValue, setStorageValue ] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const runExample = async (contract, accounts) => {
    // Stores a given value, 5 by default.
    await contract.methods.createItem("test", 1000).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    setStorageValue(response);
  };

  useEffect(() => {
    const initialFetch = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
  
        // Use web3 to get the user's accounts.
        const AccountList = await web3.eth.getAccounts();
  
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = ItemManagerContract.networks[networkId];
        const instance = new web3.eth.Contract(
          ItemManagerContract.abi,
          deployedNetwork && deployedNetwork.address,
        );
        
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setWeb3(web3);
        setAccounts(AccountList);
        setContract(instance);
        runExample(instance, AccountList);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    };
    initialFetch();
  }, [])


  return (
    <>
      {
        (web3 === null) ? 
        <div>Loading Web3, accounts, and contract...</div>
        :
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {storageValue}</div>
      </div>

      }
    </>
  );
}

export default App;
