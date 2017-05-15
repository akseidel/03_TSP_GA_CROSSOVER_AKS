// 5/2017 AKS

// Update stats
// Show the BestEver stats
function StatsBestEver(){
  genbepbet();
  var txt = ["Dist: " + nfc(bestEver.calcDistance(),2,1), "Route: " + evolHist.length,  nfc(bep,3) + "% at " + nfc(bet) ,"Pool: "+ nfc(membTotal)  ]
  txtB1 = tyo + 4;
  msgLine(txt,txo,txtB1,"   ");
  txt = ["BestEver, " + totalCities + " TSP"];
  txtB1 = tyo + 4;
  msgLine(txt, width - txo - textWidth(txt),txtB1,"");
}
// Shows the BestLast stats
function StatsBestLast(){
  genlcplct();
  var rt = scrubHistory();
  var txt = ["Dist: " + nfc(bestLast[rt].calcDistance(),2,1), "Route: " + rt + "   "  + nfc(lcp,3) + "% at " + nfc(lct)];
  txtB1 = tyo + 4;
  msgLine(txt,txo,txtB1,"   ");
  txt = ["History, " + totalCities + " TSP"];
  txtB1 = tyo + 4;
  msgLine(txt, width - txo - textWidth(txt),txtB1,"");
}
// Draws graph showing relative improvement over generations
function ShowHistory(){
  // scrubHistory becomes evolHist.length-1 when mouse is
  // not in the history panel
  var hindx = scrubHistory();
  if (hindx < 1){ return;}
  var eHMinX = evolHist[0].x;
  var eHMaxY = evolHist[0].y;
  var eHMaxX = evolHist[hindx].x;
  var eHMinY = evolHist[hindx].y;
  stroke(histColor1);
  strokeWeight(2);
  noFill();
  // history curve up to the scrubHistory only
  beginShape();
  for (var i = 0; i <= hindx; i++ ){
    var x = map(evolHist[i].x,eHMinX,eHMaxX,dmargin,width - dmargin);
    var y = map(evolHist[i].y,eHMinY,eHMaxY,height/2 - dmargin/2, dmargin + dmargin/2);
    vertex(x, y);
    ellipse(x,y, 2, 2);
  }
  endShape();
  // the full history curve
  stroke(histColor2);
  eHMaxX = evolHist[evolHist.length-1].x;
  eHMinY = evolHist[evolHist.length-1].y;
  beginShape();
  for (var i = 0; i <= evolHist.length-1; i++ ){
    var x = map(evolHist[i].x,eHMinX,eHMaxX,dmargin,width - dmargin);
    var y = map(evolHist[i].y,eHMinY,eHMaxY,height/2 - dmargin/2, dmargin + dmargin/2);
    vertex(x, y);
    ellipse(x,y, 2, 2);
    if (i > (evolHCurve.length-1)){
      var v = createVector(x,y);
      evolHCurve.push(v);
    }
  }
  endShape();
  // // the point that corresponds to the scrub hindx
  strokeWeight(3);
  stroke(255,110,0);
  eHMaxX = evolHist[evolHist.length-1].x;
  eHMinY = evolHist[evolHist.length-1].y;
  var x = map(evolHist[hindx-1].x,eHMinX,eHMaxX,dmargin,width - dmargin);
  var y = map(evolHist[hindx-1].y,eHMinY,eHMaxY,height/2 - dmargin/2, dmargin + dmargin/2);
  ellipse(x,y, 4, 4);
}

// calc history stats via scrub
function genlcplct(){
  var hindx = scrubHistory();
  lcp = 0;
  lct = 0;
  if (hindx >= 2){
    var lc = evolHist[hindx-2].y - evolHist[hindx-1].y;
    lcp = 100 * lc / evolHist[hindx-1].y;
    lct = evolHist[hindx-1].x;
  }
}

// calc best ever stats
function genbepbet(){
  var lindx = evolHist.length-1;
  bep = 0;
  bet = 0;
  if (lindx >= 1){
    var lc = evolHist[lindx-1].y - evolHist[lindx].y;
    bep = 100 * lc / evolHist[lindx].y;
    bet = evolHist[lindx].x;
  }

}

//
function msgLine(txtItems,txo,tyo,spc){
  textSize(12);
  fill(textColor);
  var statLine = "";
  txtItems.forEach(function(txtitem){statLine += txtitem + spc});
  text(statLine, txo, tyo);
}

// Mouse over history scrub
// Returns an index into history array.
// Maps mouseX to history index length. Cannot
// be used to pick a point on th history curve. So
// instead the history curve is redrawn to show up
// to the mapped mouseX.
function scrubHistory(){
  var x = evolHist.length-1; // default value
  if (mouseY < height/2){
    var rSide = width - dmargin;
    if(mouseX >= dmargin && mouseX <= rSide){
      x = floor(map(mouseX,dmargin,rSide,1,evolHist.length-1));
    }
  }
  return x;
}
