import React from "react";
import osc from "osc";
import { css } from "glamor";

const COLORS = ["#c7b5ae", "#91a09d", "#648489", "#d59b8d"];

const Word = ({ word, color = 0 } = {}) => (
  <div {...css({ padding: "100px 0" })}>
    <div
      {...css({
        fontFamily: "-apple-system, BlinkMacSystemFont",
        fontSize: 40,
        textAlign: "center",
        backgroundColor: COLORS[color % COLORS.length] || COLORS[0],
        color: "white",
        width: "50%",
        margin: "0 auto",
        transition: "0.5s linear all",
        padding: "140px 20px",
        borderRadius: 50
      })}
    >
      {word.replace("_", " ")}
    </div>
  </div>
);

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      slots: {
        word1: {
          word: "lol"
        },
        word2: {
          word: "_"
        }
      }
    };
  }

  componentDidMount() {
    // Create an osc.js UDP Port listening on port 57121.
    const udpPort = new osc.UDPPort({
      localAddress: "0.0.0.0",
      localPort: 8010,
      metadata: true
    });

    // Listen for incoming OSC bundles.
    udpPort.on("message", ({ args }) => {
      const event = { slot: "word1" };
      for (let i = 0; i < args.length / 2; i++) {
        event[args[i * 2].value] = args[i * 2 + 1].value;
      }

      this.handleEvent(event);
    });

    // Open the socket.
    udpPort.open();
    console.log("woot");

    this.udpPort = udpPort;
  }

  componentWillUnmount() {
    this.udpPort.close();
  }

  handleEvent(event) {
    console.log(event);
    const { slot } = event;
    const slots = Object.assign({}, this.state.slots);
    slots[slot] = event;
    this.setState({ slots });
  }

  render() {
    return (
      <div>
        <Word {...this.state.slots.word1} />
        <Word {...this.state.slots.word2} />
      </div>
    );
  }
}
