function myRand(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function randomizeConstants() {
  // 0, 255
  document.getElementById('red').value = myRand(0, 255);

  // 0, 255
  document.getElementById('green').value = myRand(0, 255);

  // 0, 255
  document.getElementById('blue').value = myRand(0, 255);

  // 10, 30
  document.getElementById('size').value = myRand(10, 30);

  // 1, 1000
  document.getElementById('particles').value = myRand(1, 1000);

  // 0, 10
  document.getElementById('riseSpeed').value = myRand(0, 10);
  //constants.xVariance = document.getElementById('xVariance').value;
  // constants.yVariance = document.getElementById('yVariance').value;

  // 1, 100
  document.getElementById('radianMax').value = myRand(1, 100);

  // 1, 100
  document.getElementById('weirdMultiplier').value = myRand(1, 100);

  // 0, 100
  document.getElementById('decaySpeed').value = myRand(0, 10);

  // -1000, 1000
  document.getElementById('driftTowardsCenter').value = myRand(-1000, 1000);

}

function setConstants() {

  // 0, 255
  constants.red = document.getElementById('red').value;

  // 0, 255
  constants.green = document.getElementById('green').value;

  // 0, 255
  constants.blue = document.getElementById('blue').value;

  // 10, 30
  constants.size = document.getElementById('size').value;

  // 1, 1000
  constants.particleCount = document.getElementById('particles').value;

  // 0, 10
  constants.riseSpeed = document.getElementById('riseSpeed').value;
  constants.xVariance = document.getElementById('xVariance').value;
  constants.yVariance = document.getElementById('yVariance').value;

  // 1, 100
  constants.radianMax = document.getElementById('radianMax').value;

  // 1, 100
  constants.weirdMultiplier = document.getElementById('weirdMultiplier').value;

  // 0, 100
  constants.decaySpeed = document.getElementById('decaySpeed').value / 10;

  // -1000, 1000
  constants.driftTowardsCenter = document.getElementById('driftTowardsCenter').value;
}

function Particle(attributes) {
  this.x = attributes.x;
  this.y = attributes.y;
  this.size = attributes.size;
  this.color = attributes.color;
  this.center = attributes.center;
}

Particle.prototype.draw = function() {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0)';
  ctx.lineWidth = 0;

  this.y -= constants.riseSpeed;
  // this.x += Math.random() * ((this.center - this.x) / 40);
  // this.x += Math.random() * ((this.center - this.x) / 1000);
  //this.x += Math.random() * ((this.center - this.x) / (100 - constants.driftTowardsCenter));
  this.x += Math.random() * (this.center - this.x) * (constants.driftTowardsCenter / 1000);
  //this.x += ((this.center - this.x) / 100);
  //this.size -= Math.random();

  this.size = Math.max(this.size - (constants.decaySpeed * Math.random()), 0);

  //ctx.fillStyle = "rgba(155, 0, 0, .5)";
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI*2, true); 
  ctx.closePath();
  ctx.fill();

  ctx.stroke();
};
var display = document.getElementById('display');
var ctx = display.getContext('2d');
var particles = [];
var width = display.width = window.innerWidth;
var height = display.height = window.innerHeight;
var mouse = {
  x: width / 2,
  y: height / 2
};

var constants = {};

setConstants();

display.addEventListener('mousemove', function(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

requestAnimationFrame(frame);
function frame() {
  requestAnimationFrame(frame);
  ctx.clearRect(0, 0, width, height);
  var stillVisibleParticles = [];
  particles.forEach(function(particle) {
      particle.draw();

      // TODO - Add check for if particle is off screen
      if (particle.size > 0 && particle.y > 0) {
        stillVisibleParticles.push(particle);
      }

  });

  particles = stillVisibleParticles;

  // TODO - Instead of creating new particles, just reset the old ones.
  addParticles(particles, Math.min(constants.particleCount / 20, constants.particleCount - particles.length));
  //addParticles(particles, constants.particleCount - particles.length);
  //addParticles(particles, Math.min(particles.length + 1, constants.particleCount - particles.length));
}

function getXAndY() {
  var degrees = Math.random() * 360,
      //radians = Math.random() * 25;
      radians = Math.random() * constants.radianMax;

  return {
      radians: radians,
      x: radians * Math.cos(degrees),
      y: radians * Math.sin(degrees)
  };
}

function rcHelper(color, xAndY) {
  return Math.floor(Math.min(color / xAndY.radians * constants.weirdMultiplier, 255));
}

function randomColors(xAndY) {
  return [rcHelper(constants.red, xAndY), rcHelper(constants.green, xAndY), rcHelper(constants.blue, xAndY)].join(',');
}

function addParticles(particleArray, numToAdd) {

  setConstants();
  //numToAdd = Math.min(numToAdd, 1);
  numToAdd = numToAdd / 3;

  for (var i = 0; i < numToAdd; i++) {
    var xAndY = getXAndY();
    var color = 'rgba(' + randomColors(xAndY) + ',.1)';

    var attributes = {
      x: ((Math.random() - .5) * 20) + (mouse.x + xAndY.x),
      y: -50 + mouse.y + xAndY.y,
      size: constants.size,
      color: color,
      center: mouse.x
    };

    //particleArray.push(new Particle(mouse.x + Math.random() - .5) * 50), mouse.y + ((Math.random() - .5) * 50), constants.size));
    particleArray.push(new Particle(attributes));
  }
}
