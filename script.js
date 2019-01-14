var b;
var c;
var bankBalance;
var clientBalance;
Bank.deployed().then((inst)=>{b=inst});
Client.deployed().then((inst)=>{c=inst});

web3.eth.getBalance(b.address, function(err,res) { bankBalance = web3.utils.fromWei(res)});
web3.eth.getBalance(c.address, function(err,res) { clientBalance = web3.utils.fromWei(res)});
console.log(bankBalance)
console.log(clientBalance)


c.isClientActive()
c.addDeposit(web3.utils.toWei("1", "ether"))
c.checkDeposit().then(res=>{console.log(web3.utils.fromWei(res))})

c.withdraw(web3.utils.toWei("1", "ether"))
web3.eth.getBalance(b.address, function(err,res) { bankBalance = web3.utils.fromWei(res)});
web3.eth.getBalance(c.address, function(err,res) { clientBalance = web3.utils.fromWei(res)});
console.log(bankBalance)
console.log(clientBalance)