import React, { Component } from "react";
import UserService from "../services/user.service";
import Web3 from "web3";
import RouletteContract from '../contracts/Roulette.json';
import Countdown from 'react-countdown';

import Board from './board.js'
import './board.css'
import Navbar from './Navbar';
import Wheeel from './Wheeel';
import { MdLaptopWindows } from "react-icons/md";

import { ROU_ABI, ROU_ADDRESS } from '../config'

export default class BoardUser extends Component {

    // loads web3 and interacts with contract
    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
        await this.getBettingClosed();

    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentUserProvider)
        }
        else {
            window.alert('non-Ethereum browser detected.')
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        console.log("Metamask Accoount loaded: " + accounts)
        this.setState({ account: accounts[0]})
        // Getting the account balance
        let balance = await web3.eth.getBalance(accounts[0]);
        let balanceth = await web3.utils.fromWei(balance,'ether');
        console.log("Your Balance is: " + balanceth)
        this.setState({ balance: balanceth})
        // connects with connected contract
        const rou = new web3.eth.Contract(ROU_ABI, ROU_ADDRESS)
        this.setState({ rou })
        this.setState({ loading: false})
        console.log(rou)
        
    }

    PlaceBet() {
        const web3 = window.web3
        this.state.bets = window.BETS_ARRAY;
        this.state.totalBetAmmount = window.BETS_TOTAL;
        console.log(this.state.bets)
        console.log("TOTAL AMOUNT BET: " + this.state.totalBetAmmount)
        this.state.rou.methods.placeBet(this.state.bets).send({from: this.state.account, value: this.state.totalBetAmmount})
            .then(function(receipt){
                console.log(receipt);
            });
    };



    async getBettingClosed() {
        if (this.state.getBetCloseRunning === false) {
            console.log("running getBettingClosed")
            this.state.getBetCloseRunning = true;
            this.state.rou.once('bettingPhaseClosed', { fromBlock: this.state.lastBlock },
                function (error, event) {

                    if (event != null) {
                        console.log(event);
                        this.setState({lastBlock: event.blockNmuber});
                        Wheeel.handleSpinClick();
                    }

                    this.setState({getBetOpenRunning: false});
                    this.setState({ bettingPhase: false });
                    this.getBettingOpen();
                })
        }
    }




    async getBettingOpen() {
        if (this.state.getBetOpenRunning === false) {
            console.log("running getBettingOpen")
            this.setState({getBetOpenRunning: true});
            this.state.rou.once('bettingPhaseOpen', { fromBlock: this.lastBlock },
                function (error, event) {
                    if (event != null) {
                        console.log(event);
                        // this.lastBlock = event.blockNmuber;
                        // this.setState({lastBlock: event.blockNmuber});
                    }
                    this.setState({getBetCloseRunning: false});
                    this.setState({ bettingPhase: true });
                    this.getBettingClosed();
                })
        }
    }

    constructor(props) {
        super(props);

        this.getBettingClosed = this.getBettingClosed.bind(this);
        this.getBettingOpen = this.getBettingOpen.bind(this);
        this.state = {
            account: '',
            rou: null,
            getBetCloseRunning: false,
            getBetOpenRunning: true,
            bettingPhase: false,
            bets: [], // array to keep track of bets ie. [[100,1,2,3,4],[100,20],[100,1,2,3,4,5,6,7,8,9,10,11,12]]
            totalBetAmmount: 0, // stores the bet ammount
            playerBalance: 0
        };

        this.PlaceBet = this.PlaceBet.bind(this);
    }

    componentDidMount = async () => {
        UserService.getUserBoard().then(
            response => {
                this.setState({
                    content: response.data
                });
            },
            error => {
                this.setState({
                    content:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString()
                });
            });
    }


  render() {
    const Completionist = () => <span className="bet-status-msg">Betting closed</span>;
 
    // Renderer callback with condition
    const renderer = ({ minutes, seconds, completed }) => {
      if (completed) {
        // Render a completed state
        return <Completionist />;
      } else {
        // Render a countdown
        return <span>{minutes}:{seconds < 10 ? `0${ seconds }` : seconds}</span>;
      }
    };
    
    // const { rou } = this.state;
    return (
        <div className="main">
            <Navbar account = {this.state.account} />  
            
            <div className="auth-wrapper">
                <div className="content">
                    <div className="auth-inner-2" style={{position: 'fixed', left: '50%', top: '57%',transform: 'translate(-50%, -50%)'}}>
                        <div className="flex-container">
                            <div className="flex-child spin">
                                <Wheeel />
                            </div>
                            <div className="flex-child bet-table">
                                <div className="bet-status">
                                    <h3><strong>Time remaining:</strong> <Countdown date={Date.now() + 120000} renderer={renderer}/></h3>
                                </div>
                                <div>
                                    <Board/>
                                </div>
                                <div className="betting-action flex-container">
                                    <div className=" display-bets">
                                        <strong>Your bets:</strong>
                                        <div className="bets overflow-scroll" id='bets'></div>
                                        <div id='balance'><strong>Balance:</strong> {this.state.balance} ETH</div>
                                        <div id='result'></div>
                                    </div>
                                    <div>
                                        <button type="button" className="reset-btn btn btn-danger btn-block" >Reset</button>
                                        <button type="button" className="place-btn btn btn-danger btn-block" onClick={this.PlaceBet}>Place bet</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );}
}