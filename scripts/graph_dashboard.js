const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api
import { createTimeline, getNoteCategoryColors, getNoteCategoryNames, convertNotes, getUniqueOrderedTimestamps } from './timeline.js';

export default class GraphDashboard extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(options = {}) {
    super(options);
    console.log('constuctor of GraphDashboard')
  }

  static DEFAULT_OPTIONS = {
    id: "gl-timetable",
    form: {
      handler: GraphDashboard.myFormHandler,
      closeOnSubmit: true,
    },
    position: {
      width: 640,
      height: 800,
    },
    tag: "div", // The default is "div"
    window: {
      icon: "fas fa-gear", // You can now add an icon to the header
      title: "GLTIMELINE.main.title",
      resizable: true
    }

  }
  static async myFormHandler(event, form, formData) {
    // Do things with the returned FormData
    console.log('formhandler');
    console.log(form);
  }
  get title() {
    console.log('getTitle')
    //return `My Module: ${game.i18n.localize(this.options.window.title)}`;
    return '${game.i18n.localize(this.options.window.title)}';
  }
  _onRender(context, options) {
    console.log('render');
    this.svg_orig();
  }

  static PARTS = {
    form: {
      template: "modules/gl-timeline/scripts/templates/graph_dashboard.html"
    }
  }

  // this is the new getData
  _prepareContext(options) {
    const setting = null; //game.settings.get("foo", "config");
    console.log('_prepareContext');
    this.timeline = [];
    game.journal.forEach(the_journal => {
      console.log(the_journal);
      var pages = the_journal.pages.filter(x => { return x.flags.timeline })
      console.log(pages)
      pages.forEach(p => {
        console.log(p.id);
        var time_record = {
          start: new Date(p.flags.timeline.startdate),
          end: new Date(p.flags.timeline.enddate),
          stack: 'stack1',
          value: p.name,
          labelStart: 'Alpha_start',
          labelEnd: 'Alpha_end',
          journal_id: p.uuid,
          color: p.flags.timeline.colorevent
        }
        this.timeline.push(time_record);
      })

    });
    return {

    }
  }

  async openjournal(journal_id) {
    console.log(journal_id)
    //alert('Open Journal ID: ' + journal_id);
    // You can add more logic here, like opening a specific URL or triggering other events.
    const page = await fromUuid(journal_id);
    console.log(page);
    const sorted = page.parent.sheet._pages ?? [];
    const pageIndex = sorted.indexOf(sorted.find(s => s._id == page.id)) ?? -1;
    if (page.parent.sheet.rendered && page.parent.sheet?.pageIndex == pageIndex) {
      page.parent.sheet.close();
      return;
    }

    page.parent.sheet.render(true, { pageId: page.id })
  }


  // Function to handle the click event
  openLink(link) {
    console.log("gioppo link")
    //window.open(link, '_blank');
  }

  // Define the formatXaxis function
  formatXaxis(date) {
    console.log(date)
  //  var year = window.d3.timeFormat("%Y")(date);
    var calDate = window.SimpleCalendar.api.formatTimestamp(date)
    return calDate.date + " " + calDate.time;
  }
  svg_orig() {

    createTimeline()
    console.log("getData from SimpleCalendar");
    var nodecat = window.SimpleCalendar.api.getCurrentCalendar().noteCategories
    const types = getNoteCategoryNames(nodecat);
    console.log(types);
    const colorsArray = getNoteCategoryColors(nodecat);
    console.log(colorsArray);
    var notes = window.SimpleCalendar.api.getNotes().filter(n => n.flags?.timeline?.timelineInclude);
    var notesData = []
    notes.forEach(note => {
      var convnote = convertNotes(note)
      notesData.push(convnote)
    })
    console.log(notesData);

    const colorScale = window.d3.scaleOrdinal()
    .domain(types)
    .range(colorsArray);

    var data = [
      { "name": "American Revolutionary War", "start": "4/19/1775", "end": "9/3/1783", "sphere": "European", "link": "https://en.wikipedia.org/wiki/American_Revolutionary_War" },
      { "name": "Cherokee–American wars", "start": "01/01/1776", "end": "12/31/1795", "sphere": "Native", "link": "https://en.wikipedia.org/wiki/Cherokee%E2%80%93American_wars" },
      { "name": "Northwest Indian War", "start": "01/01/1785", "end": "12/31/1795", "sphere": "Native", "link": "https://en.wikipedia.org/wiki/Northwest_Indian_War" },
      { "name": "Whiskey Rebellion", "start": "01/01/1795", "end": "12/31/1795", "sphere": "Internal", "link": "https://en.wikipedia.org/wiki/Whiskey_Rebellion" },
      { "name": "Quasi-War", "start": "01/01/1798", "end": "12/31/1800", "sphere": "Latin America", "link": "https://en.wikipedia.org/wiki/Quasi-War" },
      { "name": "First Barbary War", "start": "5/10/1801", "end": "6/10/1805", "sphere": "Colonial", "link": "https://en.wikipedia.org/wiki/First_Barbary_War" },
      { "name": "Tecumseh's War", "start": "01/01/1811", "end": "12/31/1811", "sphere": "Native", "link": "https://en.wikipedia.org/wiki/Tecumseh%27s_War" },
      { "name": "War of 1812", "start": "6/18/1812", "end": "2/18/1815", "sphere": "European", "link": "https://en.wikipedia.org/wiki/War_of_1812" },
      { "name": "Red Stick War", "start": "01/01/1813", "end": "8/31/1814", "sphere": "Native", "link": "https://en.wikipedia.org/wiki/Creek_War" }
    ];

    var xTimestamps = getUniqueOrderedTimestamps(notesData)
    // Extract start and end dates, combine them into a single list, and remove duplicates
    var xpositions = new Set();

    // data.forEach(function (d) {
    //   xpositions.add(d.start);
    //   xpositions.add(d.end);
    // });
    notesData.forEach(function (d) {
      xpositions.add(d.start);
      xpositions.add(d.end);
    });
    // Convert Set to Array, parse dates, and sort them
    var xpositionArray = Array.from(xpositions).map(d => new Date(d)).sort((a, b) => a - b);

    var dateMin = xpositionArray[0]
    var dateMax = xpositionArray[xpositionArray.length-1]
    console.log("Unique Dates:", xpositionArray);
    console.log(dateMin)
    console.log(dateMax)

    var timeline = window.d3.layout.timeline()
      .size([800, 700])
      .extent([dateMin, dateMax])
      .padding(5)
      .maxBandHeight(25);

    var svg = window.d3.select("#timeline");
    console.log(svg);


    // Select the tooltip element
    var tooltip = window.d3.select("#tooltip-timeline");

    // Measure the width of the category labels
    var xOffset = 50; // Initial offset for the text
    var maxLabelWidth = 0; // Track the maximum width of labels

    svg.selectAll("text.type-label")
      .data(types)
      .enter()
      .append("text")
      .text(function (d) { return d; })
      .attr("class", "type-label")
      .attr("x", function () { return xOffset; })
      .attr("y", function (d, i) { return 20 + (i * 80); })
      .attr("font-size", "12px")
      .attr("fill", "black")
      .each(function () {
        var bbox = this.getBBox();
        maxLabelWidth = Math.max(maxLabelWidth, bbox.width);
      });

    console.log("Max Label Width:", maxLabelWidth);

    var adjustedXOffset = xOffset + maxLabelWidth + 10; // Adjust the offset

    var maxVerticalPosition = 0; // Track the maximum vertical position of the timeline
    const outerThis = this; // Capture the outer `this` context

    types.forEach(function (type, i) {
//      var onlyThisType = data.filter(function (d) { return d.sphere === type; });
      var onlyThisType = notesData.filter(function (d) { console.log(d);console.log(type);return d.sphere.includes(type); });
      var theseBands = timeline(onlyThisType);

      console.log("Type:", type);
      console.log("Bands for", type, ":", theseBands);

      // Add start and end positions to xpositions
      theseBands.forEach(function (band) {
        xpositions.add(band.start);
        xpositions.add(band.end);
      });

      var laneGroup = svg.append("g")
        .attr("transform", "translate(" + adjustedXOffset + "," + (35 + (i * 80)) + ")");

      laneGroup.selectAll("rect")
        .data(theseBands)
        .enter()
        .append("rect")
        .attr("x", function (d) { return d.start; })
        .attr("y", function (d) { return d.y; })
        .attr("height", function (d) { return d.dy; })
        .attr("width", function (d) { return d.end - d.start; })
        .style("fill", function (d) { return colorScale(d.sphere); })
        .style("stroke", "black")
        .style("stroke-width", 1)
        .on("mouseover", function (event, d) {
          console.log(event)
          console.log(d)
          tooltip.style("display", "inline")
            .html(d.name)
            .style("left", (event.offsetX + 5) + "px")
            .style("top", (event.offsetY + 5) + "px");
        })
        .on("mouseout", function () {
          tooltip.style("display", "none");
        })
        .on("click", function (event, d) {
          console.log(d)
          console.log(outerThis)
          outerThis.openLink(d.link);
        });

      maxVerticalPosition = Math.max(maxVerticalPosition, (35 + (i * 80)) + 80);
    });



    // Create a new scale for x-axis based on the xpositions
    var xScale = window.d3.scaleTime()
      .domain([new Date(dateMin), new Date(dateMax)])
      .range([0, 800]);

    var xAxis = window.d3.axisBottom(xScale)
 //   .tickValues(xpositionArray) // Use xpositionArray for tick values
    .tickValues(xTimestamps) // Use xpositionArray for tick values
    .tickFormat(this.formatXaxis); // Use the custom format function

    // Create the x-axis group and append it to the SVG
    var xAxisGroup = svg.append("g")
      .attr("transform", "translate(" + adjustedXOffset + "," + (maxVerticalPosition + 20) + ")") // Position the X-axis below the timeline
      .call(xAxis);

    // Rotate and position the x-axis labels
    xAxisGroup.selectAll("text")
      .attr("transform", "rotate(-40)")
      .attr("text-anchor", "end")
      .attr("dy", "0.35em");

    console.log("Adjusted X Offset:", adjustedXOffset);
    console.log("Max Vertical Position for X Axis:", maxVerticalPosition);
    console.log("Unique X Positions:", xpositionArray);


  }

}