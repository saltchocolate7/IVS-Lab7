// Activity 2
// Step 2.1

Promise.all([
   d3.json("./topo.json"), //load the TopoJSON data 
   d3.csv("./cities.csv"), //load the GPS coords for cities 
   d3.csv("./states.csv")  //load the state population for each state  
]).then((data) => {

    console.log(data);

    const topology = data[0];
    const cities = data[1];
    const states = data[2];

    console.log(cities);
    console.log(states);

    //create a dictionary for states and populations
    const stateDictionary = new Map();
    states.forEach((state) => {  
        stateDictionary.set(state.State, +state["2018 Population"])
    })

    console.log(stateDictionary);
    // Step 2.2
    var blues = d3.scaleSequential()
                   .domain(d3.extent(stateDictionary.values()))
                   .range(["white", "steelblue"]);
    console.log(d3.extent(stateDictionary.values()));
    
    // Activity 1
    const topo = topojson.feature(topology, topology.objects.states)
    var projection = d3.geoAlbersUsa().scale(700).translate([487.5, 305])
    var path = d3.geoPath(projection);

    //map
    const svg = d3.select("#geomap").append('g').attr('transform', 'translate(50,50)');
    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
        .attr("d", path)
        .attr("fill", d => blues(stateDictionary.get(d.properties.name))) //Step 2.2
        .attr("stroke", "black")
        .attr("stroke-width", "1px");

    // Step 2.3
    svg.append("g")
        .selectAll("circle")
        .data(cities)
        .join("circle")
        .attr('cx', (d) => {
            return projection([+d.longitude, +d.latitude])[0]
        })
        .attr('cy', (d) => {
            return projection([+d.longitude, +d.latitude])[1]
        })
        .attr("r", 5)
        .attr("fill", "red");

})
