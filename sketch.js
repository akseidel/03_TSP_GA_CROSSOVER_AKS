// 5/2017 AKS modifications to
// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// Evolve Traveling Salesperson

// colors in use, values set in setup
var histColor ;
var textColor ;
var backColor ;
var routeColor ;
var firstColor ;

// Cities
var cities = [];
var totalCities = 20;

// Best path overall
var recordDistance = Infinity;
var bestEver;
var bestNow;
var bestLast = [];

// misc
var tyo = 12; // text offseting in stats
var txo = 10; // text offseting in stats
var txtMG = 10; // text offseting in stats
var txtB1; //
var gen = 0; // generation counter
var dmargin = 24; // margin from screen edge
var bep = 0; // last change % best ever
var bet = 0; // time of last change best ever
var lcp = 0; // last change % scrub
var lct = 0; // time of last change scrub

// Population of possible routes
var population = [];
var popTotal = 2000;

// Evolution history
var evolHist = [];
// wild hair flag
var addWild = false;

function setup() {
  // colors in use
  histColor = color(255,200,0);
  textColor = color(255,255,255);
  backColor = color(0,0,100);
  routeColor = color(255,255,255);
  firstColor = color(0,255,0);
  canvas = createCanvas(600, 600);
  // initializations
  startNewCitySet();
  makeAllNewRandomDNA();
  // Do the DOM
  DOMinator();
}

function draw() {
  background(backColor);
  // because there is not a slider is moving event
  adjMurate();
  // Each round let's find the best and worst
  var minDist = Infinity;
  var maxDist = 0;

  // Search for the best this round and overall
  gen += 1;
  for (var i = 0; i < population.length; i++) {
    var d = population[i].calcDistance();
    // Is this the best ever?
    if (d < recordDistance) {
      recordDistance = d;
      bestLast.push(bestEver);
      bestEver = population[i];
      var v = createVector( (gen * popTotal) + i, recordDistance);
      evolHist.push(v);
    }
    // Is this the best this round?
    if (d < minDist) {
      minDist = d;
      bestNow = population[i];
    }
    // Is this the worst?
    if (d > maxDist) {
      maxDist = d;
    }
  }

  // Show history
  ShowHistory();
  if (bestLast != undefined){
    bestLast[scrubHistory()].show();
    StatsBestLast();
  }

  // splitting the screen
  translate(0, height / 2);
  stroke(textColor);
  line(0, 0, width, 0);

  // Show the bestever stats
  bestEver.show();
  StatsBestEver();

  // Reproduction
  // Section to evolve the next generation pool
  // based upon crossing DNA from selections from
  // the previous pool where the selection process
  // tends to pick the better fittness members.
  //
  // The method to pick better fitting members needs
  // the population to be first fittness evaluated
  // and then normalized.
  //
  // Map all the fitness values between 0 and 1
  var sum = 0;
  for (var i = 0; i < population.length; i++) {
    sum += population[i].mapFitness(minDist, maxDist);
  }
  // Normalize them to a probability between 0 and 1
  for (var i = 0; i < population.length; i++) {
    population[i].normalizeFitness(sum);
  }
  // The current population is now fittness mapped and
  // normalized. The pickone method will tend to pick
  // the better fitting members. Note that better fitting
  // could easily result in a local evolution rut.
  //
  // Intialize a new population
  var newPop = [];
  // Using the same population size as the current
  // create new members from pairs selected from the
  // previous that will then have their DNA crossed.
  for (var i = 0; i < population.length; i++) {
    // Pick two
    var a = pickOne(population);
    var b = pickOne(population);
    // Add a wild hair
    if ((i == 0) && (addWild)){
      b = new DNA(totalCities);
    }
    // Crossover
    var order = a.crossover(b);
    newPop[i] = new DNA(totalCities, order);
  }
  // New population
  population = newPop;
}

// This is a new algorithm to select based on fitness probability.
// It only works if all the fitness values are normalized and add up to 1
function pickOne() {
  // Start at 0
  var index = 0;
  // Pick a random number between 0 and 1
  var r = random(1);
  // Keep subtracting probabilities until you get less than zero
  // Higher probabilities will be more likely to be fixed since they will
  // subtract a larger number towards zero
  while (r > 0) {
    r -= population[index].fitness;
    // And move on to the next
    index += 1;
  }
  // Go back one
  index -= 1;
  return population[index];
}

// make a new set of cities
function startNewCitySet(){
  // Make random cities
  for (var i = 0; i < totalCities; i++) {
    var v = createVector(random(dmargin, width - dmargin), random(dmargin, height / 2 - dmargin));
    cities[i] = v;
  }
}

// make all neew random DNA
function makeAllNewRandomDNA(){
  // Create starting population with random DNA
  for (var i = 0; i < popTotal; i++) {
    population[i] = new DNA(totalCities);
  }
}

// inject wild DNA flag
function addWildHair(){
  if (chkboxWH.elt.checked) {
    addWild = true;
  } else {
    addWild = false;
  }
}

// adjust Murate per slider sliderMurate action
function adjMurate(){
  murate  = sliderMurate.value()/100;
  // update the DOMs
  slMuratetxt.elt.innerText = "One Position Mutation Rate: " + murate;
}

// restart initializations
function doReStart(){
  if (ncInput.value() >= 4){
    totalCities = ncInput.value();
  } else {
    totalCities = 4;
    ncInput.value(4);
  }
  if (popInput.value() >= 1){
    popTotal = popInput.value();
  } else {
    popTotal = 1000;
    popInput.value(1000);
  }
  population.splice(0,population.length);
  startNewCitySet();
  makeAllNewRandomDNA();
  recordDistance = Infinity;
  gen = 0;
  bestLast.splice(0,bestLast.length);
  evolHist.splice(0,evolHist.length);
}

// create the DOM elements
function DOMinator(){
  createP("");
  butRestart = createButton('Restart (New Routes etc.)');
  butRestart.mousePressed(doReStart);//reStart);
  var nctxt =  "Number Of Cities: ";
  inpnctxt = createP(nctxt);
  inpnctxt.position(butRestart.position().x +  butRestart.width + 10 ,butRestart.position().y - butRestart.height*.5);
  ncInput = createInput(totalCities);
  ncInput.size(36);
  ncInput.position(inpnctxt.position().x + textWidth(nctxt) + 10, butRestart.position().y - butRestart.height*.2);
  var poptxt =  "Population Pool Size: ";
  ppoptxt = createP(poptxt);
  ppoptxt.position(ncInput.position().x + ncInput.width + 10, butRestart.position().y - butRestart.height*.5);
  popInput = createInput(popTotal);
  popInput.size(48);
  popInput.position(ppoptxt.position().x + textWidth(poptxt) + 10, butRestart.position().y - butRestart.height*.2);
  var whtxt = "Inject Wild DNA";
  pwhtxt = createP(whtxt);
  chkboxWH = createInput();
  chkboxWH.size(14,14);
  chkboxWH.attribute("type","checkbox");
  chkboxWH.position(pwhtxt.position().x + textWidth(whtxt) + 18, pwhtxt.position().y - pwhtxt.height*.1);
  //chkboxWH.attribute('checked', null);
  chkboxWH.changed(addWildHair);
  sliderMurate = createSlider(0, 100, murate*100);
  sliderMurate.position(inpnctxt.position().x  ,pwhtxt.position().y );
  var muratetxt = "One Position Mutation Rate: " + murate;
  slMuratetxt = createP(muratetxt);
  slMuratetxt.position(sliderMurate.position().x +  sliderMurate.width + 10 ,pwhtxt.position().y - pwhtxt.height*.9);
  //sliderMurate.changed(adjMurate);

}
