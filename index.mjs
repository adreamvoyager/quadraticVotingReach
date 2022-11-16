import {ask, loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib();

const startingBalance = stdlib.parseCurrency(1000);


const isVoter = await ask.ask(
    'Are you a voter?',
    ask.yesno
);

const who = isVoter ? 'Voter' : 'Proposer';
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
if (!isVoter)
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
}

const fmt = (x) => stdlib.formatCurrency(x, 4);
const getBalance = async () => fmt(await stdlib.balanceOf(account));
const before = await getBalance();
console.log(`Your balance is ${before}`);
const interact = {...stdlib.hasRandom };

await launchPoll()
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
    console.log("Transferring proposals to contract");
    //interact.proposal = proposal;
    //interact.OptionA = OptionA;
    //interact.OptionB = OptionB;
    //interact.OptionC = OptionC;
    return {proposal, OptionA, OptionB, OptionC};
    //console.log("transfer complete");
    //interact.pollClosed = false;
}

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
const part = isVoter ? contract.p.Voter : contract.p.Proposer;
part(interact);

ask.done(); 
//await Promise.all([
//]);