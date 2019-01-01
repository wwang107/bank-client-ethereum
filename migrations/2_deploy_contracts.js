var Bank = artifacts.require("Bank");
var Client = artifacts.require("Client");

module.exports = function(deployer, _,accounts) {
  
  deployer.deploy(Bank, {from: accounts[0], value: web3.utils.toWei("30", "ether")}).then((bank)=>{
    return deployer.deploy(Client, bank.address, accounts[1], {from: accounts[0], value: web3.utils.toWei("30", "ether")});
  });
  console.log(accounts[0]);
  console.log(accounts[1]);
};