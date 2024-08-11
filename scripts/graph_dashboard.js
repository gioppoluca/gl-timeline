const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

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
      height: "auto",
    },
    tag: "div", // The default is "div"
    window: {
      icon: "fas fa-gear", // You can now add an icon to the header
      title: "GLTIMELINE.main.title"
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
        var time_record = {
          start: new Date(p.flags.timeline.startdate),
          end: new Date(p.flags.timeline.enddate), 
          stack: 'stack1', 
          value: p.name, 
          labelStart: 'Alpha_start', 
          labelEnd: 'Alpha_end', 
          color: p.flags.timeline.colorevent
        }
        this.timeline.push(time_record);
      })

    });
    return {
      
    }
  }


  svg_orig() {
    const stacks = ['stack1', 'stack2', 'stack3'];

    // Data with custom labels, optional end dates, and colors
    const data = [
      { start: new Date('2023-05-23'), end: new Date('2023-05-24'), stack: 'stack1', value: 'data1', labelStart: 'Alpha_start', labelEnd: 'Alpha_end', color: 'steelblue' },
      { start: new Date('2023-06-24'), stack: 'stack1', value: 'data2', labelStart: 'Beta_start', labelEnd: null, color: 'orange' }, // Single event
      { start: new Date('2023-06-23'), end: new Date('2023-06-25'), stack: 'stack2', value: 'dataA', labelStart: 'Gamma_start', labelEnd: 'Gamma_end', color: 'green' },
      { start: new Date('2023-05-24'), stack: 'stack2', value: 'dataB', labelStart: 'Delta_start', labelEnd: null, color: 'purple' }, // Single event
      { start: new Date('2023-07-01'), end: new Date('2023-07-02'), stack: 'stack3', value: 'dataC', labelStart: 'Epsilon_start', labelEnd: 'Epsilon_end', color: 'red' }
    ];
console.log(this.timeline)
console.log(data);
    // Extract the unique dates from the data
    const customTicks = [...new Set(this.timeline.flatMap(d => [d.start.getTime(), d.end ? d.end.getTime() : d.start.getTime()]))]
      .sort((a, b) => a - b);

    const margin = { top: 20, right: 20, bottom: 50, left: 50 },
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // Scales
    const x = window.d3.scaleBand()
      .domain(customTicks)
      .range([0, width])
      .padding(0.0);

    const y = window.d3.scaleBand()
      .domain(stacks)
      .range([0, height])
      .padding(0.2);

    const barHeight = 7; // Set the height of bars and circles

    // Axis
    const xAxis = window.d3.axisBottom(x)
      .tickFormat(d => {
        const item = this.timeline.find(e => e.start.getTime() === d || (e.end && e.end.getTime() === d));
        return item ? (item.start.getTime() === d ? item.labelStart : item.labelEnd) : '';
      });

    const yAxis = window.d3.axisLeft(y);

    // SVG Container
    const svg = window.d3.select("#mygraph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add a thin black line for each stack
    svg.selectAll(".stack-line")
      .data(stacks)
      .enter().append("line")
      .attr("class", "stack-line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", d => y(d) + y.bandwidth() / 2)
      .attr("y2", d => y(d) + y.bandwidth() / 2);

    // Bars for stacks with both start and end dates
    svg.selectAll(".bar")
      .data(this.timeline.filter(d => d.end))
      .enter().append("rect")
      .attr("class", d => `bar ${d.stack}`)
      .attr("x", d => x(d.start.getTime()) + (x.bandwidth() - (x.bandwidth() * x.padding())) / 2) // Align bars with tick marks
      .attr("y", d => y(d.stack) + (y.bandwidth() - barHeight) / 2)  // Center the bar vertically
      .attr("width", d => {
        const startX = x(d.start.getTime()) + (x.bandwidth() - (x.bandwidth() * x.padding())) / 2;
        const endX = x(d.end.getTime()) + (x.bandwidth() - (x.bandwidth() * x.padding())) / 2;
        return endX - startX; // Correct width calculation
      })
      .attr("height", barHeight)  // Set bar height to 7 pixels
      .attr("fill", d => d.color);

    // Circles for single-point events
    svg.selectAll(".circle-event")
      .data(this.timeline.filter(d => !d.end))
      .enter().append("circle")
      .attr("class", "circle-event")
      .attr("cx", d => x(d.start.getTime()) + x.bandwidth() / 2) // Center the circle horizontally at the tick
      .attr("cy", d => y(d.stack) + y.bandwidth() / 2)  // Center the circle vertically
      .attr("r", barHeight / 2)  // Set radius to 3.5 pixels (half of bar height)
      .attr("fill", d => d.color)
      .style("stroke", "black")  // Add a thin black line for each circle
      .style("stroke-width", "1px");

    // Add the X Axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "start") // Align text to the start
      .attr("transform", "rotate(45)") // Rotate labels by 45 degrees
      .attr("dx", "-0.4em") // Adjust x position
      .attr("dy", "0.55em"); // Adjust y position

    // Add the Y Axis
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    // Function to download the SVG as an image
    // function downloadImage() {
    //   const svgElement = window.d3.select("svg").node();
    //   const serializer = new XMLSerializer();
    //   const source = serializer.serializeToString(svgElement);

    //   const image = new Image();
    //   image.src = 'data:image/svg+xml;base64,' + btoa(source);

    //   const canvas = document.createElement("canvas");
    //   canvas.width = svgElement.width.baseVal.value;
    //   canvas.height = svgElement.height.baseVal.value;
    //   const context = canvas.getContext("2d");

    //   image.onload = function () {
    //     context.drawImage(image, 0, 0);
    //     const link = document.createElement("a");
    //     link.download = "timeline.png";
    //     link.href = canvas.toDataURL("image/png");
    //     link.click();
    //   };
    // }

    // Add a right-click event to save the SVG
    window.d3.select("svg").on("contextmenu", function (event) {
      event.preventDefault();
      //      downloadImage();
    });

  }

}