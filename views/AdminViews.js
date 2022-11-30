import React from 'react';

const exports = {};

exports.Wrapper = class extends React.Component {
    render() {
        const {content} = this.props;
        return (
        <div className="Admin">
            <h2>Admin Controls</h2>
            {content}
        </div>
        );
    }
}

exports.SwitchingToAdmin = class extends React.Component {
    render() {
      return (
        <div>Switching to the Admin Controls... please wait.</div>
      );
    }
}

exports.MainControl = class extends React.Component {
    
    render() {
        const {parent} = this.props;
      return (
        <div>
            <h2>What would you like to do?</h2>
            <br />
            <br />
            <button onClick={() => parent.closePoll()}>Close Poll</button>
            <br />
            <span class = "warning">Warning: This button will disable all voting, and open the results 
            page to be viewed.</span>
            <br />
            <br />
            <button onClick={() => parent.closeContract()}>Terminate Contract</button>
            <br />
            <span class = "warning">Warning: This button will close the contract, 
            and the results of the poll will no longer be viewable.</span>
        </div>
      );
    }
}

exports.MainControlPollClosed = class extends React.Component {
    render() {
        const {parent} = this.props;
      return (
        <div>
            <h2>What would you like to do?</h2>
            <br />
            <br />
            
            <button onClick={() => parent.closeContract()}>Terminate Contract</button>
            <br />
            <span class = "warning">Warning: This button will close the contract, 
            and the results of the poll will no longer be viewable.</span>
        </div>
      );
    }
}


exports.closingPoll = class extends React.Component {
    render() {
      return (
        <div>Closing the poll... please wait.</div>
      );
    }
}

exports.closingContract = class extends React.Component {
    render() {
      return (
        <div>The contract is being closed down .... please wait.</div>
      );
    }
}


exports.contractClosed = class extends React.Component {
    render() {
      return (
        <div>The contract has been terminated, and is no longer accessible.</div>
      );
    }
}

export default exports;