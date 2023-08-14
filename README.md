# Lesson 12 - Tokenized Votes

## Weekend Project

This is a group activity for at least 3 students:
* Complete the contracts together
* Develop and run scripts for “TokenizedBallot.sol” within your group to give voting tokens, delegating voting power, casting votes, checking vote power and querying results
* Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed
* Share your code in a github repo in the submission form


---

## Report

1. We start by deploying the ERC20 contract, using the address 0x1121A584c4CdB01753F030e0b50FAC9475b503DD, and in this case the contract deployed has address 0x208F75C3A395Ad125D0D641D9a2648F837a58538:

> Transaction: https://sepolia.etherscan.io/tx/0xebd789f0cea5fe8afe0eb06ace277f40af20d41e30daaf154da2920f1bede826

2. Then we need to mint tokens:

> Transaction: https://sepolia.etherscan.io/tx/0x471d1d5efb4aeba0b33ef63ece218fddee2557186549f0c24945ff7824870777

3. I used a second dummy account (0x1d4beb1fCd58F36243c2A1dEafEfCa15bCEA4819) so I could test transfering tokens to, in this case I sent 1/5th of the total amount, but I've changed it to 1/3 in the script.

> Transaction: https://sepolia.etherscan.io/tx/0x039dcc51af5387cf695ec18ed3e6f733c2f0c94d5918ea051adbe86f1da8c141

4. Now that we've done all that, we can deploy the tokenized ballot, which requires the variable targetBlockNumber. After a few tests returning a future lookup error, Antony mentioned that we needed it to do it in the mentioned order. When deploying the tokenized ballot, I used targetBlockNumber = 4083637 which is the last block number from the previous transfers. I also initialized it with three proposals: "monday best day", "friday best day" and "sunday best day". The tokenized ballot address is the following: 0x83611D5d1E4efc8c74B86090aA9CD304889d854a 

> Transaction: https://sepolia.etherscan.io/tx/0x4e92e90a0a822125cc953fa6d3ef93c826d0c0cd6df358d4eab2efecfb74d28d

5. Next we can vote for proposals:

> Transaction: https://sepolia.etherscan.io/tx/0xb3a37656377d44f13447d4e06d53a86e525091d843ccf42f81dbedc157209cb0
> Transaction: https://sepolia.etherscan.io/tx/0xcdea623544fefa058eeaa856f365e8a536ffc1926a3ebf49d09cc3eaaf5c57c9

6. Added script `06-check-my-token-balance.ts` to check the token balance of an account:
- Account 0x1121A584c4CdB01753F030e0b50FAC9475b503DD has 600000000000000000 units of VTK.
- Account 0x1d4beb1fCd58F36243c2A1dEafEfCa15bCEA4819 has 200000000000000000 units of VTK.

7. Added script `07-check-voting-power-spent` to check the voting power spent of an account:
- Account 0x1121A584c4CdB01753F030e0b50FAC9475b503DD 0n
- Account 0x1d4beb1fCd58F36243c2A1dEafEfCa15bCEA4819 0n
- Account 0x4275ABc88C150d1ce20817BE7B594dfeB6A9d70E 0n

8. Added script `08-check-vote-balance` to check the vote balance of an account:
- Account 0x1121A584c4CdB01753F030e0b50FAC9475b503DD 0n
- Account 0x1d4beb1fCd58F36243c2A1dEafEfCa15bCEA4819 0n
- Account 0x4275ABc88C150d1ce20817BE7B594dfeB6A9d70E 0n

9. Added script `09-self-delegate` to self delegate:
Log:
```shell
0x4275ABc88C150d1ce20817BE7B594dfeB6A9d70E has 200000000000000000 decimals units of MyToken
0x4275ABc88C150d1ce20817BE7B594dfeB6A9d70E has 0 units of voting power
Self delegating...
0x4275ABc88C150d1ce20817BE7B594dfeB6A9d70E has 200000000000000000 decimals units of MyToken
0x4275ABc88C150d1ce20817BE7B594dfeB6A9d70E has 200000000000000000 units of voting power
```

10. Added script `10-check-voting-power` to check voting power
for args tokenizedBallotContract = 0x83611D5d1E4efc8c74B86090aA9CD304889d854a and wallet 0x4275ABc88C150d1ce20817BE7B594dfeB6A9d70E it returns 0n ❌

11. I think it's because we need to deploy tokenizedBallotContract after the self delegation
so i deployed a new tokenizedBallotContract with same proposals "monday best day", "friday best day" and "sunday best day", contract address = 0x4F52314A732A294647745B867c043b4E9c3c2426

12. I execute again the script `10-check-voting-power` to check voting power
for args tokenizedBallotContract = 0x4F52314A732A294647745B867c043b4E9c3c2426 and wallet 0x4275ABc88C150d1ce20817BE7B594dfeB6A9d70E it returns 200000000000000000n ✅

13. I add the script `11-check-past-votes` to check past votes
for args tokenContract = 0x208F75C3A395Ad125D0D641D9a2648F837a58538, tokenizedBallotContract = 0x4F52314A732A294647745B867c043b4E9c3c2426 and wallet 0x4275ABc88C150d1ce20817BE7B594dfeB6A9d70E it returns 200000000000000000n ✅

14. I try to vote executing script `05-vote` with wallet 0x4275ABc88C150d1ce20817BE7B594dfeB6A9d70E with 1 tokens and it generates this error: "TokenizedBallot: trying to vote more than allowed"
✅ this error expected because i tried to vote with 1 token, but my voting power is 0.2 token

15. I try to vote again executing script `05-vote` with wallet 0x4275ABc88C150d1ce20817BE7B594dfeB6A9d70E with 0.1 tokens and it works ✅
tx = https://sepolia.etherscan.io/tx/0x145281601d52e7b61cc46602cd1d8b0366d4a6c38b30e530874d67ed8cbd0b1f

16. I check my voting power spend, it now says 0.1 tokens
yarn run ts-node --files scripts/07-check-voting-power-spent.ts 0x4F52314A732A294647745B867c043b4E9c3c2426 0x4275ABc88C150d1ce20817BE7B594dfeB6A9d70E
100000000000000000n ✅

17. I vote again with 0.1 tokens and it works ✅
https://sepolia.etherscan.io/tx/0x9f30119ea64cadc82740b5d4bcfd0d2f951c625e195d0a212e6317bd14e68cb7

18. I vote again with 0.1 tokens and it fails as expected since i spent all my voting power ✅

19. I check the winning proposal, it is friday best day with 0.2 votes ✅
`yarn run ts-node --files scripts/12-check-winning-proposals.ts 0x4F52314A732A294647745B867c043b4E9c3c2426`

20. I check my vote balance, it should now be 200000000000000000n
`yarn run ts-node --files scripts/08-check-vote-balance.ts 0x208F75C3A395Ad125D0D641D9a2648F837a58538 0x4275ABc88C150d1ce20817BE7B594dfeB6A9d70E`
200000000000000000n ✅

21. I check my voting power, it should now be 0
`yarn run ts-node --files scripts/10-check-voting-power.ts 0x4F52314A732A294647745B867c043b4E9c3c2426 0x4275ABc88C150d1ce20817BE7B594dfeB6A9d70E`
0n ✅