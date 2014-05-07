/* jshint undef: true, unused: true */
/* global VirtualMachine */

function Machine(group, groupLink, x, y, width, height) {
  this.group = group;
  this.groupLink = groupLink;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.virtualMachines = [];
  var vmWidth = this.width/4;
  for(var i = 0; i < 4; i++) {
    this.virtualMachines.push(new VirtualMachine(this, this.x + vmWidth*i, this.y, vmWidth, this.height));
  }
}

Machine.prototype.update = function(dt) {
  for(var i = 0; i < this.virtualMachines.length; i++) {
    this.virtualMachines[i].update(dt);
  }
};

Machine.prototype.draw = function(gfx) {
  for(var i = 0; i < this.virtualMachines.length; i++) {
    this.virtualMachines[i].draw(gfx);
  }
};

Machine.prototype.getVirtualMachine = function(index) {
  return this.virtualMachines[index];
};

Machine.prototype.getRandomVirtualMachine = function() {
  return this.getVirtualMachine(Math.floor(Math.random()*this.virtualMachines.length));
};

