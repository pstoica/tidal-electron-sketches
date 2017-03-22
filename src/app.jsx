import React from "react";
import osc from "osc";
import EventEmitter from "events";

const sketches = {
  A: require("./sketches/A").default
};

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      activeSketch: "A"
    };

    // Create an osc.js UDP Port listening on port 57121.
    const udpPort = new osc.UDPPort({
      localAddress: "0.0.0.0",
      localPort: 8010,
      metadata: true
    });
    this.udpPort = udpPort;

    this.emitter = new EventEmitter();

    // Listen for incoming OSC bundles.
    udpPort.on("message", ({ args }) => {
      for (let i = 0; i < args.length / 2; i++) {
        event[args[i * 2].value] = args[i * 2 + 1].value;
      }

      this.emitter.emit("event", event);
    });

    udpPort.open();
  }

  componentWillUnmount() {
    this.udpPort.close();
    this.emitter.removeAllListeners();
  }

  handleEvent(event) {
    console.log(event);
    const { slot } = event;
    const slots = Object.assign({}, this.state.slots);
    slots[slot] = event;
  }

  render() {
    const { activeSketch } = this.state;

    if (activeSketch) {
      const Sketch = sketches[activeSketch];
      return <Sketch tidal={osc} />;
    } else {
      return <div />;
    }
  }
}
