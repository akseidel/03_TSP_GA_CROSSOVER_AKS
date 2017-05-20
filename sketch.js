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
var totalCities = 14;

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
var dmargin = 24; // margin from screen edge
var bep = 0; // last change % best ever
var bet = 0; // time of last change best ever
var lcp = 0; // last change % scrub
var lct = 0; // time of last change scrub
var strROPMR = " Random One Position Mutation Rate (ROPMR)";

// Population of possible routes
var population = [];
var popTotal = 1400;
var membTotal = 0;
var popChange = false; // flag to change population on the fly
var memberLimit = Infinity;

// Evolution history
var evolHist = [];
// Evolution history curve
var evolHCurve = [];
// wild hair flag
var addWild = false;
// do crossover flag
var doCrossOver = true;

function setup() {
  // colors in use
  histColor1 = color(255,200,0,80);
  histColor2 = color(255,200,0);
  textColor = color(255,255,255);
  backColor = color(0,0,100);
  routeColor = color(255,255,255);
  firstColor = color(0,255,0);
  canvas = createCanvas(600, 600);
  canvas.parent('canvascontainer');
  // initializations
  startNewCitySet();
  makeAllNewRandomDNA();
  // Do the DOM
  DOMinator();
} // end setup

function draw() {
  background(backColor);
  // because there is not a slider is moving event
  adjMurate();
  // Each round let's find the best and worst
  var minDist = Infinity;
  var maxDist = 0;

  if (membTotal <= memberLimit){
  // Search for the best this round and overall
  for (var i = 0; i < population.length; i++) {
    if (membTotal >= memberLimit){
      // we want to hit the memberLimit exactly
      break;
    }
    membTotal += 1;
    var d = population[i].calcDistance();
    // Is this the best ever?
    if (d < recordDistance) {
      recordDistance = d;
      bestLast.push(bestEver);
      bestEver = population[i];
      var v = createVector( membTotal, recordDistance);
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
  } // end for
} // end limit check

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

  // Allow on the fly population change. Do nothing
  // if popChange flag has not been set.
  if (popChange){
    var curlen = population.length;
    if (popTotal <= curlen){
      // new popTotal is smaller or equal, so the existing
      // population can be spliced off
      population.splice(popTotal,curlen - popTotal);
    } else {
      // new popTotal larger, new members need to be added.
      // These will be random order, ie wild.
      for (var i = 0; i < (popTotal - curlen); i++){
          var n = new DNA(totalCities);
          population.push(n);
      }
    }
    popChange = false;
  }

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
  judgeFitnessNormalize(minDist, maxDist);
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
    var order;
    // Add a wild hair
    if ((i == 0) && (addWild)){
      b = new DNA(totalCities);
    }
    if (doCrossOver){
      // Crossover
      order = a.crossover(b);
    }else{
      // No crossover and allow single injection
      order = b;
    }
    newPop[i] = new DNA(totalCities, order);
  }
  // New population
  population = newPop;
} // end draw

function judgeFitnessNormalize(minDist, maxDist){
  // Map all the fitness values between 0 and 1
  var sum = 0;
  for (var i = 0; i < population.length; i++) {
    sum += population[i].mapFitness(minDist, maxDist);
  }
  // Normalize them to a probability between 0 and 1
  for (var i = 0; i < population.length; i++) {
    population[i].normalizeFitness(sum);
  }
  // sort the population based upon the normalized fitness
  population.sort(function(a, b) {
    return a.fitness - b.fitness;
  });
}

// This is a new algorithm to select based on fitness probability.
// It only works if all the fitness values are normalized and add up to 1.
// And if the list is sorted by the fitness.
function pickOne() {
  // Start at -1
  var index = -1;
  // Pick a random number between 0 and 1
  var r = random(1);
  // Keep subtracting probabilities until you get less than zero
  // Higher probabilities will be more likely to be picked since they will
  // subtract a larger number towards zero
  while (r > 0) {
    // And move on to the next
    index += 1;
    r -= population[index].fitness;
  }
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

// adjust popTotal on the fly
function adjPopTotal(){
  getPopInput();
  // set flag to have the population adjusted
  popChange = true;
}

// inject wild DNA flag
function addWildHair(){
  addWild = chkboxWH.elt.checked;
}

// set crossover flag
function setCrossOverFlag(){
  doCrossOver = chkboxDC.elt.checked;
}

// adjust Murate per slider sliderMurate action
function adjMurate(){
  murate  = sliderMurate.value()/100;
  // update the DOMs
  slMuratetxt.elt.innerText = murate + strROPMR;
}

function getPopInput(){
  if (popInput.value() >= 1){
    popTotal = popInput.value();
  } else {
    popTotal = 1000;
    popInput.value(1000);
  }
}

function adjMemberLimit(){
  if (limInput.value() >= 0){
    memberLimit = limInput.value();
  } else {
    memberLimit = Infinity;
    limInput.elt.value = Infinity;
  }
}

// restart initializations
function doReStart(){
  if (ncInput.value() >= 4){
    totalCities = ncInput.value();
  } else {
    totalCities = 4;
    ncInput.value(4);
  }
  getPopInput();
  population.splice(0,population.length);
  startNewCitySet();
  makeAllNewRandomDNA();
  recordDistance = Infinity;
  membTotal = 0;
  bestLast.splice(0,bestLast.length);
  evolHist.splice(0,evolHist.length);
  evolHCurve.splice(0,evolHCurve.length);
}

// reset initializations with same cities
function doReSet(){
  getPopInput();
  population.splice(0,population.length);
  makeAllNewRandomDNA();
  recordDistance = Infinity;
  membTotal = 0;
  bestLast.splice(0,bestLast.length);
  evolHist.splice(0,evolHist.length);
  evolHCurve.splice(0,evolHCurve.length);
}

// create the DOM elements
function DOMinator(){
  var Line01 = createP("");
  butRestart = createButton('Restart (All New Cities)');
  butRestart.mousePressed(doReStart);//reStart);

  butReadMe = createButton('See ReadMe');
  butReadMe.mousePressed(seeReadMe);
  butReadMe.position(width  - butReadMe.width, butRestart.position().y);

  var Line02 = createP("");
  butReset = createButton('Reset (Use Same Cities)');
  butReset.mousePressed(doReSet);

  var nctxt =  "Number Of Cities: ";
  inpnctxt = createP(nctxt);
  inpnctxt.position(butRestart.position().x +  butRestart.width + 10 ,butReset.position().y - butReset.height*.5);
  ncInput = createInput(totalCities);
  ncInput.size(36);
  ncInput.position(inpnctxt.position().x + textWidth(nctxt) + 26, butReset.position().y - butReset.height*.2);

  var poptxt =  "Population Pool Size: ";
  ppoptxt = createP(poptxt);
  ppoptxt.position(ncInput.position().x + ncInput.width + 10, butReset.position().y - butReset.height*.5);
  popInput = createInput(popTotal);
  popInput.changed(adjPopTotal); // handle on the fly popTotal changed
  popInput.size(48);
  popInput.position(ppoptxt.position().x + textWidth(poptxt) + 26, butReset.position().y - butReset.height*.2);

  var whtxt = "Inject Wild DNA: ";
  pwhtxt = createP(whtxt);
  chkboxWH = createInput();
  chkboxWH.size(14,14);
  chkboxWH.attribute("type","checkbox");
  var chPos = pwhtxt.position().x + textWidth(whtxt) + 18;
  chkboxWH.position(chPos, pwhtxt.position().y - pwhtxt.height*.1);
  //chkboxWH.attribute('checked', null);
  chkboxWH.changed(addWildHair); // handle on the fly wild hair change

  sliderMurate = createSlider(0, 100, murate*100);
  sliderMurate.position(inpnctxt.position().x  ,pwhtxt.position().y );
  var muratetxt = murate + strROPMR;
  slMuratetxt = createP(muratetxt);
  slMuratetxt.position(sliderMurate.position().x +  sliderMurate.width + 10 ,pwhtxt.position().y - pwhtxt.height*.9);
  //sliderMurate.changed(adjMurate); // this event only fires after the slider is changed.

  var dctxt = "DNA Crossover: ";
  pdctxt = createP(dctxt);
  chkboxDC = createInput();
  chkboxDC.size(14,14);
  chkboxDC.attribute("type","checkbox");
  chkboxDC.position(chPos , pdctxt.position().y - pdctxt.height*.1);
  chkboxDC.attribute('checked', null);
  chkboxDC.changed(setCrossOverFlag); // handle on the fly crossover change

  var limtxt =  "Limit Total Evolutions To: ";
  plimtxt = createP(limtxt);
  plimtxt.position(inpnctxt.position().x , pdctxt.position().y - pdctxt.height*.9);
  limInput = createInput(memberLimit);
  limInput.changed(adjMemberLimit); // handle on the fly memberLimit changed
  limInput.size(150);
  limInput.position(plimtxt.position().x + textWidth(limtxt) + 36, pdctxt.position().y - limInput.height*.2);

}

function seeReadMe(){
  var winName = "GA Crossover Information";
  var url = "https://github.com/akseidel/03_TSP_GA_CROSSOVER_AKS/blob/master/README.md";
  var options = "resizable,scrollbars";
  link(url,winName,options);
}

function link(url, winName, options) {
  winName && open(url, winName, options) || (location = url);
}
