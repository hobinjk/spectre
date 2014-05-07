/* jshint undef: true, unused: true */
/* global Transfer */

function VirtualMachine(machine, x, y, width, height) {
  this.machine = machine;
  this.group = this.machine.group;
  this.aggregate = this.group.aggregate;
  this.cluster = this.aggregate.cluster;

  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.transfers = [];
}

VirtualMachine.prototype.addTransfer = function(destination, dataLength) {
  var transfer = new Transfer(this, destination, dataLength);
  var links = this.cluster.getLinks(transfer.from, transfer.to);
  for(var i = 0; i < links.length; i++) {
    links[i].addTransfer(transfer);
  }
  this.transfers.push(transfer);
};

VirtualMachine.prototype.update = function(dt) {
  for(var i = 0; i < this.transfers.length; i++) {
    var transfer = this.transfers[i];
    var links = this.cluster.getLinks(transfer.from, transfer.to);
    var leastThroughput = 1.0e12; // ! Tb/s
    for(var j = 0; j < links.length; j++) {
      var throughput = links[j].calculateThroughput();
      if(throughput < leastThroughput) {
        leastThroughput = throughput;
      }
    }
    transfer.update(leastThroughput, dt);
    if(transfer.isCompleted()) {
      // remove the transfer
      for(var linkIndex = 0; linkIndex < links.length; linkIndex++) {
        links[linkIndex].removeTransfer();
      }
      this.transfers.splice(i, 1);
      i = i - 1;
    }
  }
};

VirtualMachine.prototype.draw = function(gfx) {
  var hue = 120;

  var transferDataRemaining = this.transfers.map(function(t) {
    return t.remaining;
  }).reduce(function(remA, remB) {
    return remA + remB;
  }, 0);

  var transferDataTotal = this.transfers.map(function(t) {
    return t.dataLength;
  }).reduce(function(remA, remB) {
    return remA + remB;
  }, 0);


  if(this.transfers.length > 0) {
    hue = 120*(1 - transferDataRemaining/transferDataTotal);
  }

  gfx.fillStyle = "hsl("+hue+",100%,60%)";
  gfx.fillRect(this.x, this.y, this.width, this.height);

  gfx.fillStyle = "black";
  gfx.textAlign = "center";
  gfx.textBaseline = "middle";
  var transferLeft = ""+(transferDataRemaining/1e11);
  if(transferLeft.length > 4) {
    transferLeft = transferLeft.substring(0,4);
  }
  gfx.fillText(transferLeft, this.x + this.width/2, this.y+this.height/2);
};

