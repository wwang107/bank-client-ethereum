const Bank = artifacts.require("Bank");
var Client = artifacts.require("Client");
// ether = 10**18;
contract("TestContracts", function(accounts) {
    console.log("total accounts: ",accounts);
    const alice = accounts[1];
    const bob = accounts[2];
    const charlie = accounts[3];
    
    it("add 3 people to the bank", async ()=>{
        const bank = await Bank.deployed();
        await bank.enroll(alice);
        await bank.enroll(bob);
        await bank.enroll(charlie);
        
        assert.equal(await bank.isClientActive(alice), true," alice's account does not active");
        assert.equal(await bank.isClientActive(bob), true," bob's account does not active");
        assert.equal(await bank.isClientActive(charlie), true," charlie's account does not active")
    })

    it("deposit ethereum to the bank", async ()=>{
        const bank = await Bank.deployed();
        await bank.enroll(alice);

        bank.addDeposit({from:alice, value: web3.utils.toWei("30","ether")})
        let deposit = web3.utils.fromWei(await bank.checkDeposit(alice));
        
        assert.equal(deposit, 30, "deposit did not be added");
    })

    it("withdraw ethereum from the bank", async ()=>{
        const bank = await Bank.deployed();
        await bank.enroll(alice);
        assert.equal(await bank.isClientActive(alice), true," alice's account does not active");
        
        let start_deposit = web3.utils.fromWei(await bank.checkDeposit(alice));
        assert.equal(start_deposit, 0, "starting balance is incorrect");
        
        bank.addDeposit({from:alice, value: web3.utils.toWei("30","ether")})
        let mid_deposit = web3.utils.fromWei(await bank.checkDeposit(alice));
        assert.equal(mid_deposit, 30, "deposit did not be added");
        
        await bank.withdraw(web3.utils.toWei("5", "ether"), {from:alice});
        let end_deposit = web3.utils.fromWei(await bank.checkDeposit(alice));
        assert.equal(end_deposit, 25, "withdraw failed");

    })

    it("client's contract register to the bank contract", async ()=>{
        const alice = accounts[1];
        const bank = await Bank.deployed();
        const client = await Client.deployed(bank.address, alice); // deploy client contract, connect the bank contract and set the owner of the client contract as alice

        assert.equal(await client.isClientActive(), true," client contract does not active at bank");
    })

    it("add deposit using client contract", async ()=>{
        const bank = await Bank.deployed();
        const client = await Client.deployed(bank.address, alice); //the owner of the contract is alice
        client.addFund({from: alice, value: web3.utils.toWei("30","ether")});
        
        balance = web3.utils.fromWei(await client.checkBalance());
        assert(balance, 30, "balance of the contract wrong");

        await client.addDeposit(web3.utils.toWei("5","ether"));
        let deposit = web3.utils.fromWei(await client.checkDeposit());
        assert(deposit, 5, "balance of the contract wrong");
    })
});
