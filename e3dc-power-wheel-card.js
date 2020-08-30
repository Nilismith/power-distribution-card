const LitElement = Object.getPrototypeOf(customElements.get("hui-view"));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

class e3dcPowerWheelCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      entities: { type: Array },
    };
  }

  static get styles() {
    return [
      css`
        * {
          box-sizing: border-box;
        }
        .e3dc-card {
          width: 380px;
          margin: auto;
          padding: 2em 0 2em 0;
        }

        .grid-container {
          display: grid;
          grid-template-columns: 130px 100px 130px;
          gap: 0.5em;
          margin: auto;
        }

        p {
          text-align: center;
          margin: 4px 0 4px 0;
        }

        .grid-header {
          visibility: hidden;
          grid-column-start: 1;
          grid-column-end: 4;
        }

        .overview {
          grid-column: 2;
          grid-row-start: 2;
          grid-row-end: 4;
        }

        .bar-container {
          display: block;
          width: 100%;
          height: 50%;
        }

        .bar-container > div {
          display: inline-block;
          width: 45%;
          vertical-align: middle;
        }

        .item > div {
          display: inline-block;
          vertical-align: middle;
        }

        .icon {
          width: 50%;
          border: gray 1px solid;
          border-radius: 1em;
          float: left;
        }

        .icon > svg {
          width: 40px;
          display: block;
          margin: 0.25em auto 0 auto;
        }

        .value {
          padding: 0 0 0 4px;
        }

        .item:nth-child(2n) > .icon {
          float: right;
        }

        /**************
      ARROW ANIMATION
      **************/
        .arrow > div {
          display: inline-block;
        }

        .blank {
          height: 4px;
          width: 54px;
          background-color: #e3e3e3;
          margin: 8px auto 8px auto;
        }

        .triangle-right {
          width: 0;
          height: 0;
          border-top: 8px solid transparent;
          border-left: 17px solid #e3e3e3;
          border-bottom: 8px solid transparent;
        }

        .triangle-left {
          width: 0;
          height: 0;
          border-top: 8px solid transparent;
          border-right: 17px solid #e3e3e3;
          border-bottom: 8px solid transparent;
        }

        @keyframes flash_triangles {
          0%,
          66% {
            border-left-color: #e3e3e3;
            border-right-color: #e3e3e3;
          }
          33% {
            border-left-color: #555;
            border-right-color: #555;
          }
        }
        #arrow_1 {
          animation: flash_triangles 3s infinite steps(1);
        }

        #arrow_2 {
          animation: flash_triangles 3s infinite 1s steps(1);
        }

        #arrow_3 {
          animation: flash_triangles 3s infinite 2s steps(1);
        }
      `,
    ];
  }

  constructor() {
    super();
    this.entities = {};
  }

  setConfig(config) {
    config = { ...config };

    // Example configuration:
    //
    // type: custom:e3dc-power-wheel-card
    // entities:
    //   battery_power: sensor.e3dc-battery
    //   solar_power: sensor.e3dc-solar
    //
    if (!config.entities || config.entities.length == 0) {
      throw new Error("You need to define entities such as battery or solar!");
    } else {
      var acceptedEntities = [
        "solar_power",
        "grid_power",
        "battery_power",
        "home_consumption",
        "autarky",
        "ratio",
      ];
      acceptedEntities.forEach((e) =>
        config.entities[e] ? (this.entities[e] = config.entities[e]) : null
      );
    }

    //TODO enable more configuration options: Color, Icons, Autocalc of autarky / ratio
    config.title = config.title ? config.title : "";

    this.config = config;
  }

  render() {
    return html`
      <ha-card>
        <div class="e3dc-card">
          <div class="grid-container">
            <div class="grid-header">
              custom header 123
            </div>
            <div class="overview">
              <p id="ratio">ratio</p>
              <div class="bar-container">
                <div class="ratio-bar">
                  <p id="ratio-percentage">100%</p>
                  <div class="bar">Bar</div>
                </div>
                <div class="autarky-bar">
                  <p id="autarky-percentage">78%</p>
                  <div class="bar">Bar</div>
                </div>
              </div>
              <p id="autarky">
                autarky
              </p>
            </div>
            ${this._render_item("solar", this.entities["solar_power"])}
            ${this._render_item("grid", this.entities["grid_power"])}
            ${this._render_item("battery", this.entities["battery_power"])}
            ${this._render_item("home", this.entities["home_consumption"])}
          </div>
        </div>
      </ha-card>
    `;
  }

  /**
   * Render Support Functions
   */

  _render_item(id, entity) {
    var state = this.hass.states[entity].state;
    console.log(state);
    return html`
      <div class="item" id="${id}">
        <div class="icon">
          <p class="subtitle">${id}</p>
        </div>
        <div class="value">
          <p>${Math.abs(state)} W</p>
          ${state < 0
            ? this._render_arrow(2)
            : state == 0
            ? this._render_arrow(0)
            : this._render_arrow(1)}
        </div>
      </div>
    `;
  }

  //This generates Animated Arrows depending on the state
  //0 is 0; 1 equals right; 2 equals left
  _render_arrow(direction) {
    switch (direction) {
      case 0: //Equals no Arrows at all
        return html` <div class="blank"></div> `;
      case 1: //Right Moving Arrows
        return html`
          <div class="arrow">
            <div class="triangle-right" id="arrow_1"></div>
            <div class="triangle-right" id="arrow_2"></div>
            <div class="triangle-right" id="arrow_3"></div>
          </div>
        `;
      case 2: //Left moving Arrows
        return html`
          <div class="arrow">
            <div class="triangle-left" id="arrow_3"></div>
            <div class="triangle-left" id="arrow_2"></div>
            <div class="triangle-left" id="arrow_1"></div>
          </div>
        `;
    }
  }
}

customElements.define("e3dc-power-wheel-card", e3dcPowerWheelCard);