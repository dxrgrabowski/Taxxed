'use strict'

const formUop = {
  taxFieldNumber: 5,

}
const formB2b = {
  taxFieldNumber: 7,
};

function calcPercent(main, ...values) {
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    dataset.push({ perc: values[i] / main, value: Math.round(values[i]) });
  }
  dataset.push({ perc: (main - sum) / main, value: Math.round(main-sum)});
  return dataset;
}

function prepareDatasets(dataset) {
  var values = dataset.map((obj) => obj.value);
  var titles = dataset.map((obj) => obj.title);
  globalThis.percentages = dataset.map((obj) => obj.perc);
}

function makeTitle(dataset) {
  dataset[0].title= `Składka rentowa ${dataset[0].value}`;
  dataset[1].title = `Składka chorobowa ${dataset[1].value}`;
  dataset[2].title = `Składka emerytalna ${dataset[2].value}`;
  dataset[3].title = `Zaliczka na podatek ${dataset[3].value}`;
  dataset[4].title = `Do ręki ${dataset[4].value}`;
}

let employmentForm;
let salary;
let showStatistics; //true when Submit clicked

function UodTax(value) {
  dataset = [];
  title = [];
  let tax = value * 0.096;
  dataset.push(tax / value * 100);
  title.push(`Do ręki ${value-tax}`)
  dataset.push(100 - (tax / value) * 100);
  title.push(`Zaliczka na podatek ${tax}`);
}
function UopTax(brutto) {
  dataset = [];
  title = [];
  
  let rent = brutto * 0.015;
  let chor = brutto * 0.0245;
  let eme = brutto * 0.0976;
  let tax = (brutto - eme - rent - chor - 250) * 0.12;
  dataset.push(...calcPercent(brutto, eme, rent, chor, tax));
  makeTitle(dataset);
  globalThis.staty = Array.from(new Set(dataset));
  prepareDatasets(staty);
  console.log(staty.map(obj=>obj.perc))
}
function UzlTax(value) { }
function B2bTax(value) {}

function clickedEmplType(id){
  employmentForm=id;
}

const employmentForms = ['formUop','formUzl','formUod','formB2b']
//Submit button click
document
  .querySelector("#salary-submit")
  .addEventListener("click", () => {
    UopTax(salary);
    draw();
    showStatistics = true;
  });

//Salary fill
document
  .querySelector("#salary-form-fill")
  .addEventListener(
    "keyup",
    () => (salary = Number(document.querySelector("#salary-form-fill").value))
  );

let dataset = [];
let title = []
//console.log(el)
let colors = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd'];
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
    .datum(staty.map(obj=>obj.perc))
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
    .data(pie(percentages));

  text
    .enter()
    .append("text")
    .attr("dy", "0.35em")
    .style("opacity", 0)
    .style("fill", (d, i) => colors[i])
    .text((d, i) => staty[i].title)
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
    .data(pie(percentages));

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
