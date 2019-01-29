var Bank = artifacts.require("Bank");
var Client = artifacts.require("Client");

module.exports = function(deployer, _,accounts) {
  
  deployer.deploy(Bank, {from: accounts[0], gas: 3000000, value: web3.utils.toWei("10000", "ether"), }).then((bank)=>{
    return deployer.deploy(Client, bank.address, accounts[1], {from: accounts[0], gas: 3000000}).then((c)=>{
      c.addFund({from: accounts[1], value: web3.utils.toWei("5", "ether")})
    });
  });
  console.log(accounts[0]);
  console.log(accounts[1]);
};