import {ask, loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib();

const startingBalance = stdlib.parseCurrency(1000);

const ROLE = ['Proposer', 'Admin', 'Voter' ];

const isAttaching = await ask.ask(
    'Are you attaching to an existing contract?',
    ask.yesno
);



let role = null;
if (!isAttaching)
{
    role = ROLE[0];
}
let account = null;

const createAcc = await ask.ask(
    'Would you like to create an account? (devnet only)',
    ask.yesno
);

if (createAcc)
{
    console.log("Creating an account");
    account = await stdlib.newTestAccount(stdlib.parseCurrency(1000));
    console.log("account created");
}
else
{

    const secret = await ask.ask(
        'What is your account secret?',
        (x => x)
    );
    account = await stdlib.newAccountFromSecret(secret);

}

let contract = null;
if (role == 'Proposer')
{
    contract = account.contract(backend);
    contract.getInfo().then((info) => {
        console.log((`The contract is deployed as = ${JSON.stringify(info)}`))
    });
}
else
{
    const info = await ask.ask(
        'Please past the contract info to vote: ',
        JSON.parse
    );
    contract = account.contract(backend, info);
    //add check is account is Proposer here

    //find out if the attacher is an admin. The final version will check if the address matches the
    //proposer
    const isAdmin = await ask.ask( 
        'Are you an admin?',
        ask.yesno
    );
    if (isAdmin)
        role=ROLE[1];
    else
        role=ROLE[2]; //set role to voter
}
const fmt = (x) => stdlib.formatCurrency(x, 4);
const getBalance = async () => fmt(await stdlib.balanceOf(account));
const before = await getBalance();
console.log(`Your balance is ${before}`);
const interact = {...stdlib.hasRandom };

//This freezes the program
//const pollOpen = await contract.v.Info.pollOpen();
//console.log(pollOpen);
if (role == 'Proposer') /*&& pollOpen)*/
{
    
    interact.launchPoll = async () => 
    {
        const proposal = await ask.ask(
            `What is the proposal?`,
            (x => x)
        );
        const OptionA = await ask.ask(
            `What is the first option?`,
            (x => x)
        );
        const OptionB = await ask.ask(
            `What is the second option?`,
            (x => x)
        );
        const OptionC = await ask.ask(
            `What is the third option?`,
            (x => x)

            

        );
        role = 'Admin';
        //This works
        //const pollOpen = await contract.v.Info.pollOpen();
        //console.log(pollOpen);
        console.log("Transferring proposals to contract");        
        return [proposal, OptionA, OptionB, OptionC];
       
    }


}
else if (role == 'Admin')
{
    console.log("you are an admin");

    const pollIsOpen = await contract.v.Info.pollOpen();

    if (pollIsOpen[1])
    {
        const pollClosed = await ask.ask(
            "Would you like to close the poll?",
            ask.yesno
        );

        if (pollClosed)
        {
            await contract.apis.AdminAP.closePoll();
        }
    }
    else
    {
        const contractClosed = await ask.ask(
            "Would you like to close the contract?",
            ask.yesno
        );

        if (contractClosed)
        {
            await contract.apis.AdminAP.endContract();
        } 
    }
}
else if (role == 'Voter')
{
    console.log("You are a voter");

    const pollIsOpen = await contract.v.Info.pollOpen();

    

    if (!pollIsOpen[1])
    {
        const voteCount = await contract.v.Info.voteTotals();
        console.log("The vote count is: " + voteCount);
    }
    else
    {

       
        const pollInfo = await contract.v.Info.proposal();
        
        let pInfo = String(pollInfo[1]).split(',');
        
        console.log("\n\nThe proposal is: \n");
        console.log(pInfo[0] + "\n");
        console.log("A: " + pInfo[1]);
        console.log("B: " + pInfo[2]);
        console.log("C: " + pInfo[3]);
        
        const Vote = await ask.ask(
            `Which option do you vote for?`,
            (x => x)

            

        );
        switch (Vote)
        {
            case "A":
                await contract.apis.Voter.vote(1, 0, 0);
                break;
            case "B":
                await contract.apis.Voter.vote(0, 1, 0);
                break;
            case "C":
                await contract.apis.Voter.vote(0, 0, 1);
                break;
        }
    }
    
}
else
{
    console.log(role);
    console.log("we don't know what you are.");
}
console.log("lower code starts here");



/*
}
else
{
    if (!interact.proposal)
    {
        console.log("There are no proposals right now. Please return later.")
    }
    else
    {
        let voteComplete = false;
        while (!voteComplete)
        {
            console.log(interact.proposal);
            console.log('A:' + interact.OptionA);
            console.log('B:' + interact.OptionB);
            console.log('C:' + interact.OptionC);
            const choice = await ask.ask(
                `Please select the letter to make a vote.`,
                (x => x)
            );
            
            const selection = choice.toUpperCase();
            if (selection == 'A' || selection == 'B' || selection == 'C')
            {


                voteComplete = true;
            }
        }

        
    }
}
*/
console.log("determining part");
const part = (role == 'Proposer') ? contract.p.Proposer : contract.apis.Voter;
console.log(part);
await part(interact);

ask.done(); 
//await Promise.all([
//]);