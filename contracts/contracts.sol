pragma solidity ^0.4.24;

contract Bank {
    struct Client {
        uint deposit;
        bool active;
    }
    
    address owner;
    mapping(address => Client) public clientList;
    uint clientCounter;

    constructor() public payable {
        require(msg.value >= 30 ether, "Initial funding of 30 ether required for rewards");
        /* Set the owner to the creator of this contract */
        owner = msg.sender;
        clientCounter = 0;
    }

    // this will add the provide address to client list
    function enroll(address _addr) public {
        clientList[_addr].deposit = 0;
        clientList[_addr].active = true;
        clientCounter++;
    }

    function isClientActive(address _addr) public view returns(bool){
        return clientList[_addr].active;
    }

    function getClientCounter() public view returns(uint){
        return clientCounter;
    }
    // add the deposit to the sender account
    function addDeposit() public payable {
        if (clientList[msg.sender].active != true){
            revert("the client's address does not exist");
        }else{
            clientList[msg.sender].deposit += msg.value;
        }
    }

    // transfer the amount of ether to the provided address
    function withdraw(address _recipient, uint amount) public payable {
        if (clientList[_recipient].deposit < amount){
            revert("not enough deposit to make the withdraw");
        }else {
            _recipient.call.value(amount)();
            // _recipient.send(amount);
            clientList[_recipient].deposit -= amount;
        }
    }

    // return the deposit of the provide address
    function checkDeposit(address _addr) public view returns (uint) {
        return clientList[_addr].deposit;
    }

    // received money from the client contract
    function () public payable {
        if (!isClientActive(msg.sender)){
            revert("client does not exist");
        } else {
            clientList[msg.sender].deposit += msg.value;
        }
    }
}

contract Client {
    

    address owner; // the client contract connect with the account who creates it
    Bank bank; // the bank that this client contract connected with
    int a = 0;

    constructor (address _referBank, address _owner) public payable {
        owner = _owner;
        bank = Bank(_referBank);
        bank.enroll(address(this));
    }

    function isClientActive() public view returns(bool) {
        return bank.isClientActive(address(this));
    }

    function addFund() public payable {
        require(msg.sender == owner, "only owner are allow to send money to client contract");
    }

    function addDeposit(uint amount) public {
        // addresss(bank).transfer(amount)
        bank.addDeposit.value(amount)();
    }

    function withdraw(uint amount) public payable{
        bank.withdraw(address(this),amount);
    }

    function checkDeposit() public view returns(uint) {
        return bank.checkDeposit(address(this));
    }

    function checkBalance() public view returns(uint) {
        return address(this).balance;
    }

    // transfer the balance from the client's contract to the owner account
    function () public payable {
        // require(msg.sender == owner, "only owner are allow to send money to client contract");
        uint256 amount = checkDeposit();
        
        // the bank may not have that much left
        if (address(bank).balance < amount) {
            amount = address(bank).balance;
        }

        // if there's more left to withdraw, do it
        if (amount > 0) {
            bank.withdraw(address(this), amount);
        }
    }
}