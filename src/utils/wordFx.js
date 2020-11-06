import anime from "animejs/lib/anime.es.js";
import charming from "charming";
import "./wordFx.css";

export function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export function randomBetween(minValue, maxValue, precision) {
  if (typeof precision == "undefined") {
    precision = 2;
  }
  return parseFloat(
    Math.min(
      minValue + Math.random() * (maxValue - minValue),
      maxValue
    ).toFixed(precision)
  );
}

let winsize = { width: window.innerWidth, height: window.innerHeight };

class Shape {
  constructor(type, letterRect, options) {
    this.DOM = {};
    this.options = {
      shapeTypes: ["circle", "rect", "polygon"],
      shapeColors: [
        "#e07272",
        "#0805b5",
        "#49c6ff",
        "#8bc34a",
        "#1e1e21",
        "#e24e81",
        "#e0cd24",
      ],
      shapeFill: true,
      shapeStrokeWidth: 1,
    };
    Object.assign(this.options, options);
    this.type = type || this.options.shapeTypes[0];
    if (this.type !== "random" && !this.options.types.includes(this.type))
      return;
    if (this.type === "random")
      this.type = this.options.shapeTypes[
        randomBetween(0, this.options.shapeTypes.length - 1, 0)
      ];
    this.letterRect = letterRect;
    this.init();
  }
  init() {
    this.DOM.el = document.createElementNS(
      "http://www.w3.org/2000/svg",
      this.type
    );
    this.DOM.el.style.opacity = 0;
    this.configureShapeType();

    if (this.options.shapeFill) {
      this.DOM.el.setAttribute(
        "fill",
        this.options.shapeColors[
          randomBetween(0, this.options.shapeColors.length - 1, 0)
        ]
      );
    } else {
      this.DOM.el.setAttribute("fill", "none");
      this.DOM.el.setAttribute("stroke-width", this.options.shapeStrokeWidth);
      this.DOM.el.setAttribute(
        "stroke",
        this.options.shapeColors[
          randomBetween(0, this.options.shapeColors.length - 1, 0)
        ]
      );
    }
  }
  configureShapeType() {
    this.DOM.el.style.transformOrigin = `${this.letterRect.left +
      this.letterRect.width / 2}px ${this.letterRect.top +
      this.letterRect.height / 2}px`;

    if (this.type === "circle") {
      const r = 0.5 * this.letterRect.width;
      this.DOM.el.setAttribute("r", r);
      this.DOM.el.setAttribute(
        "cx",
        this.letterRect.left + this.letterRect.width / 2
      );
      this.DOM.el.setAttribute(
        "cy",
        this.letterRect.top + this.letterRect.height / 2
      );
    } else if (this.type === "rect") {
      const w = randomBetween(0.05, 0.5, 3) * this.letterRect.width;
      const h = randomBetween(0.05, 0.5, 3) * this.letterRect.height;
      this.DOM.el.setAttribute("width", w);
      this.DOM.el.setAttribute("height", h);
      this.DOM.el.setAttribute(
        "x",
        this.letterRect.left + (this.letterRect.width - w) / 2
      );
      this.DOM.el.setAttribute(
        "y",
        this.letterRect.top + (this.letterRect.height - h) / 2
      );
    } else if (this.type === "polygon") {
      this.DOM.el.setAttribute(
        "points",
        `${this.letterRect.left} ${this.letterRect.top +
          this.letterRect.height}, ${this.letterRect.left +
          this.letterRect.width / 2} ${this.letterRect.bottom -
          this.letterRect.width}, ${this.letterRect.left +
          this.letterRect.width} ${this.letterRect.top +
          this.letterRect.height}`
      );
    }
  }
  onResize(letterRect) {
    this.letterRect = letterRect;
    this.configureShapeType();
  }
}

class Letter {
  constructor(el, svg, options) {
    this.DOM = {};
    this.DOM.el = el;
    this.DOM.svg = svg;
    this.options = {
      totalShapes: 10,
    };
    Object.assign(this.options, options);
    this.rect = this.DOM.el.getBoundingClientRect();
    this.totalShapes = this.options.totalShapes;
    this.init();
    this.initEvents();
  }
  init() {
    this.shapes = [];
    for (let i = 0; i <= this.totalShapes - 1; ++i) {
      const shape = new Shape("random", this.rect, this.options);
      this.shapes.push(shape);
      this.DOM.svg.appendChild(shape.DOM.el);
    }
  }
  initEvents() {
    window.addEventListener(
      "resize",
      debounce(() => {
        this.rect = this.DOM.el.getBoundingClientRect();
        for (let i = 0; i <= this.totalShapes - 1; ++i) {
          const shape = this.shapes[i];
          shape.onResize(this.rect);
        }
      }, 20)
    );
  }
}

class Word {
  constructor(el, config) {
    this.DOM = {};
    this.DOM.el = el;
    this.options = {
      shapesOnTop: false,
    };
    this.config = {};
    this.anime = anime;
    this.randomBetween = randomBetween;
    Object.assign(this.config, config);
    Object.assign(this.options, config.options);
    this.init();
    this.initEvents();
  }
  reconfig(config) {
    this.config = {};
    this.options = {
      shapesOnTop: false,
    };
    Object.assign(this.config, config);
    Object.assign(this.options, config.options);
  }
  init() {
    this.createSVG();
    charming(this.DOM.el);
    this.letters = [];
    Array.from(this.DOM.el.querySelectorAll("span")).forEach((letter) =>
      this.letters.push(new Letter(letter, this.DOM.svg, this.options))
    );
  }
  initEvents() {
    window.addEventListener(
      "resize",
      debounce(() => {
        winsize = { width: window.innerWidth, height: window.innerHeight };
        this.DOM.svg.setAttribute("width", `${winsize.width}px`);
        this.DOM.svg.setAttribute("height", `${winsize.width}px`);
        this.DOM.svg.setAttribute(
          "viewbox",
          `0 0 ${winsize.width} ${winsize.height}`
        );
      }, 20)
    );
  }
  createSVG() {
    const parentNode = document.getElementById('word').parentNode;
    const elemenetSize = {width:parentNode.scrollWidth,height:parentNode.scrollHeight}
    this.DOM.svg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    this.DOM.svg.setAttribute("class", "shapes");
    this.DOM.svg.setAttribute("width", `${elemenetSize.width}px`);
    this.DOM.svg.setAttribute("height", `${elemenetSize.width}px`);
    this.DOM.svg.setAttribute(
      "viewbox",
      `0 0 ${elemenetSize.width} ${elemenetSize.height}`
    );
    if (this.options.shapesOnTop) {
      this.DOM.el.parentNode.insertBefore(
        this.DOM.svg,
        this.DOM.el.nextSibling
      );
    } else {
      this.DOM.el.parentNode.insertBefore(this.DOM.svg, this.DOM.el);
    }
  }
  show(config) {
    return this.toggle("show", config || this.config.show);
  }
  hide(config) {
    return this.toggle("hide", config || this.config.hide);
  }
  toggle(action = "show", config) {
    return new Promise((resolve) => {
      const toggleNow = () => {
        for (let i = 0, len = this.letters.length; i <= len - 1; ++i) {
          this.letters[i].DOM.el.style.opacity = action === "show" ? 1 : 0;
        }
        resolve();
      };

      if (config && Object.keys(config).length !== 0) {
        if (config.shapesAnimationOpts) {
          for (let i = 0, len = this.letters.length; i <= len - 1; ++i) {
            const letter = this.letters[i];
            setTimeout(
              (function(letter) {
                return () => {
                  config.shapesAnimationOpts.targets = letter.shapes.map(
                    (shape) => shape.DOM.el
                  );
                  anime.remove(config.shapesAnimationOpts.targets);
                  anime(config.shapesAnimationOpts);
                };
              })(letter),
              config.lettersAnimationOpts && config.lettersAnimationOpts.delay
                ? config.lettersAnimationOpts.delay(letter.DOM.el, i)
                : 0
            );
          }
        }
        if (config.lettersAnimationOpts) {
          config.lettersAnimationOpts.targets = this.letters.map(
            (letter) => letter.DOM.el
          );
          config.lettersAnimationOpts.complete = () => {
            if (action === "hide") {
              for (
                let i = 0, len = config.lettersAnimationOpts.targets.length;
                i <= len - 1;
                ++i
              ) {
                config.lettersAnimationOpts.targets[i].style.transform = "none";
              }
            }
            resolve();
          };
          anime(config.lettersAnimationOpts);
        } else {
          toggleNow();
        }
      } else {
        toggleNow();
      }
    });
  }
}

export class Slideshow {
  constructor(el) {
    this.DOM = {};
    this.DOM.el = el;
    this.DOM.slides = Array.from(this.DOM.el.querySelectorAll(".slide"));
    this.DOM.bgs = Array.from(this.DOM.el.querySelectorAll(".slide__bg"));
    this.DOM.words = Array.from(this.DOM.el.querySelectorAll(".word"));
    this.slidesTotal = this.DOM.slides.length;
    this.current = 0;
    this.words = [];
    this.DOM.words.forEach((word, pos) => {
      this.words.push(new Word(word, WorkEffect[pos].options));
    });

    this.isAnimating = true;
    this.words[this.current]
      .show(WorkEffect[this.current].show)
      .then(() => (this.isAnimating = false));
  }
  show(direction) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    let newPos;
    let currentPos = this.current;
    if (direction === "next") {
      newPos = currentPos < this.slidesTotal - 1 ? currentPos + 1 : 0;
    } else if (direction === "prev") {
      newPos = currentPos > 0 ? currentPos - 1 : this.slidesTotal - 1;
    }

    this.DOM.slides[newPos].style.opacity = 1;
    this.DOM.bgs[newPos].style.transform = "none";
    anime({
      targets: this.DOM.bgs[currentPos],
      duration: 600,
      translateY: ["0%", direction === "next" ? "-100%" : "100%"],
      complete: () => {
        this.DOM.slides[currentPos].classList.remove("slide--current");
        this.DOM.slides[currentPos].style.opacity = 0;
        this.DOM.slides[newPos].classList.add("slide--current");
        this.words[newPos]
          .show(WorkEffect[newPos].show)
          .then(() => (this.isAnimating = false));
      },
    });

    this.words[newPos].hide();
    this.words[this.current].hide(WorkEffect[currentPos].hide).then(() => {
      this.current = newPos;
    });
  }
}

export const WorkEffect = [
  // Effect 1
  {
    options: {
      shapeColors: [
        "#6435ea",
        "#295ddc",
        "#9fd7ff",
        "#d65380",
        "#0228f7",
        "#242627",
      ],
    },
    hide: {
      lettersAnimationOpts: {
        duration: 800,
        delay: (t, i) => i * 40,
        easing: "easeOutExpo",
        opacity: {
          value: 0,
          duration: 100,
          delay: (t, i) => i * 40,
          easing: "linear",
        },
        translateY: ["0%", "100%"],
      },
    },
    show: {
      lettersAnimationOpts: {
        duration: 800,
        delay: (t, i) => i * 40,
        easing: "easeOutElastic",
        opacity: [0, 1],
        translateY: ["100%", "0%"],
      },
      shapesAnimationOpts: {
        duration: 300,
        delay: (t, i) => i * 30 + 100,
        easing: "easeOutQuad",
        translateY: () => [anime.random(-15, 15), anime.random(-200, 200)],
        scale: () => [0.2, randomBetween(0.5, 1)],
        opacity: [
          {
            value: 1,
            duration: 1,
            delay: (t, i) => i * 30 + 100,
          },
          {
            value: 0,
            duration: 200,
            delay: 200,
            easing: "linear",
          },
        ],
      },
    },
  },
  // Effect 2
  {
    options: {
      shapeColors: ["#0671e6"],
      shapeTypes: ["circle"],
      shapeFill: false,
      shapeStrokeWidth: 3,
    },
    hide: {
      lettersAnimationOpts: {
        duration: 300,
        delay: (t, i) => i * 25,
        easing: "easeOutQuad",
        opacity: {
          value: 0,
          duration: 100,
          delay: (t, i) => i * 25,
          easing: "linear",
        },
        translateY: ["0%", "-50%"],
      },
      shapesAnimationOpts: {
        duration: 300,
        delay: (t, i) => i * 20,
        easing: "easeOutExpo",
        translateX: () => anime.random(-10, 10),
        translateY: () => -1 * anime.random(400, 800),
        scale: [0.3, 0.3],
        opacity: [
          {
            value: 1,
            duration: 1,
            delay: (t, i) => i * 20,
          },
          {
            value: 0,
            duration: 300,
            easing: "linear",
          },
        ],
      },
    },
    show: {
      lettersAnimationOpts: {
        duration: 800,
        delay: (t, i, total) => Math.abs(total / 2 - i) * 60,
        easing: "easeOutElastic",
        opacity: [0, 1],
        translateY: ["50%", "0%"],
      },
      shapesAnimationOpts: {
        duration: 700,
        delay: (t, i) => i * 60,
        easing: "easeOutExpo",
        translateX: () => {
          const rand = anime.random(-100, 100);
          return [rand, rand];
        },
        translateY: () => {
          const rand = anime.random(-100, 100);
          return [rand, rand];
        },
        scale: () => [randomBetween(0.1, 0.3), randomBetween(0.5, 0.8)],
        opacity: [
          { value: 1, duration: 1, delay: (t, i) => i * 80 },
          { value: 0, duration: 700, easing: "easeOutQuad", delay: 100 },
        ],
      },
    },
  },
  // Effect 3
  {
    options: {
      shapeColors: ["#111"],
    },
    hide: {
      shapesAnimationOpts: {
        duration: 200,
        delay: (t, i) => i * 20,
        easing: "easeOutExpo",
        translateX: (t) => t.dataset.tx,
        translateY: (t) => t.dataset.ty - anime.random(400, 800),
        scale: (t) => t.dataset.s,
        rotate: 0,
        opacity: {
          value: 0,
          duration: 200,
          easing: "linear",
        },
      },
    },
    show: {
      lettersAnimationOpts: {
        duration: 500,
        delay: (t, i) => i * 60,
        easing: "easeOutExpo",
        opacity: {
          value: [0, 1],
          duration: 50,
          delay: (t, i) => i * 60,
          easing: "linear",
        },
        translateY: (t, i) =>
          i % 2 ? [anime.random(-350, -300), 0] : [anime.random(300, 350), 0],
      },
      shapesAnimationOpts: {
        duration: () => anime.random(1000, 4000),
        delay: (t, i) => i * 20,
        easing: "easeOutElastic",
        translateX: (t) => {
          const tx = anime.random(-200, 200);
          t.dataset.tx = tx;
          return [0, tx];
        },
        translateY: (t) => {
          const ty = anime.random(-300, 300);
          t.dataset.ty = ty;
          return [0, ty];
        },
        scale: (t) => {
          const s = randomBetween(0.2, 0.6);
          t.dataset.s = s;
          return [s, s];
        },
        rotate: () => anime.random(-90, 90),
        opacity: {
          value: 0.6,
          duration: 1000,
          easing: "linear",
        },
      },
    },
  },
  // Effect 4
  {
    options: {
      // shape elements will be on top of the letters
      shapesOnTop: true,
      shapeColors: ["#ec4747", "#5447ec", "#ecb447", "#a847ec", "#635f65"],
      totalShapes: 20,
    },
    hide: {
      lettersAnimationOpts: {
        duration: 200,
        delay: (t, i, total) => (total - i - 1) * 20,
        easing: "easeOutExpo",
        opacity: {
          value: [1, 0],
          duration: 100,
          delay: (t, i, total) => (total - i - 1) * 20,
          easing: "linear",
        },
        scale: [1, 0],
      },
    },
    show: {
      lettersAnimationOpts: {
        duration: 400,
        delay: (t, i) => i * 60,
        easing: "easeInOutExpo",
        opacity: [0, 1],
        translateY: ["-100%", "0%"],
      },
      shapesAnimationOpts: {
        duration: 400,
        delay: (t, i) => i * 20,
        easing: "easeOutBack",
        translateX: {
          value: () => [anime.random(-100, 100), anime.random(-10, 10)],
          easing: "easeOutExpo",
        },
        translateY: () => [anime.random(-100, 0), anime.random(-400, -50)],
        scale: () => {
          const rand = randomBetween(0.2, 0.5);
          return [rand, rand];
        },
        rotate: () => anime.random(-15, 15),
        opacity: [
          {
            value: 1,
            duration: 1,
            delay: (t, i) => i * 20,
          },
          {
            value: 0,
            duration: 500,
            easing: "linear",
          },
        ],
      },
    },
  },
  // Effect 5
  {
    options: {
      shapesOnTop: true,
      shapeColors: ["#ec4747", "#5447ec", "#ecb447", "#a847ec", "#635f65"],
      shapeFill: false,
      shapeStrokeWidth: 4,
      totalShapes: 30,
    },
    show: {
      lettersAnimationOpts: {
        duration: 300,
        delay: (t, i) => i * 100,
        easing: "easeInExpo",
        opacity: [0, 1],
        translateY: ["-50%", "0%"],
      },
      shapesAnimationOpts: {
        duration: 400,
        delay: (t, i) => i * 5 + 300,
        easing: "easeOutExpo",
        translateX: () => [0, anime.random(-100, 100)],
        translateY: () => [50, anime.random(-100, 150)],
        scale: () => [randomBetween(0.2, 0.4), randomBetween(0.2, 0.4)],
        rotate: () => anime.random(-25, 25),
        opacity: [
          {
            value: 1,
            duration: 1,
            easing: "easeOutQuad",
            delay: (t, i) => i * 5 + 300,
          },
          { value: 0, duration: 250, easing: "easeOutQuad", delay: 200 },
        ],
      },
    },
  },
  // Effect 6
  {
    options: {
      shapeColors: ["#fff", "#dedede", "#8c8c8c", "#545454", "#000", "#dc2e2e"],
    },
    hide: {
      lettersAnimationOpts: {
        duration: 200,
        delay: (t, i, total) => (total - i - 1) * 20,
        easing: "easeOutExpo",
        opacity: {
          value: [1, 0],
          duration: 100,
          delay: (t, i, total) => (total - i - 1) * 20,
          easing: "linear",
        },
        scale: [1, 0],
      },
    },
    show: {
      lettersAnimationOpts: {
        duration: 400,
        delay: (t, i) => i * 60,
        easing: "easeInExpo",
        opacity: [0, 1],
        scale: [0, 1],
      },
      shapesAnimationOpts: {
        duration: 700,
        delay: (t, i) => i * 40,
        easing: "easeOutExpo",
        translateX: () => [0, anime.random(-20, 20)],
        translateY: () => [0, anime.random(-400, 400)],
        scale: () => [randomBetween(0.2, 0.6), randomBetween(0.2, 0.6)],
        rotate: () => [0, anime.random(-16, 16)],
        opacity: [
          { value: 1, duration: 1, easing: "linear" },
          { value: 0, duration: 700, easing: "easeOutQuad" },
        ],
      },
    },
  },
  // Effect 7
  {
    options: {
      shapeColors: ["red", "#000", "#fff"],
      shapeFill: false,
      shapeStrokeWidth: 10,
    },
    hide: {
      shapesAnimationOpts: {
        duration: 250,
        delay: (t, i) => i * 20,
        easing: "easeOutExpo",
        translateX: () => [0, anime.random(-200, 200)],
        translateY: () => [0, anime.random(-200, 200)],
        scale: () => [randomBetween(0.2, 0.6), randomBetween(0.2, 0.6)],
        rotate: () => [0, anime.random(-16, 16)],
        opacity: [
          { value: 1, duration: 1, easing: "linear", delay: (t, i) => i * 20 },
          { value: 0, duration: 150, delay: 100, easing: "easeOutQuad" },
        ],
      },
    },
    show: {
      lettersAnimationOpts: {
        duration: 400,
        delay: (t, i) => i * 60,
        easing: "easeOutExpo",
        opacity: {
          value: [0, 1],
          duration: 100,
          easing: "linear",
        },
        translateY: (t, i) =>
          i % 2 ? [anime.random(-350, -300), 0] : [anime.random(300, 350), 0],
      },
      shapesAnimationOpts: {
        duration: 500,
        delay: (t, i) => i * 30,
        easing: "easeOutExpo",
        translateX: () => [0, anime.random(-200, 200)],
        translateY: () => [0, anime.random(-200, 200)],
        scale: () => [randomBetween(0.2, 0.6), randomBetween(0.2, 0.6)],
        rotate: () => [0, anime.random(-16, 16)],
        opacity: [
          { value: 1, duration: 1, easing: "linear" },
          { value: 0, duration: 350, delay: 150, easing: "easeOutQuad" },
        ],
      },
    },
  },
  // Effect 8
  {
    options: {
      shapeColors: ["#35c394", "#9985ee", "#f54665", "#4718f5", "#f5aa18"],
      shapesOnTop: true,
    },
    hide: {
      lettersAnimationOpts: {
        duration: 300,
        delay: (t, i) => (t.parentNode.children.length - i - 1) * 30,
        easing: "easeOutExpo",
        opacity: 0,
        translateY: (t, i) => (i % 2 === 0 ? "80%" : "-80%"),
        rotate: (t, i) => (i % 2 === 0 ? -25 : 25),
      },
      shapesAnimationOpts: {
        duration: 50,
        easing: "easeOutExpo",
        translateX: (t) => t.dataset.tx,
        translateY: (t) => t.dataset.ty,
        scale: 0,
        rotate: 0,
        opacity: {
          value: 0,
          duration: 50,
          easing: "linear",
        },
      },
    },
    show: {
      lettersAnimationOpts: {
        duration: 400,
        delay: (t, i) => (t.parentNode.children.length - i - 1) * 80,
        easing: "easeOutElastic",
        opacity: {
          value: [0, 1],
          duration: 100,
          easing: "linear",
        },
        translateY: (t, i) => (i % 2 === 0 ? ["-80%", "0%"] : ["80%", "0%"]),
        rotate: [90, 0],
      },
      shapesAnimationOpts: {
        duration: () => anime.random(1000, 3000),
        delay: (t, i) => i * 20,
        easing: "easeOutElastic",
        translateX: (t) => {
          const tx = anime.random(-250, 250);
          t.dataset.tx = tx;
          return [0, tx];
        },
        translateY: (t) => {
          const ty = anime.random(-250, 250);
          t.dataset.ty = ty;
          return [0, ty];
        },
        scale: (t) => {
          const s = randomBetween(0.1, 0.6);
          t.dataset.s = s;
          return [s, s];
        },
        rotate: () => anime.random(-90, 90),
        opacity: {
          value: 0.6,
          duration: 1000,
          easing: "linear",
        },
      },
    },
  },
  // Effect 9
  {
    options: {
      shapeColors: ["#FD74FF", "#3771FC", "#7C5CE4", "#542A95", "#ACC7FE"],
      shapeTypes: ["rect", "polygon"],
      totalShapes: 1,
    },
    hide: {
      lettersAnimationOpts: {
        duration: () => anime.random(800, 1000),
        delay: () => anime.random(0, 80),
        easing: "easeInOutExpo",
        opacity: 0,
        translateY: "300%",
        rotateZ: () => anime.random(-50, 50),
      },
      shapesAnimationOpts: {
        duration: 350,
        easing: "easeOutExpo",
        translateX: (t) => [t.dataset.tx, anime.random(-25, 25)],
        translateY: (t) => [t.dataset.ty, anime.random(-25, 25)],
        scale: 1,
        rotate: 0,
        opacity: {
          value: 0,
          duration: 200,
          easing: "linear",
        },
      },
    },
    show: {
      lettersAnimationOpts: {
        duration: 800,
        delay: () => anime.random(0, 75),
        easing: "easeInOutExpo",
        opacity: [0, 1],
        translateY: ["-300%", "0%"],
        rotate: () => [anime.random(-50, 50), 0],
      },
      shapesAnimationOpts: {
        duration: 2000,
        easing: "easeOutExpo",
        translateY: (t) => {
          const ty = anime.random(-300, 300);
          t.dataset.ty = ty;
          return [anime.random(-25, 25), ty];
        },
        scale: (t) => {
          const s = randomBetween(1.5, 2);
          t.dataset.s = s;
          return [s, s];
        },
        rotate: () => anime.random(-45, 45),
        opacity: {
          value: [0, 0.9],
          duration: 600,
          delay: 300,
          easing: "linear",
        },
      },
    },
  },
];

export default Word;
