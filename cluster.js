/* jshint undef: true, unused: true */
/* global Link, Aggregate */

function Cluster(width,height) {
  this.width = width;
  this.height = height;

  this.machinesPerGroup = 48;
  this.groupsPerAggregate = 3;
  this.aggregatesPerCluster = 8;

  this.machinesCount = this.machinesPerGroup * this.groupsPerAggregate * this.aggregatesPerCluster;

  this.aggregateLinks = [];
  this.aggregates = [];
  var aggregateWidth = width/this.aggregatesPerCluster;
  for(var i = 0; i < this.aggregatesPerCluster; i++) {
    this.aggregateLinks.push(new Link(40e9));
    this.aggregates.push(new Aggregate(this, this.aggregateLinks[i], i*aggregateWidth, 0,
          aggregateWidth, height));
  }
}

Cluster.prototype.draw = function(gfx) {
  this.aggregates.forEach(function(aggregate) {
    aggregate.draw(gfx);
  });
};

Cluster.prototype.update = function(dt) {
  this.aggregates.forEach(function(aggregate) {
    aggregate.update(dt);
  });
};




/**
 * Get the links that will be congested by a transfer
 */
Cluster.prototype.getLinks = function(to, from) {
  // No links are required if the virtual machines are on the same physical machine.
  if(to.machine === from.machine) {
    return [];
  }
  // The links are to the group switch and back
  if(to.group === from.group) {
    return [to.machine.groupLink, from.machine.groupLink];
  }
  // Now the group switch must travel its link to the aggregate and back
  if(to.aggregate === from.aggregate) {
    return [to.machine.groupLink, to.group.aggregateLink, from.group.aggregateLink, from.machine.groupLink];
  }
  // Everything must be traversed, woooo
  return [
    to.machine.groupLink,        // machine->group
      to.group.aggregateLink,    // group->aggregate
        to.aggregate.coreLink,   // aggregate->core
        from.aggregate.coreLink, // core->aggregate
      from.group.aggregateLink,  // aggregate->group
    from.machine.groupLink       // group->machine
  ];
};

/**
 * Get a specific machine
 * @param index {number} the index of the machine
 */
Cluster.prototype.getMachine = function(index) {
  var aggregateIndex = Math.floor(index/(this.machinesPerGroup*this.groupsPerAggregate));
  index = index % (this.machinesPerGroup*this.groupsPerAggregate);
  var groupIndex = Math.floor(index / this.machinesPerGroup);
  var machineIndex = index % this.machinesPerGroup;
  return this.aggregates[aggregateIndex].groups[groupIndex].machines[machineIndex];
};

/**
 * Get a machine at random
 */
Cluster.prototype.getRandomMachine = function() {
  var index = Math.floor(Math.random()*this.machinesCount);
  return this.getMachine(index);
};


