// 5/2017 AKS modifications to
// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// Evolve Traveling Salesperson

// mutation rate for one pair on an existing order
var murate = 0.04;

// A generic function to swap two elements in an array
function swap(a, i, j) {
  var temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

// A DNA object is an order through the cities
function DNA(total, order) {
  // Start assuming it's distance is infinity and fitness is zero
  this.dist = Infinity;
  this.fitness = 0;
  // Is this being made from another DNA object?
  if (order instanceof Array) {
    // Just copy the order
    this.order = order.slice();
    // Mutation
    // murate % of the time shuffle one spot
    if (random(1) < murate) {
      this.shuffle();
    }
  } else {
    // Create a random order
    this.order = [];
    for (var i = 0; i < total; i++) {
      this.order[i] = i;
    }
    // Shuffle randomly 100 times
    // Is this good enough for variation?
    for (var n = 0; n < 100; n++) {
      this.shuffle();
    }
  }
}

// Shuffle array one time
DNA.prototype.shuffle = function() {
  var i = floor(random(this.order.length));
  var j = floor(random(this.order.length));
  swap(this.order, i, j);
}

// How long is this particular path?
DNA.prototype.calcDistance = function() {
  var sum = 0;
  for (var i = 0; i < this.order.length - 1; i++) {
    var cityAIndex = this.order[i];
    var cityA = cities[cityAIndex];
    var cityBIndex = this.order[i + 1];
    var cityB = cities[cityBIndex];
    var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;
  }
  // add in the returning trip, reusing variables A & B
  cityA = cities[this.order[0]];
  cityB = cities[this.order[this.order.length-1]];
  sum += dist(cityA.x, cityA.y, cityB.x, cityB.y);
  this.dist = sum;
  return this.dist;
}

// Map the fitess where shortest is best, longest is worst
DNA.prototype.mapFitness = function(minD, maxD) {
  this.fitness = map(this.dist, minD, maxD, 1, 0);
  return this.fitness;
}

// Normalize against total fitness
DNA.prototype.normalizeFitness = function(total) {
  this.fitness /= total;
}

// Draw the path
DNA.prototype.show = function() {
  // Lines
  stroke(routeColor);
  strokeWeight(1);
  noFill();
  beginShape();
  for (var i = 0; i < this.order.length; i++) {
    var n = this.order[i];
    vertex(cities[n].x, cities[n].y);
  }
  endShape(CLOSE);

  // Cities
  for (var i = 0; i < this.order.length; i++) {
    if (i == 0){
      stroke(firstColor);
      fill(firstColor);
    }else{
      stroke(routeColor);
      fill(routeColor);
    }
    var n = this.order[i];
    ellipse(cities[n].x, cities[n].y, 6, 6);
  }
}

// This is one way to crossover two paths
DNA.prototype.crossover = function(other) {
  // Grab two orders
  var order1 = this.order;
  var order2 = other.order;
  // Pick a random start and endpoint
  var start = floor(random(order1.length));
  var end = floor(random(start + 1, order1.length + 1));
  // Grab part of the the first order
  var neworder = order1.slice(start, end);
  // How many spots do we need to add?
  var leftover = order1.length - neworder.length;
  // Go through order 2
  var count = 0;
  var i = 0;
  // As long as we aren't finished
  while (count < leftover) {
    // Take a city from order2
    var city = order2[i];
    // If it isn't part of the new child path yet
    if (!neworder.includes(city)) {
      // Add it!
      neworder.push(city);
      count++;
    }
    i++;
  }
  return neworder;
}
