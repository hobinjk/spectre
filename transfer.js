/* jshint undef: true, unused: true */
/* global Transfer */

function Transfer(from, to, dataLength) {
  if(!from || !to) {
    throw new Error("no no no");
  }
  this.from = from;
  this.to = to;
  this.dataLength = dataLength;

  this.remaining = this.dataLength;
}

// assumes dt is in seconds
Transfer.prototype.update = function(throughput, dt) {
  this.remaining -= throughput * dt;
  if(this.remaining < 0) {
    this.remaining = 0;
  }
};

Transfer.prototype.isCompleted = function() {
  return this.remaining <= 0;
};

