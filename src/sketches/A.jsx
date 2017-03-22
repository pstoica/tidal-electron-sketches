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
          word: "lmao"
        }
      }
    };
  }

  componentDidMount() {
    this.props.tidal.on("event", event => {
      const { slot = "word1" } = event;
      const slots = Object.assign({}, this.state.slots);
      slots[slot] = event;
      this.setState({ slots });
    });
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
