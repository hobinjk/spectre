/* jshint undef: true, unused: true */
/* global Link, Group */

function Aggregate(cluster, coreLink, x, y, width, height) {
  this.cluster = cluster;
  this.coreLink = coreLink;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.groups = [];
  this.groupLinks = [];

  var groupWidth = this.width/3;
  for(var i = 0; i < 3; i++) {
    this.groupLinks.push(new Link(20e9));
    this.groups.push(new Group(this, this.groupLinks[i], this.x + groupWidth*i, this.y, groupWidth, this.height));
  }
}

Aggregate.prototype.update = function(dt) {
  this.groups.forEach(function(group) {
    group.update(dt);
  });
};

Aggregate.prototype.draw = function(gfx) {
  this.groups.forEach(function(group) {
    group.draw(gfx);
  });
};

