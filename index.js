import React from 'react';
import useScript from './hooks/useScript';
import AppViews from './views/AppViews.js';
import ProposerViews from './views/ProposerViews.js';
import VoterViews from './views/VoterViews.js';
import AdminViews from './views/AdminViews.js';
import {renderDOM, renderView} from './views/render';
import './index.css';
import * as backend from './build/index.main.mjs';
import { loadStdlib } from '@reach-sh/stdlib';
import { ALGO_MyAlgoConnect as MyAlgoConnect } from '@reach-sh/stdlib';

const reach = loadStdlib(process.env)

reach.setWalletFallback(reach.walletFallback({
    providerEnv: 'TestNet', MyAlgoConnect }));

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);



class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {view: 'ConnectAccount'};
    }
    async componentDidMount() {
        const acc = await reach.getDefaultAccount();
        const balAtomic = await reach.balanceOf(acc);
        const bal = reach.formatCurrency(balAtomic, 4);
        let contractInfo = "";
        if (urlParams.has("contract"))
        {
            contractInfo = urlParams.get("contract");
            console.log("Attaching to contract");
        }
        console.log(contractInfo);

        this.setState({acc, bal, contractInfo});        
        if (contractInfo == "")
        {
            this.setState({view: 'Wrapper', ContentView: Proposer}); 
        }
        else
        {
            const HeaderText = 'Attaching'
            this.setState({HeaderText});
            this.setState({view: 'Wrapper', ContentView: Voter, HeaderText});
        }
      }

      
      
      render() { return renderView(this, AppViews); }
}

class Proposer extends React.Component
{
    constructor(props)
    {
        super(props);    
        console.log("Starting Proposer constructor");
        this.state = {view: 'Deploying'};
            
    }

    async componentDidMount() {
       
        /*
        const jscript = document.createElement("script");
        jscript.src = "../js/jquery.min.js";
        jscript.async = true;
        document.body.appendChild(jscript);

        const qscript = document.createElement("script");
        qscript.src = "../js/qrcode.js";
        qscript.async = true;
        document.body.appendChild(qscript);
        */

        console.log("starting deploy function");
        const ctc = this.props.acc.contract(backend);
        
        backend.Proposer(ctc, this);
        const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
        const parent = this;
        this.setState({ctc, ctcInfoStr, parent});    
        console.log("Deploy finish");
            
    }

    async launchPoll() 
    {
        //useScript("../jquery.min.js");
        //useScript("../qrcode.js");
        console.log("launching poll");
        const proposal = await new Promise(resolveProposal => {
            this.setState({view: 'LaunchPoll', resolveProposal});
        });
        this.setState({view: 'ProposalSubmited', proposal});
        const prop = proposal.split(",");

        return [prop[0], prop[1], prop[2], prop[3]];
    }

    setProposal(proposal) {this.state.resolveProposal(proposal);}

    render() { return renderView(this, ProposerViews); }
}

class Voter extends React.Component
{
    constructor(props)
    {
        super(props);    
        console.log("Starting Proposer constructor");
        this.state = {view: 'Attaching'};
            
    }

    async componentDidMount() 
    {
        const contractInfoFormatted =`{ "type" : "BigNumber", "hex" : "${this.props.contractInfo}" }`;
        
        console.log("starting attach function");
        
        
        const ctc = this.props.acc.contract(backend, JSON.parse(contractInfoFormatted));    
        
        
        
        
        const parent = this;
        this.setState({ctc, parent});    
        console.log("Attach finished");

        console.log(this.props);
        console.log(ctc);
        console.log("Getting proposal");
        
        var isAdmin = null;
        try {
            isAdmin = await ctc.apis.Voter.checkIfAdmin();
        } catch (error) {
            this.setState({view: 'NoContract'});
            return;
        }
        console.log(isAdmin);

        if (isAdmin)
        {
            console.log("Setting up admin");
            this.setState({view: 'Wrapper', ContentView: Admin}); 
        }
        else
        {
            
            const proposal = await ctc.v.Info.proposal();
            console.log(proposal);

            const pollOpen = await ctc.v.Info.pollOpen();
            if (pollOpen[1])
            {
                const hasVoted = await ctc.apis.Voter.checkIfVoted();
                if (hasVoted)                
                    this.setState({view: 'VoteingComplete'});                
                else
                    this.setState({view: 'Voting', proposal});
            }
            else
            {
                
                const votes = await ctc.v.Info.voteTotals();
                this.setState({view: 'PollResults', proposal, votes})
            }

        }
        
    }

    async vote(a, b, c, ctc)
    {
        this.setState({view: 'submittingVote'});
        await ctc.apis.Voter.vote(a, b, c);
        this.setState({view: 'VoteingComplete'});
    }

    render() { return renderView(this, VoterViews); }
}

class Admin extends React.Component
{
    constructor(props)
    {
        super(props);
        console.log("Admin constructor");
        this.state = {view: 'SwitchingToAdmin'};

    }

    async componentDidMount() 
    {
        const parent = this;
        
        const pollOpen = await this.props.ctc.v.Info.pollOpen();
        console.log(pollOpen);
        if (pollOpen[1])
        {
            this.setState({view: 'MainControl', parent});
        }
        else
        {
            this.setState({view: 'MainControlPollClosed', parent});
        }

    }

    async closePoll()
    {
        this.setState({view: 'closingPoll'});
        await this.props.ctc.apis.AdminAP.closePoll();
        this.setState({view: 'MainControlPollClosed', parent});
    }

    async closeContract()
    {
        this.setState({view: 'closingContract'});
        await this.props.ctc.apis.AdminAP.endContract();
        this.setState({view: 'contractClosed'});
    }


    render() { return renderView(this, AdminViews); }


}

renderDOM(<App />);