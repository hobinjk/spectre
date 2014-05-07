function Link(capacity) {
  this.transferCount = 0;
  this.capacity = capacity;
}

Link.prototype.calculateThroughput = function() {
  return this.capacity/this.transferCount;
};

Link.prototype.addTransfer = function() {
  this.transferCount ++;
};

Link.prototype.removeTransfer = function() {
  this.transferCount --;
};
