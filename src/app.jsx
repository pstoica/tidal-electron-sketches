import React from "react";
import osc from "osc";
import EventEmitter from "events";

const sketches = {
  A: require("./sketches/A").default,
  B: require("./sketches/B").default,
  C: require("./sketches/C").default
};

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      activeSketch: "C"
    };

    // Create an osc.js UDP Port listening on port 57121.
    const udpPort = new osc.UDPPort({
      localAddress: "0.0.0.0",
      localPort: 8010,
      metadata: true
    });
    this.udpPort = udpPort;

    // Listen for incoming OSC bundles.
    udpPort.on("message", ({ args }) => {
      const event = {};
      for (let i = 0; i < args.length / 2; i++) {
        event[args[i * 2].value] = args[i * 2 + 1].value;
      }

      // console.log(event);

      this.emitter.emit("event", event);
    });

    udpPort.open();

    this.emitter = new EventEmitter();
  }

  componentWillUnmount() {
    this.udpPort.close();
    this.emitter.removeAllListeners();
  }

  render() {
    const { activeSketch } = this.state;

    if (activeSketch) {
      const Sketch = sketches[activeSketch];
      return <Sketch tidal={this.emitter} />;
    } else {
      return <div />;
    }
  }
}
