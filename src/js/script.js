'use strict'

import * as tool from './tools.js'

function calcPercent(main, ...values) {
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    mainDataset.push({
      perc: tool.hyperboleEq((values[i] / main) * 100),
      value: Math.round(values[i]),
    });
  }
  mainDataset.push({
    perc: tool.hyperboleEq(((main - sum) / main) * 100),
    value: Math.round(main - sum),
  });
}

function makeTitle(dataset,b2b) {
  if (b2b===false) {
    dataset[2].title = `Składka rentowa ${dataset[2].value}`;
    dataset[4].title = `Składka chorobowa ${dataset[4].value}`;
    dataset[3].title = `Składka zdrowotna ${dataset[3].value}`;
    dataset[1].title = `Składka emerytalna ${dataset[1].value}`;
    dataset[0].title = `Zaliczka na podatek ${dataset[0].value}`;
    dataset[5].title = `Do ręki ${dataset[5].value}`;
  } else {
    dataset[2].title = `Składka rentowa ${dataset[2].value}`;
    dataset[3].title = `Składka zdrowotna ${dataset[3].value}`;
    dataset[1].title = `Składka emerytalna ${dataset[1].value}`;
    dataset[0].title = `Zaliczka na podatek ${dataset[0].value}`;
    dataset[6].title = `Do ręki ${dataset[6].value}`;
    dataset[4].title = `Fundusz pracy i solidarnościowy ${dataset[4].value}`;
    dataset[5].title = `Składka wypadkowa ${dataset[5].value}`;
  }
  
}

let employmentForm;
let salary;
let showStatistics=false; //true when Submit clicked at least once

function UodTax(brutto) {
  mainDataset = [];
  title = [];

  let tax = brutto * 0.096;
  
  mainDataset.push({
    perc: tool.hyperboleEq((tax / brutto) * 100),
    value: Math.round(tax),
    title: `Zaliczka na podatek ${Math.round(tax)}`,
  });
  mainDataset.push({
    perc: tool.hyperboleEq(100 - (tax / brutto) * 100),
    value: Math.round(brutto - tax),
    title: `Do ręki ${Math.round(brutto - tax)}`,
  });
}

function UopTax(brutto) {
  mainDataset = [];
  title = [];
  
  let rent = brutto * 0.015;
  let chor = brutto * 0.0245;
  let eme = brutto * 0.0976;
  let zdr = (brutto - eme - rent - chor) * 0.09;
  let base = brutto - eme - rent - chor - 250;
  let tax =
    base <= 10000 ? (base) * 0.12 - 300 : 900 + (base - 10000) * 0.32 - 300;
  
  calcPercent(brutto,tax, eme, rent, zdr,chor);
  makeTitle(mainDataset,false);
  mainDataset.forEach((obj, index) =>{
    if (obj.value <= 0) mainDataset.splice(index, 1);
  });
  console.log(mainDataset);
}
function UzlTax(brutto) { 
  mainDataset = [];
  title = [];

  let KUZ = 0.2;
  let rent = brutto * 0.015;
  let chor = brutto * 0.0245;
  let eme = brutto * 0.0976;
  let zdr = (brutto - eme - rent - chor) * 0.09;
  let base = (brutto - eme - rent - chor - (brutto - eme - rent - chor) * KUZ)
  let tax = base <=10000? base * 0.12 : 900 + (base-10000)*0.32;
  
  calcPercent(brutto, tax, eme, rent, zdr,chor);
  makeTitle(mainDataset,false);
  mainDataset.forEach((obj, index) => {
   if (obj.value <= 0) mainDataset.splice(index, 1);});
}
function B2bTax(brutto) {
  mainDataset = [];
  title = [];
  const eme = 693.58;
  const rent = 284.26;
  const fpfs = 87.05;
  const wyp = 59.34;
  const zdr = 270.9;
  //let zus = netto < 6038 ? (zus = 17522.04/12) : (zus = 20209.44/12);  
  let zus = eme + rent + fpfs + wyp + zdr;
  let tax = -30000/12 + brutto > 0 ? (-30000/12 + brutto) * 0.12 : 0;
  calcPercent(brutto, tax, eme, rent, zdr, fpfs, wyp);
  makeTitle(mainDataset,true);
  mainDataset.forEach((obj, index) => {
    if (obj.value <= 0) mainDataset.splice(index, 1);
  });
}

const emplForm = document.querySelector(".employment-form");
const emplFormElem = emplForm.querySelectorAll('span');
document
  .querySelector("#dark-mode-icon")
  .addEventListener("click", () => replay());
emplFormElem.forEach(span=>
  span.addEventListener("click", (event) => console.log(employmentForm = event.target.id))
);

/////////////////////Submit button click///////////////////////////
document
  .querySelector("#salary-submit")
  .addEventListener("click", () => {
    var h2 = document.createElement("h2");
     h2.innerHTML = "Twoje wynagrodzenie wynosi";
    document.querySelector(".calculation-description").appendChild(h2);
    
    if ((employmentForm === "formUop")) UopTax(salary);
    else if ((employmentForm === "formUzl")) UzlTax(salary);
    else if ((employmentForm === "formB2b")) B2bTax(salary);
    else if ((employmentForm === "formUod")) UodTax(salary);
    else UopTax(salary);
    showStatistics === true ? replay() : draw();
    showStatistics = true;
  });

//Salary fill
document
  .querySelector("#salary-form-fill")
  .addEventListener(
    "keyup",
    () =>
      (console.log(salary = Number(
        document.querySelector("#salary-form-fill").value
      )))
  );

let dataset = [];
globalThis.mainDataset = Array.from(new Set(dataset));
let title = []
//console.log(el)
let colors = ["#77B1ED", "#7CD9F7", "#7BE0DE", "#7CF7D2", "#77EDA8",'#7CF2E4', '#71DED1',];
// let colors = ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"];

const width = document.querySelector(".chart-wrapper").offsetWidth;
const height = document.querySelector(".chart-wrapper").offsetHeight;
const minOfWH = Math.min(width, height) / 2;
const initialAnimDelay = 300;
const arcAnimDelay = 150;
const arcAnimDur = 3000;
const secDur = 1000;
const secIndividualdelay = 150;

let radius;

// calculate minimum of width and height to set chart radius
if (minOfWH > 200) {
  radius = 200;
} else {
  radius = minOfWH;
}
d3.select();
// append svg
let svg = d3
  .select(".chart-wrapper")
  .append("svg")
  .attr({
    width: width,
    height: height,
    class: "pieChart",
  })
  .append("g");

svg.attr({
  transform: `translate(${width / 2}, ${height / 2})`,
});

// for drawing slices
let arc = d3.svg
  .arc()
  .outerRadius(radius * 0.6)
  .innerRadius(radius * 0.45);

// for labels and polylines
let outerArc = d3.svg
  .arc()
  .innerRadius(radius * 0.85)
  .outerRadius(radius * 0.85);

// d3 color generator
// let c10 = d3.scale.category10();

let pie = d3.layout.pie().value((d) => d);

let draw = function () {
  svg.append("g").attr("class", "lines");
  svg.append("g").attr("class", "slices");
  svg.append("g").attr("class", "labels");

  // define slice
  let slice = svg
    .select(".slices")
    .datum(mainDataset.map(obj=>obj.perc))
    .selectAll("path")
    .data(pie);
  slice
    .enter()
    .append("path")
    .attr({
      fill: (d, i) => colors[i],
      d: arc,
      "stroke-width": "25px",
      transform: (d, i) => "rotate(-180, 0, 0)",
    })
    .style("opacity", 0)
    .transition()
    .delay((d, i) => i * arcAnimDelay + initialAnimDelay)
    .duration(arcAnimDur)
    .ease("elastic")
    .style("opacity", 1)
    .attr("transform", "rotate(0,0,0)");

  slice
    .transition()
    .delay((d, i) => arcAnimDur + i * secIndividualdelay)
    .duration(secDur)
    .attr("stroke-width", "5px");

  let midAngle = (d) => d.startAngle + (d.endAngle - d.startAngle) / 2;

  let text = svg
    .select(".labels")
    .selectAll("text")
    .data(pie(mainDataset.map((obj) => obj.perc)));

  text
    .enter()
    .append("text")
    .attr("dy", "0.35em")
    .style("opacity", 0)
    .style("fill", (d, i) => colors[i])
    .text((d, i) => mainDataset[i].title)
    .attr("transform", (d) => {
      // calculate outerArc centroid for 'this' slice
      let pos = outerArc.centroid(d);
      // define left and right alignment of text labels
      pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
      return `translate(${pos})`;
    })
    .style("text-anchor", (d) => (midAngle(d) < Math.PI ? "start" : "end"))
    .transition()
    .delay((d, i) => arcAnimDur + i * secIndividualdelay)
    .duration(secDur)
    .style("opacity", 1);

  let polyline = svg
    .select(".lines")
    .selectAll("polyline")
    .data(pie(mainDataset.map((obj) => obj.perc)));

  polyline
    .enter()
    .append("polyline")
    .style("opacity", 0.5)
    .attr("points", (d) => {
      let pos = outerArc.centroid(d);
      pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
      return [arc.centroid(d), arc.centroid(d), arc.centroid(d)];
    })
    .transition()
    .duration(secDur)
    .delay((d, i) => arcAnimDur + i * secIndividualdelay)
    .attr("points", (d) => {
      let pos = outerArc.centroid(d);
      pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
      return [arc.centroid(d), outerArc.centroid(d), pos];
    });
};

//draw();

let replay = () => {
  d3.selectAll(".slices")
    .transition()
    .ease("back")
    .duration(500)
    .delay(0)
    .style("opacity", 0)
    .attr("transform", "translate(0, 250)")
    .remove();
  d3.selectAll(".lines")
    .transition()
    .ease("back")
    .duration(500)
    .delay(100)
    .style("opacity", 0)
    .attr("transform", "translate(0, 250)")
    .remove();
  d3.selectAll(".labels")
    .transition()
    .ease("back")
    .duration(500)
    .delay(200)
    .style("opacity", 0)
    .attr("transform", "translate(0, 250)")
    .remove();

  setTimeout(draw, 800);
};

