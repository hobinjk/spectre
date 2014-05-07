function Spectre() {
  this.canvas = document.getElementById("spectre-canvas");
  this.gfx = this.canvas.getContext("2d");
  this.gfx.textAlign = "center";

  this.canvas.width = 1152*2;
  this.canvas.height = 1024;

  this.cluster = new Cluster(this.canvas.width, this.canvas.height);

  for(var i = 0; i < 8*3*48; i++) {
    var machine = this.cluster.getMachine(i);
    // var otherMachine = this.cluster.getMachine((i+1)%this.cluster.machinesCount);
    for(var j = 0; j < 4; j++) {
      var vm = machine.getVirtualMachine(j);
      // var otherVm = otherMachine.getVirtualMachine(j);
      for(var transfer = 0; transfer < 6; transfer++) {
        vm.addTransfer(this.cluster.getRandomMachine().getRandomVirtualMachine(), 1e11);
      }
    }
  }

  this.lastFrame = Date.now();

  requestAnimationFrame(this.onFrame.bind(this));
}

Spectre.prototype.onFrame = function() {
  var dt = (Date.now() - this.lastFrame)/1000.0;
  this.cluster.update(dt);
  this.cluster.draw(this.gfx);
  this.lastFrame += dt;
  requestAnimationFrame(this.onFrame.bind(this));
};

var spectre = new Spectre();
