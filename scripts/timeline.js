// Define the timeline layout function
export function createTimeline() {
    window.d3.layout = {};
    window.d3.layout.timeline = function () {
        var timelines = [];
        var dateAccessor = function (d) { return new Date(d); };
        var processedTimelines = [];
        var startAccessor = function (d) { return d.start; };
        var endAccessor = function (d) { return d.end; };
        var size = [800, 100]; // Width and Height for the timeline area
        var timelineExtent = [-Infinity, Infinity];
        var setExtent = [];
        var displayScale = window.d3.scaleLinear();
        var swimlanes = [];
        var padding = 0;
        var fixedExtent = false;
        var maximumHeight = Infinity;

        function processTimelines() {
            timelines.forEach(function (band) {
                var projectedBand = {};
                for (var x in band) {
                    if (band.hasOwnProperty(x)) {
                        projectedBand[x] = band[x];
                    }
                }
                projectedBand.start = dateAccessor(startAccessor(band));
                projectedBand.end = dateAccessor(endAccessor(band));
                projectedBand.lane = 0;
                processedTimelines.push(projectedBand);
            });
        }

        function projectTimelines() {
            if (!fixedExtent) {
                var minStart = window.d3.min(processedTimelines, function (d) { return d.start; });
                var maxEnd = window.d3.max(processedTimelines, function (d) { return d.end; });
                timelineExtent = [minStart, maxEnd];
            } else {
                timelineExtent = [dateAccessor(setExtent[0]), dateAccessor(setExtent[1])];
            }

            displayScale.domain(timelineExtent).range([0, size[0]]);

            processedTimelines.forEach(function (band) {
                band.originalStart = band.start;
                band.originalEnd = band.end;
                band.start = displayScale(band.start);
                band.end = displayScale(band.end);
            });
        }

        function fitsIn(lane, band) {
            if (lane.end < band.start || lane.start > band.end) {
                return true;
            }
            var filteredLane = lane.filter(function (d) {
                return d.start <= band.end && d.end >= band.start;
            });
            return filteredLane.length === 0;
        }

        function findlane(band) {
            if (!swimlanes[0]) {
                swimlanes[0] = [band];
                return;
            }
            var l = swimlanes.length - 1;
            var x = 0;

            while (x <= l) {
                if (fitsIn(swimlanes[x], band)) {
                    swimlanes[x].push(band);
                    return;
                }
                x++;
            }
            swimlanes[x] = [band];
        }

        function timeline(data) {
            if (!arguments.length) return timeline;

            timelines = data;
            processedTimelines = [];
            swimlanes = [];

            processTimelines();
            projectTimelines();

            processedTimelines.forEach(function (band) {
                findlane(band);
            });

            var height = size[1] / swimlanes.length;
            height = Math.min(height, maximumHeight);

            swimlanes.forEach(function (lane, i) {
                lane.forEach(function (band) {
                    band.y = i * height;
                    band.dy = height - padding;
                    band.lane = i;
                });
            });

            return processedTimelines;
        }

        timeline.dateFormat = function (_x) {
            if (!arguments.length) return dateAccessor;
            dateAccessor = _x;
            return timeline;
        };

        timeline.bandStart = function (_x) {
            if (!arguments.length) return startAccessor;
            startAccessor = _x;
            return timeline;
        };

        timeline.bandEnd = function (_x) {
            if (!arguments.length) return endAccessor;
            endAccessor = _x;
            return timeline;
        };

        timeline.size = function (_x) {
            if (!arguments.length) return size;
            size = _x;
            return timeline;
        };

        timeline.padding = function (_x) {
            if (!arguments.length) return padding;
            padding = _x;
            return timeline;
        };

        timeline.extent = function (_x) {
            if (!arguments.length) return timelineExtent;
            fixedExtent = true;
            setExtent = _x;
            if (!_x.length) {
                fixedExtent = false;
            }
            return timeline;
        };

        timeline.maxBandHeight = function (_x) {
            if (!arguments.length) return maximumHeight;
            maximumHeight = _x;
            return timeline;
        };

        return timeline;
    };
}
//const nodecat = window.SimpleCalendar.api.getCurrentCalendar().noteCategories
//export const types = getNoteCategoryNames(nodecat);
//const colorsArray = getNoteCategoryColors(nodecat);
// Other helper functions and constants can be exported similarly
//export const types = ["European", "Native", "Colonial", "Latin America", "Internal"];

//export const colorScale = window.d3.scaleOrdinal()
//    .domain(types)
 //   .range(colorsArray);
 //   .range(["#96abb1", "#313746", "#b0909d", "#687a97", "#292014"]);


// Function to extract colors from the noteCategories array
export function getNoteCategoryColors(noteCategories) {
    // Ensure noteCategories is an array
    if (Array.isArray(noteCategories)) {
        // Map over the noteCategories array to extract colors
        return noteCategories.map(category => category.color);
    } else {
        // Return an empty array if noteCategories is not an array
        return [];
    }
}

// Function to extract note category names from the noteCategories array
export function getNoteCategoryNames(noteCategories) {
    // Ensure noteCategories is an array
    if (Array.isArray(noteCategories)) {
        // Map over the noteCategories array to extract names
        return noteCategories.map(category => category.name);
    } else {
        // Return an empty array if noteCategories is not an array
        return [];
    }
}

export function convertNotes(inputJson) {
    // Convert date object to timestamp using the provided SimpleCalendar API function
    function dateToTimestamp(date) {
        // Assuming SimpleCalendar.api.dateToTimestamp is available in the environment
        return window.SimpleCalendar.api.dateToTimestamp(date);
    }

    function calDate(date) {
        // Assuming SimpleCalendar.api.dateToTimestamp is available in the environment
        return window.SimpleCalendar.api.formatDateTime(date);
    }
    

    // Extract the relevant fields from the input JSON
    const name = inputJson.name;
    const startDate = inputJson.flags["foundryvtt-simple-calendar"].noteData.startDate;
    const endDate = inputJson.flags["foundryvtt-simple-calendar"].noteData.endDate;
    const startCalDate = calDate(startDate);
    const endCalDate = calDate(endDate);
    const sphere = inputJson.flags["foundryvtt-simple-calendar"].noteData.categories;
    const link = inputJson.uuid;

    // Construct the output JSON with the desired structure
    const outputJson = {
        name: name,
        start: new Date(dateToTimestamp(startDate)),
        end: new Date(dateToTimestamp(endDate)),
        startLabel: startCalDate.date + " " + startCalDate.time,
        endLabel: endCalDate.date + " " + endCalDate.time,
        sphere: sphere,
        link: link,
        timestampStart: dateToTimestamp(startDate),
        timestampEnd: dateToTimestamp(endDate)
    };

    return outputJson;
}

export function getUniqueOrderedTimestamps(dataArray) {
    const timestamps = new Set(); // Use a Set to store unique values

    // Iterate through each object in the array
    dataArray.forEach(item => {
        // Add both timestampStart and timestampEnd to the Set
        timestamps.add(item.timestampStart);
        timestamps.add(item.timestampEnd);
    });

    // Convert the Set back to an array and sort it in ascending order
    return Array.from(timestamps).sort((a, b) => a - b);
}