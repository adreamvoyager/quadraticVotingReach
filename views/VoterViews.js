import React from 'react';

const exports = {};

exports.Wrapper = class extends React.Component {
    render() {
        const {content, HeaderText} = this.props;
        return (
        <div className="Voter">
            <h2>{HeaderText}</h2>
            {content}
        </div>
        );
    }
}

exports.Attaching = class extends React.Component {
    render() {
      return (
        <div>Attaching to the contract... please wait.</div>
      );
    }
}

exports.Voting = class extends React.Component {
    render() {
      const {proposal, parent, ctc} = this.props;  
      const proposalSplit = String(proposal[1]).split(',');
      console.log(proposal[1]);
      var a = 0, b = 0, c = 0, cost = 0;
      return (
        <div>
            
            <h2>{proposalSplit[0]}</h2>            
            <br /> You can vote multiple times, but each vote will cost you more; <br />
            <br />
            1) {proposalSplit[1]} <input type='number' onChange={(e) => {a = e.currentTarget.value; 
                document.getElementById('total').textContent = (a * a) + (b * b) + (c * c);}} /> 
            <br />
            2) {proposalSplit[2]} <input type='number' onChange={(e) => {b = e.currentTarget.value;
             document.getElementById('total').textContent = (a * a) + (b * b) + (c * c);}} /> 
            <br />
            3) {proposalSplit[3]} <input type='number' onChange={(e) => {c = e.currentTarget.value;
             document.getElementById('total').textContent = (a * a) + (b * b) + (c * c);}} /> 
            <br />
            <br />
            Total Cost: <span id="total">0</span>
            <br />
            <button onClick={() => parent.vote(a, b, c, ctc)}>Submit</button>


            <script>
                    
            </script>

        </div>
      );
    }
}



exports.submittingVote = class extends React.Component {
  render() {
    return (
      <div>Please wait while the vote is being submitted.</div>
    );
  }
}


exports.VoteingComplete = class extends React.Component {
  render() {
    return (
      <div>Congradulations, you have voted. Please return later to see the results.</div>
    );
  }
}

exports.PollResults = class extends React.Component {
  render() {
    const {proposal, votes, parent, ctc} = this.props;  
    const proposalSplit = String(proposal[1]).split(',');
    const votesSplit = String(votes[1]).split(',');

    console.log(votes);
    
    return (
      <div>
          <h2>Here are the Results</h2>
          <h3>{proposalSplit[0]}</h3>            
          
          <br />
          1) {proposalSplit[1]} Total: {votesSplit[0]} 
          <br />
          
          2) {proposalSplit[2]} Total: {votesSplit[1]}
          <br />
          3) {proposalSplit[3]} Total: {votesSplit[2]}
          <br />
          <br />          
          <br />
          
          Thank you for participating in the poll.

          

      </div>
    );
  }
}


exports.NoContract = class extends React.Component {
  render() {
    return (
      <div><span class="warning">Error: You are trying to connect to a contract that doesn't exist!</span></div>
    );
  }
}

export default exports;