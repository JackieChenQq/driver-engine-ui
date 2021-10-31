import { Component, OnInit, ViewChild  } from '@angular/core';
import * as d3all from 'd3';
export const d3 = Object.assign({}, d3all);

@Component({
  selector: 'app-topo',
  templateUrl: './topo.component.html',
  styleUrls: ['./topo.component.css']
})
export class TopoComponent implements OnInit {

  @ViewChild('chart') chart;

  svg: any;
  target: HTMLElement;
  width: any;
  height: any;
  color: any;
  xzoom: any;
  yzoom: any;
  force: any;
  drag: any;
  // Variables to hold the different components of our graph
  // we declare them here so they can be accessed from different functions
  link: any;
  circle: any;
  text: any;
  node: any;
  mode: any;
  // This will contain the currently selected node, used to display
  // connectivity
  selectedNode = null;
  // This will contain the node that has been hovered on
  activeNode = null;
  topofile: string;
  dr: number;
  that: any;

  ngOnInit(): void {
    setTimeout(() => {
      this.that = this;
      this.target = this.chart.nativeElement;
      // Define some global variables
      this.svg = d3.select(this.target);
      this.render();
      this.loadTopoData();
    }, 50);
  }
  loadTopoData() {
    console.log('load topo data');
    const that = this;
    // We load the topology data from file as JSON
    d3.json('mock-data/topo-bbc.json', (error, topoData) => {
      // console.log(topofile);
      if (error){
          alert('Unable to load ' + this.topofile);
          return;
      }
      topoData = topoData.result;
      // Each node has a unique id, we use it to index the nodes for
      // accessing them later on
      const nodeindex = {};
      for (const node of topoData.nodes){
          nodeindex[node.name] = node;
          node.connections = {};
          node.connected_nodes = 0;
      }
      // For each link we create references to nodes at both sides,
      // this is needed by the force layout.
      // Also add to each node the id's of nodes they are connected to.
      // This is used later for visualizing directly connected nodes
      for (const link of topoData.links){
          link.source = nodeindex[link.srcPeName];
          link.target = nodeindex[link.destPeName];
          // We also add how many connections we have from each node to each node
          if (link.source.connections[link.target.name]){
            link.source.connections[link.target.name]++;
          }
          else{
              link.source.connections[link.target.name] = 1;
              link.source.connected_nodes++;
          }

          if (link.target.connections[link.source.name]){
            link.target.connections[link.source.name]++;
          }
          else{
              link.target.connections[link.source.name] = 1;
              link.target.connected_nodes++;
          }

          // The rank on the link will symbolize what "nth" connection
          // between the same nodes this link is, this is used to visualize
          // many connections between the same two nodes in a visually pleasing way
          link.rank = link.source.connections[link.target.name];
      }
      that.render();
      that.updateGraph({nodes: topoData.nodes, links: topoData.links});
    });
  }

  // A utility function for parsing URL parameters
  getParameterByName(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  render(){
    const that = this;
    this.width  = this.svg.style('width').replace('px', '');
    this.height = this.svg.style('height').replace('px', '');

    // Set up the colour scale
    this.color = d3.scale.category20();

    // The scales for implementing zoom, every coordinate used for
    // drawing will have to go through these.
    this.xzoom = d3.scale.linear()
      .domain([0, that.width])
      .range([0, that.width]);

    this.yzoom = d3.scale.linear()
      .domain([0, that.height])
      .range([0, that.height]);

    // Assign the zoom behaviour to our SVG object.
    // The zoom behavior makes changes to our xzoom and yzoom scales based on
    // user input and calls the updateCoordinates function to update the coordinates
    // of our graph based on these updated scales.
    this.svg.call(d3.behavior.zoom()
          .x(that.xzoom)
          .y(that.yzoom)
          .scaleExtent([0.1, 8])
          .on('zoom',  () => {
            that.updateCoordinates(that);
          }))
          // Do not "zoom" on double-click
          .on('dblclick.zoom', null);

    // On window resize, we want the graph to also resize, so we have to update
    // the zoom scales, the force layout size and update all the coordinates of our elements.
    window.onresize = () => {
      that.width = window.innerWidth;
      that.height = window.innerHeight;
      that.force.size([that.width, that.height]);
      that.xzoom.range([0, that.width]);
      that.yzoom.range([0, that.height]);
      that.updateCoordinates(that);
    };

    // Set up the force layout
    this.force = d3.layout.force()
      .charge(-1000)
      .linkDistance(50)
      .size([that.width, that.height])
      .on('tick', () => {
        that.updateCoordinates(that);
      });

    // Make the nodes draggable
    this.drag = this.force.drag()
      // Once a node's been dragged it will stay fixed
      .on('dragstart', (d) => {
          d.fixed = true;
          // Do not propagate the drag event to svg element, which would
          // activate the zoom behavior's drag event and pan the entire view
          try{
            // tslint:disable-next-line: deprecation
            event.stopPropagation();
            ((d3.event) as d3.BaseEvent).sourceEvent.stopPropagation();
          }catch (ex){

          }
          console.log('dragstart');
          that.mode = 'drag';
      })
      .on('dragend', (d) => {
        that.mode = 'idle';
        console.log('dragend');
      })
      .on('drag', (d) => {
        console.log('draging');
    });

    this.svg.on('click', () => {
      that.mode = 'idle';
      that.unselectNodes();
    });
 }

 updateNodeinfo(node: any) {
  const info = d3.select('#infoview');
  info.select('#name').html(node.name);
  info.select('#name').html('0x' + node.name);
  info.select('#type').html(node.type);
  // info.select('#portcount').html(node.available_ports+' ('+node.connected_ports+')');
  info.select('#connections').html(node.connected_nodes);
}

// This function highlights all the nodes and links
// directly connected to the node with the name given as argument
// and fades everything else
selectNodes(curnode: any){
  this.updateNodeinfo(curnode);
  d3.select('#infoview').classed('topo_hidden', false);
  this.node.classed({
    topo_faded: (d: any) => {
          return !(d.name === curnode.name || d.connections[curnode.name]);
      },
    topo_highlight: (d: any) => {
          return d.name === curnode.name || d.connections[curnode.name];
      }
  });
  this.link.classed({
    topo_faded: (d: any) => {
          return !(d.source.name === curnode.name ||
                  d.target.name === curnode.name);
      },
    topo_highlight: (d: any) => {
          return d.source.name === curnode.name ||
                  d.target.name === curnode.name;
      }
  });
}

// This function displays all the nodes and links as unselected
unselectNodes(){
  this.node.classed('topo_selected', false);
  this.node.classed('topo_faded', false);
  this.node.classed('topo_highlight', false);
  this.link.classed('topo_faded', false);
  this.link.classed('topo_highlight', false);
  d3.select('#infoview').classed('topo_hidden', true);
}
// This function takes care of drawing the graph once the data has been
// loaded and formatted correctly
updateGraph(graph: any){
  const that = this;
  // We add our nodes and links and start the force layout generation.
  this.force.nodes(graph.nodes)
            .links(graph.links)
            .start();

  // Create all the line svgs but without locations yet
  this.link = this.svg.selectAll('.link')
              .data(graph.links)
              .enter().append('path')
              .attr('class', 'topo_link');


  // A node is a g element containing a circle and some text
  this.node = this.svg.selectAll('.node')
    .data(graph.nodes)
    .enter().append('g')
    .on('mouseover', function(){
      if (this.mode === 'drag' || this.mode === 'selected'){
        return;
      }
      that.selectNodes(this.__data__);
    })
    .on('click', () => {
      // tslint:disable-next-line: deprecation
      event.stopPropagation();
      // d3.select(this).classed('selected',true);
      // mode='selected';
    })
    .on('dblclick', (d: any) => {
      d.fixed = false;
    })
    .on('mouseout', () => {
      that.unselectNodes();
    })
    .call(that.force.drag);
  this.circle = this.node.append('circle')
                .attr('class', 'topo_node')
                .attr('r', 8)
                .style('fill', (d) => {
                    return that.color(d.type);
                });
  this.text = this.node.append('text')
              .text((d: any) => d.name)
              .attr('class', 'topo_nodename')
              .attr('dx', 8)
              .attr('dy', '.35em');
}

  // This function will update the coordinates of our nodes and links
  // based on the data. This basically carries out the layout animation
  // as it is used for the tick function of the force layout
  updateCoordinates(thatObj: any) {
    const that = this;
    if (!that.link){
      console.log('update coordinates failed, link is null');
      return;
    }
    // We draw the links as curved paths, with the radius of the curve
    // being dependant on the distance between the nodes
    this.link.attr('d', (d) => {
        let srcX = that.xzoom(d.source.x);
        let srcY = that.yzoom(d.source.y);
        let dstX = that.xzoom(d.target.x);
        let dstY = that.yzoom(d.target.y);

        const dx = dstX - srcX;
        const dy = dstY - srcY;

        // The radius is also dependant of the "rank" of the link
        this.dr = Math.sqrt(dx * dx + dy * dy) * d.rank;

        // And we alternate the "direction" of the curve for even and odd ranks
        // The direction can be altered by swapping the endpoints of the curve.
        if (d.rank % 2 === 0){
            let swap = srcX;
            srcX = dstX;
            dstX = swap;

            swap = srcY;
            srcY = dstY;
            dstY = swap;
        }
        return 'M' +
            srcX + ',' +
            srcY + 'A' +
            that.dr + ',' + that.dr + ' 0 0,1 ' +
            dstX + ',' +
            dstY;
    });

    // Causes some weird yanking when dragging a node
    // node.attr('transform', function(d) {
    //     return 'translate(' + d.x + ',' + d.y +')'
    // })

    // Changing the coordinates of the circle and text
    // separately makes dragging smooth.
    this.circle.attr('cx', (d) => {
        return that.xzoom(d.x);
    })
    .attr('cy', (d) => {
        return that.yzoom(d.y);
    });

    this.text.attr('x', (d) => {
        return that.xzoom(d.x);
    })
    .attr('y', (d) => {
        return that.yzoom(d.y);
    });

  }

}
