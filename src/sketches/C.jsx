import React from "react";
import Color from "color";

// #292c35
const COLORS = ["#292c35", "#d4cac9", "#efb8ac", "#589ea8", "#9cbec1"].map(
  x => new Color(x)
);

const LIFE_PER_FRAME = 1 / 60;

const degreesToRadians = degrees => degrees * (Math.PI / 180);

// C is for Circle
class Circle {
  constructor(props) {
    this.color = COLORS[(props.color || 1) % COLORS.length];
    this.x = props.x || 0.5;
    this.y = props.y || 0.5;
    this.r = props.r || 0.5;
    this.w = props.w || 1;
    this.begin = props.begin || 0;
    this.end = props.end || 1;
    this.life = props.life || 1;
  }
}

export default class App extends React.Component {
  constructor() {
    super();

    this.circles = [];
  }

  componentDidMount() {
    this.props.tidal.on("event", event => {
      this.circles.push(new Circle(event));
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
    this.ctx.fillStyle = COLORS[0].rgb().string();
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    this.circles = this.circles.filter(circle => {
      // side effect
      circle.life = circle.life - LIFE_PER_FRAME;

      if (circle.life > 0) {
        const { x, y, r, w, begin, end, color, life } = circle;
        this.ctx.strokeStyle = color.alpha(life).rgb().string();
        this.ctx.lineCap = "round";
        this.ctx.lineWidth = w;
        this.ctx.beginPath();
        this.ctx.arc(
          x * this.width,
          y * this.height,
          this.height / 2 * r,
          degreesToRadians(360 * begin),
          degreesToRadians(360 * end)
        );
        this.ctx.stroke();

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
