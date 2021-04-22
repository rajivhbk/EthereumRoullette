import { useStoreApi } from "./storeApi";
import useWeb3 from "./useWeb3";
import { Button, TextField } from "@material-ui/core";

import "./Wallet.css";
import EthLogo from "./ethereum.png";

function Wallet() {
  const { balance, address, message, setAddress, setBalance } = useStoreApi();
  const web3 = useWeb3();

  // get user account on button click
  const getUserAccount = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        web3.eth.getAccounts().then(accounts => {
          setAddress(accounts[0]);
          updateBalance(accounts[0]); //balanceBefore
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Metamask extensions not detected!");
    }
  };

  const updateBalance = async fromAddress => {
    await web3.eth.getBalance(fromAddress).then(value => {
      setBalance(web3.utils.fromWei(value, "ether"));
    });
  };

  const sendTransaction = async e => {
    e.preventDefault();
    const amount = e.target[0].value;
    const recipient = e.target[1].value;
    await web3.eth.sendTransaction({
      from: address,
      to: recipient,
      value: web3.utils.toWei(amount, "ether")  //betting ammount
    });
    updateBalance(address);     //balanceAfter
  };

  return (
    <div className="Wallet">
      <header className="Wallet-header">
        <img src={EthLogo} className="Wallet-logo" alt="logo" />
        <p>
          <code>Send the betting amount to casino</code>
        </p>
        {address ? (
          <>
            <p> Your Account: {address}</p>
            <p> Your Balance: {balance} </p>
          </>
        ) : null}
        <Button
          onClick={() => getUserAccount()}
          variant="outlined"
          color="primary"
        >
          Connect your wallet
        </Button>
        {message ? (
          <p>
            <code>{message}</code>
          </p>
        ) : null}
        <form onSubmit={e => sendTransaction(e)}>
          <TextField
            required
            label="Amount"
            inputProps={{ step: "any" }}
            type="number"
            variant="filled"
          />
          <TextField required label="Recipient Address" variant="filled" />
          <Button
            style={{ margin: "10px" }}
            type="submit"
            variant="outlined"
            color="default"
          >
            Send Crypto
          </Button>
        </form>
      </header>
    </div>
  );
}

export default Wallet;
