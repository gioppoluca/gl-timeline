//import GraphHandlebarsHelpers from "./graph_handlebarHandlers.js";
//import GraphForm from "./graph_form.js";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export default class GraphDashboard extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(data = {}, options = {}) {
    super(data, options);
//    this.registerHandlebarsHelpers()
//this.svg_orig();
  }

  static DEFAULT_OPTIONS = {
    id: "gl-timetable",
    form: {
 //     handler: TemplateApplication.#onSubmit,
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
      title: "FOO.form.title"
    }
  
  }
  static async myFormHandler(event, form, formData) {
    // Do things with the returned FormData
  }
  get title() {
    return `My Module: ${game.i18n.localize(this.options.window.title)}`;
  }

  static PARTS = {
    form: {
      template: "modules/gl-timeline/scripts/templates/graph_dashboard.html"
    }
  }
  // static get defaultOptions() {
  //   return mergeObject(super.defaultOptions, {
  //     id: "gl-timeline-dashboard",
  //     classes: ["gl-timeline"],
  //     template: "modules/gl-timeline/scripts/templates/graph_dashboard.html",
  //     minimizable: true,
  //     resizable: true,
  //     title: game.i18n.localize("FvttGraph.ActorDashTitle")
  //   })
  // }

  sceneControlButtonClick() {
    // if (SC.clientSettings.persistentOpen) {
    //     this.toggleWindow();
    // } else {
        this.render();
    // }
}

  get_selected_graph() {
    let graph_select = document.getElementById("graph-select")
    console.log(graph_select)
    let graph_selected = graph_select.options[graph_select.selectedIndex].value
    console.log(graph_selected)
    return graph_selected
  }

  invoke_graph_form(edit = false) {
    let graph = null
    let rels = null
    if (edit) {
      let graph_selected = this.get_selected_graph()
      graph = window.fgraph.api.get_all_graphs().filter(x => { return x.id === graph_selected })[0]
      rels = window.fgraph.api.get_relations(graph_selected)
    } else {
      graph = { name: "", desc: "", id: "", type: "actor", color: "#ff0000", relations: [] }
      rels = []
    }
    console.log(graph)
    new GraphForm(
      {
        can_browse: game.user && game.user.can("FILES_BROWSE"),
        graph: graph,
        relations: rels,
        edit: edit
      },
      {
        id: "add-graph-form",
        title: game.i18n.localize("FvttGraph.GraphForm.AddGraphTitle")
      }
    ).render(true)
  }

  svgToCanvas() {
    // Select the first svg element
    var svg = window.d3.select('#mygraph')
    console.log(svg)
      //console.log(svg[_groups][0])
      / console.log(svg.node().outerHTML)
    //   console.log(svg[0][0])
    var img = new Image()
    var serializer = new XMLSerializer()
    var svgStr = svg.node().outerHTML;
    var svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "newesttree.svg";
    downloadLink.click();
    /*
        let data = 'data:image/svg+xml;base64,' + window.btoa(svgStr);
    
        var canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 400;
        let context = canvas.getContext("2d");
        img.src = data;
        img.onload = function () {
          context.drawImage(img, 0, 0);
          var canvasdata = canvas.toDataURL("image/png");
          var pngimg = '<img src="' + canvasdata + '">';
          var a = document.createElement("a");
          a.download = "sample.png";
          a.href = canvasdata;
          a.click();
        };
        */
  };
  // Probably a good idea to extract some methods here for readability.
  activateListeners(html) {
    super.activateListeners(html)

    html.on('click', '#create-graph', e => {
      //      var e = document.getElementById("country");
      //              var result = e.options[e.selectedIndex].text;
      //let graph_select = html.find('#graph-select')
      this.invoke_graph_form()

    })
    html.on('click', '#edit-graph', e => {
      //      var e = document.getElementById("country");
      //              var result = e.options[e.selectedIndex].text;
      //let graph_select = html.find('#graph-select')
      this.invoke_graph_form(true)

    })

    html.on('click', '#print-diagram', e => {
      this.svgToCanvas()

    })
    /*
        html.on('click', '.change-value', e => {
          this.setup_calculation(e, (setting, jump) => {
            if($(e.currentTarget).hasClass('add')) {
              window.pr.api.increment(setting, jump)
            } else {
              window.pr.api.decrement(setting, jump)
            }
          })
        })
    
        html.on('mousemove', '.change-value', e => {
          let jump = this.increment_jump(e)
          if(jump == 1) return
          let operation = $(e.currentTarget).hasClass('add') ? '+' : '-'
          CursorTooltip.show(operation.concat(new String(jump)))
        })
    
        html.on('mouseout', '.change-value', e => {
          CursorTooltip.hide()
        })
    
        html.on('click', '.delete', e => {
          this.setup_calculation(e, setting => { ResourcesList.remove(setting) })
        })
    
        html.on('click', '.invisible, .visible', e => {
          this.setup_calculation(e, setting => { this.toggle_visiblity(setting) })
        })
    */
    /*
         html.on('drag', '#mygraph', e => {
           console.log("gioppo - event")
           console.log(e)
           $(e.currentTarget).dispatchEvent(e)
         })
   */
    html.on('click', '#create-diagram', e => {
      console.log("pressed button")
      let graph_selected = this.get_selected_graph()
      let graph_elements = window.fgraph.api.get_graph_elements(graph_selected)
   
//      this.svg_orig()
      this.svg1()
      /*
        var svg = window.d3.select( "#graph" ).append("svg").attr("width",w).attr("height",h);
        console.log(svg)
        svg.append( 'circle' ) // w/o "svg." not working
        .attr( 'cx', 50 )
        .attr( 'cy', 50 )
        .attr( 'r', 25 )
        .style( 'fill', '#4400ff' );
*/


    })
    /*
        html.on('click', '.edit', e => {
          e.stopPropagation()
          e.preventDefault()
    
          new ResourceForm(
            this.resource_data($(e.currentTarget).data('setting')),
            {
              id: "edit-resource-form",
              title: game.i18n.localize("FvttPartyResources.ResourceForm.EditFormTitle")
            }
          ).render(true)
        })
    */
    //  DraggableResources.init(this)
  }
  /*
    increment_jump(event) {
      if(event.ctrlKey || event.metaKey) return 10
      if(event.shiftKey) return 100
      return 1
    }
  */

    // this is the new getData
    _prepareContext(options) {
      const setting = null; //game.settings.get("foo", "config");
      return {
        setting
      }
    }

  // getData() {
  //   const divElem = document.createElement('div');
  //   let detachedSVG = window.d3.create("svg");

  //   // Manipulate detached element.
  //   detachedSVG
  //     .attr("width", 400)
  //     .attr("height", 200);
  //   detachedSVG.selectAll(null)
  //     .data([50, 100])
  //     .enter().append("circle")
  //     .attr("r", 20)
  //     .attr("cx", d => d)
  //     .attr("cy", 50);
  //   window.d3.select(divElem)
  //     .append(() => detachedSVG.node());
  //   console.log(detachedSVG)
  //   console.log(Handlebars)
  //   var svg1 = window.d3.create('svg')
  //   svg1.append('circle') // w/o "svg." not working
  //     .attr('cx', 50)
  //     .attr('cy', 50)
  //     .attr('r', 25)
  //     .style('fill', '#4400ff');
  //   return mergeObject(window.fgraph.api.resources(), {
  //     is_gm: game.user.isGM,
  //     svg: svg1.node().outerHTML,
  //     graphs: window.fgraph.api.get_all_graphs(),
  //     id: "pippo",
  //     dataset: "pluto",
  //     version: window.fgraph.version
  //   })
  // }
  
  redraw(force) {
    //  DashboardDirections.remove()

    this.render(force)
  }

  svg1() {
    var width = 300;
    var height = 200;

    var svg = window.d3.select('#mygraph')
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    var nodes = [{
      "id": "Chrome",
      "image": "modules/VenatusMaps-Tokens/SRD/Assassin/Shadow/Assassin_Cape_HiddenBlades_01.webp"
    }, {
      "id": "Firefox",
      "image": "https://gioppoluca.duckdns.org/modules/VenatusMaps-Tokens/SRD/Assassin/Shadow/Assassin_Cape_HiddenBlades_01.webp"
    }, {
      "id": "Safari",
      "image": "https://icons.iconarchive.com/icons/johanchalibert/mac-osx-yosemite/48/safari-icon.png"
    }, {
      "id": "Opera",
      "image": "https://icons.iconarchive.com/icons/ampeross/smooth/48/Opera-icon.png"
    }];

    var edges = [{
      "source": 0,
      "target": 1
    }, {
      "source": 0,
      "target": 2
    }, {
      "source": 0,
      "target": 3
    }];

    var simulation = window.d3.forceSimulation()
      .force("link", window.d3.forceLink())
      .force("charge", window.d3.forceManyBody().strength(-1000))
      .force("center", window.d3.forceCenter(width / 2, height / 2));

    var links = svg.selectAll("foo")
      .data(edges)
      .enter()
      .append("line")
      .style("stroke", "#ccc")
      .style("stroke-width", 1);

 //   var color = window.d3.scaleOrdinal(window.d3.schemeCategory20);

    var node = svg.selectAll("foo")
      .data(nodes)
      .enter()
      .append("g")
      .call(window.d3.drag()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }
    )
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    var nodeCircle = node.append("circle")
      .attr("r", 20)
      .attr("stroke", "gray")
      .attr("stroke-width", "2px")
      .attr("fill", "white");

    var nodeImage = node.append("image")
      .attr("xlink:href", d => d.image)
      .attr("height", "40")
      .attr("width", "40")
      .attr("x", -20)
      .attr("y", -20)

    var texts = node.append("text")
      .style("fill", "black")
      .attr("dx", 20)
      .attr("dy", 8)
      .text(function (d) {
        return d.id;
      });

    simulation.nodes(nodes);
    simulation.force("link")
      .links(edges);

    simulation.on("tick", function () {
      links.attr("x1", function (d) {
        return d.source.x;
      })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        })

      node.attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")


    });
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

    // Extract the unique dates from the data
    const customTicks = [...new Set(data.flatMap(d => [d.start.getTime(), d.end ? d.end.getTime() : d.start.getTime()]))]
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
            const item = data.find(e => e.start.getTime() === d || (e.end && e.end.getTime() === d));
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
        .data(data.filter(d => d.end))
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
        .data(data.filter(d => !d.end))
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
    function downloadImage() {
        const svgElement = window.d3.select("svg").node();
        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(svgElement);

        const image = new Image();
        image.src = 'data:image/svg+xml;base64,' + btoa(source);

        const canvas = document.createElement("canvas");
        canvas.width = svgElement.width.baseVal.value;
        canvas.height = svgElement.height.baseVal.value;
        const context = canvas.getContext("2d");

        image.onload = function() {
            context.drawImage(image, 0, 0);
            const link = document.createElement("a");
            link.download = "timeline.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        };
    }

    // Add a right-click event to save the SVG
    window.d3.select("svg").on("contextmenu", function(event) {
        event.preventDefault();
        downloadImage();
    });

  }
  graphic(dataset, element) {
    var w = 154;
    var h = 42;
    var rect_1_h = 5;
    var rect_2_h = rect_1_h * 2;
    var rect_2_w = rect_1_h / 2;
    var rect_1_color = "#A1C9D9";
    var rect_2_color = "#999999";
    var text_color = "#555555";
    var font_size = 18;
    var font_family = "Segoe UI";

    /*------controller---- */

    //  var xScale = d3.scale.linear().domain([dataset[0],dataset[2]]).range([0,w]);
    console.log(dataset)
    console.log(element)
    var svg = window.d3.select(element).append("svg").attr("width", w).attr("height", h);
    console.log(svg)
    svg.data([50, 100])
      .enter().append("circle")
      .attr("r", 20)
      .attr("cx", d => d)
      .attr("cy", 50);
    /*
          var rect1 = svg.append("rect").attr("x",0).attr("y",3*h/4).attr("width",w).attr("height",rect_1_h)
              .style("fill",rect_1_color);
        var rect2 = svg.append("rect").attr("x",xScale(dataset[1])).attr("y",3*h/4-rect_1_h/2).attr("width",rect_2_w)
              .attr("height",rect_2_h).style("fill",rect_2_color);
      
        //var texts = svg.selectAll("text").data(dataset).enter().append("text").text(function(d){ return d; }).attr("fill","red").attr("x",function(d,i){ return i*50  }).attr("y",30)
      
        var text1 = svg.append("text").attr("x",2).attr("y",h/3+2).text(dataset[0]).style("fill",text_color)
              .attr("font-size",font_size).attr("font-family",font_family);
        var text2 = svg.append("text").attr("x",w-42).attr("y",h/3+2).text(dataset[2]).style("fill",text_color)
              .attr("font-size",font_size).attr("font-family",font_family);
      */
    return svg;
  };

  registerHandlebarsHelpers() {
    const helpers = {
      "svg": GraphHandlebarsHelpers.graphic
    };

    Handlebars.registerHelper('svg', function (dataset, id) {
      var w = 154;
      var h = 42;
      var rect_1_h = 5;
      var rect_2_h = rect_1_h * 2;
      var rect_2_w = rect_1_h / 2;
      var rect_1_color = "#A1C9D9";
      var rect_2_color = "#999999";
      var text_color = "#555555";
      var font_size = 18;
      var font_family = "Segoe UI";

      /*------controller---- */

      //  var xScale = d3.scale.linear().domain([dataset[0],dataset[2]]).range([0,w]);
      console.log(dataset)
      console.log(id)
      console.log(this)
      console.log("element - gioppo")
      console.log($('#graph-version'))
      var svg1 = window.d3.create('svg')
      svg1.append('circle') // w/o "svg." not working
        .attr('cx', 50)
        .attr('cy', 50)
        .attr('r', 25)
        .style('fill', '#4400ff');
      console.log(svg1.node())
      console.log(svg1.node().outerHTML)
      $('#graph-version').html(svg1.node())
      /*
          var svg = window.d3.select( '#graph-version' ).append("svg").attr("width",w).attr("height",h);
        console.log(svg)
        svg.data([50, 100])
        .enter().append("circle")
          .attr("r", 20)
          .attr("cx", d => d)
          .attr("cy", 50);
  */
      var svgContainer = window.d3.select("#graph-version")
        .append("svg")
        .attr("width", 100)
        .attr("height", 100);
      return svgContainer;
    });

    //     if (IS_DEV_BUILD)
    //         logging.debug("Handlebars helpers registered:", Object.keys(helpers));
  }

  resource_data(id) {
    return {
      identifier: id,
      can_browse: game.user && game.user.can("FILES_BROWSE")
   }
  }

}