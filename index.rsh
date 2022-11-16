'reach 0.1';

const ProposalBlock = Object({
    proposal: Bytes(256),
    optionA: Bytes(256),
    optionB: Bytes(256),
    optionC: Bytes(256),
})

const getCost = function(votesA, votesB, votesC)
{
    const costA = votesA * votesA;
    const costB = votesB * votesB;
    const costC = votesC * votesC;
    
    return costA + costB + costC;    

}


export const main = Reach.App(() => {
    const Proposer = Participant('Proposer', {

        pollTime : UInt, //How long until the results are revealed         
        //proposal : [Bytes(256), Bytes(256), Bytes(256), Bytes(256)], //Set the test and 3 proposal options
        launchPoll: Fun([], Tuple(Bytes(256), Bytes(256), Bytes(256), Bytes(256))),
        
        
        closePoll : Fun([Bool], Null), // Close out the contract
        
        //voteTotal : [UInt, UInt, UInt],
        contractClosed : Bool,
        
    });

    const AdminAP = API('AdminAP', 
    {
        closePoll: Fun([], Null),
        endContract: Fun([], Null),
    });

    const Voter = API('Voter', 
    {

        vote : Fun([UInt, UInt, UInt], Null),
        seeOutcome : Fun([], Null),
        getProposal : Fun([], Null),
 //       invite : Fun([UInt], Null), //Whitelist an address for voting
        showResults : Fun([UInt, UInt, UInt], Null), //Output the vote count of the three proposals
        sendProposal : Fun([Bytes(256), Bytes(256), Bytes(256), Bytes(256)])
    });

    const Info = View('Info', {

        proposal: Tuple(Bytes(256), Bytes(256), Bytes(256), Bytes(256)),
        voteTotals: Tuple( UInt, UInt, UInt),
        
    });

    init();


    Proposer.only(() => {

        const [Proposal, ChoiceA, ChoiceB, ChoiceC] = declassify(interact.launchPoll());
        
        //const PTime = declassify(interact.pollTime);
        //const [Proposal, ChoiceA, ChoiceB, ChoiceC] = declassify(interact.proposal);
        //const wager = declassify(interact.amount);
    });

    
    Proposer.publish(Proposal, ChoiceA, ChoiceB, ChoiceC);

    Info.proposal.set([Proposal, ChoiceA, ChoiceB, ChoiceC]);

    const vMap = new Map(Bool);
    const [pollOpen, votesA, votesB, votesC, voterCount] = parallelReduce([true,0,0,0,0])
        .define(() => {Info.voteTotals.set([votesA, votesB, votesC])})
        .invariant(vMap.size() <= voterCount, "Voter Count is wrong") //use Map.sum() to add up all UInts in a map
        .while(pollOpen)        
        .api_(AdminAP.closePoll, () => {
            check (this == Proposer, "You are not the proposer");
            return[0, (ret) => {
                
                ret(null);
                return [false, votesA, votesB, votesC, voterCount];
            }];
        })
        .api_(Voter.vote, (vA, vB, vC) => {
            check(isNone(vMap[this]), "Sorry, you have already voted. Come again later to see the results.");
            return[getCost(vA, vB, vC), (ret) => {
                vMap[this] = true;
                ret(null);
                return [true, votesA + vA, votesB + vB, votesC + vC, voterCount + 1];
            }];
        });
        
        commit();

        const [contractClosed] = parallelReduce([false])
            .while(!contractClosed)
            .api_(AdminAP.endContract, () => {
                check (this == Proposer, "You are not the proposer");
                return[0, (ret) => {
                    
                    ret(null);
                    return [true];
                }];
            })
            .api_(Voter.seeOutcome, () => {
                check(isNone(vMap[this]), "Sorry, you have already voted. Come again later to see the results.");
                return[0, (ret) => {
                    
                    ret(null);
                    return [false];
                }];
            });

        transfer(balance()).to(Proposer);
        commit();
        exit();

    });
   