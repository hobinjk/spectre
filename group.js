/* jshint undef: true, unused: true */
/* global Link, Machine */

function Group(aggregate, aggregateLink, x, y, width, height) {
  this.aggregate = aggregate;
  this.aggregateLink = aggregateLink;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.machines = [];
  this.machineLinks = [];
  var machineHeight = this.height/48;
  for(var i = 0; i < 48; i++) {
    this.machineLinks.push(new Link(10e9)); // 10Gb/s
    this.machines.push(new Machine(this, this.machineLinks[i], this.x, this.y + i*machineHeight, this.width, machineHeight));
  }
}

Group.prototype.update = function(dt) {
  this.machines.forEach(function(machine) {
    machine.update(dt);
  });
};

Group.prototype.draw = function(gfx) {
  this.machines.forEach(function(machine) {
    machine.draw(gfx);
  });
};

