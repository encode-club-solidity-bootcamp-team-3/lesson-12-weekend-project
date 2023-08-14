# Lesson 12 - Tokenized Votes

## The ERC20Votes ERC20 extension

* ERC20Votes properties
* Snapshots
* Creating snapshots when supply changes
* Using snapshots
* Self delegation
* Contract overall operation

### References
<https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Votes>

<https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Snapshot>

<https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Permit>

    // SPDX-License-Identifier: MIT
    pragma solidity >=0.7.0 <0.9.0;
    
    import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
    import "@openzeppelin/contracts/access/AccessControl.sol";
    import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
    import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
    
    contract MyToken is ERC20, AccessControl, ERC20Permit, ERC20Votes {
        bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
        constructor() ERC20("MyToken", "MTK") ERC20Permit("MyToken") {
            _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
            _grantRole(MINTER_ROLE, msg.sender);
        }
    
        function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
            _mint(to, amount);
        }
    
        // The following functions are overrides required by Solidity.
    
        function _afterTokenTransfer(address from, address to, uint256 amount)
            internal
            override(ERC20, ERC20Votes)
        {
            super._afterTokenTransfer(from, to, amount);
        }
    
        function _mint(address to, uint256 amount)
            internal
            override(ERC20, ERC20Votes)
        {
            super._mint(to, amount);
        }
    
        function _burn(address account, uint256 amount)
            internal
            override(ERC20, ERC20Votes)
        {
            super._burn(account, amount);
        }
    }

## ERC20Votes and Ballot.sol

* (Review) Testing features with scripts
* Mapping scenarios
* Contracts structure
* Using snapshots to account for vote power in ballot

---

## Homework

* Create Github Issues with your questions about this lesson
* Read the references

---

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