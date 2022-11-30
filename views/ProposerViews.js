import React from 'react';

//from https://stackoverflow.com/questions/34424845/adding-script-tag-to-react-jsx



//import qrcodejs from '../js/qrcode.js';
//import jquery from '../js/jquery.min.js';
//jquery();
//qrcodejs();


const exports = {};

exports.Wrapper = class extends React.Component {
    render() {
        const {content} = this.props;
        return (
        <div className="Proposer">
            <h2>Proposer</h2>
            {content}
        </div>
        );
    }
}

exports.Deploying = class extends React.Component {
    render() {
      return (
        <div>Deploying... please wait.</div>
      );
    }
}

exports.LaunchPoll = class extends React.Component {
    render()
    {
        const {parent} = this.props;
        var proposal;
        var a;
        var b;
        var c;
        return(
            <div>
                What is the proposal?
                <br />
                <input
                    type='text'                    
                    onChange={(e) => {proposal = e.currentTarget.value}}
                />
                <br /><br />
                What is the first option?
                <br />
                <input
                    type='text'                    
                    onChange={(e) => {a = e.currentTarget.value}}
                />
                <br /><br />
                What is the second option?
                <br />
                <input
                    type='text'                    
                    onChange={(e) => {b = e.currentTarget.value}}
                />
                <br /><br />
                What is the third option?
                <br />
                <input
                    type='text'                    
                    onChange={(e) => {c = e.currentTarget.value}}
                />
                <br /><br />
                <button onClick={() => parent.setProposal(`${proposal},${a},${b},${c}`)}>Submit</button>
                
            </div>
        );
    }

}

exports.ProposalSubmited = class extends React.Component {
    
    render() {
        
        const {ctcInfoStr} = this.props;
        const splitCtc = String(ctcInfoStr).split("\"");
        const url = "localhost:3000/?contract=" + splitCtc[7];
        
        console.log(ctcInfoStr);
        console.log(url);
        
        return (
          <div>The proposal has been submitted.
            <br />
            <br />
            <br />

            Send this link to your voters, they can visit the link to vote on the proposal.
            <br />
            If you click the link, and are logged into this Account, you can access the admin controls.
            <br />
            This will allow you to close the poll and reveal the results, as well as end the contract.
            <br />
             link: <a href={url}>{url}</a>
          </div>
          
        );
      }
}


export default exports;