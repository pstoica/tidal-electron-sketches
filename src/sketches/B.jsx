import React from "react";
import Color from "color";

const BACKGROUND = "#292c35";
const COLORS = ["#292c35", "#ffffff"];

// B is for Bar
class Bar {
  constructor(props) {
    this.x = props.x || 0;
    this.width = props.width || 0;
    this.color = props.color || 0;
    this.dur = props.dur || 30;
    this.life = props.life || 1;
  }
}

export default class App extends React.Component {
  constructor() {
    super();

    this.bars = [];
  }

  componentDidMount() {
    this.props.tidal.on("event", event => {
      this.bars.push(new Bar(event));
    });

    requestAnimationFrame(this.draw.bind(this));

    window.onresize = () => this.setCanvasSize();

    this.ctx = this.canvas.getContext("2d");
    this.setCanvasSize();
  }

  setCanvasSize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  componentWillUnmount() {
    window.onresize = null;
  }

  draw() {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.bars = this.bars.filter(bar => {
      // side effect
      bar.life = bar.life - 1 / bar.dur;

      if (bar.life > 0) {
        const { x, width, color, life } = bar;
        this.ctx.fillStyle = `rgba(255, 255, 255, ${life})`;
        this.ctx.fillRect(
          Math.floor(this.width * ((x > 0 ? x % 100 : Math.abs(x)) / 100)),
          0,
          Math.floor(this.width * (width / 100)),
          this.height
        );

        return true;
      }

      return false;
    });

    requestAnimationFrame(this.draw.bind(this));
  }

  render() {
    return <canvas ref={c => this.canvas = c} />;
  }
}
