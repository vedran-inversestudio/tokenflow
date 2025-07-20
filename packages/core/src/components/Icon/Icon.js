import '../IconWrapper/IconWrapper.js';

// Map variants to tokenized sizes
const sizeTokenMap = {
  small: 'var(--pillow-dimension-icon-0_5x, 12px)',
  medium: 'var(--pillow-dimension-icon-0_67x, 16px)',
  large: 'var(--pillow-dimension-icon-0_83x, 20px)',
};
// Map variants to stroke width tokens
const strokeWidthToken = 'var(--pillow-border-width-icon-stroke-m, 2px)';

class PDSIcon extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'variant', 'stroke-color', 'stroke-width'];
  }

  static svgCache = new Map();

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._loading = false;
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  async render() {
    const name = this.getAttribute('name');
    const variant = this.getAttribute('variant') || 'medium';
    const size = sizeTokenMap[variant] || sizeTokenMap.medium;
    // Allow explicit override via attribute, else use CSS variable, else fallback
    const strokeColor = this.getAttribute('stroke-color') || 'var(--icon-stroke-color, currentColor)';
    const strokeWidth = this.getAttribute('stroke-width') || strokeWidthToken;
    if (!name) {
      this.shadowRoot.innerHTML = '';
      return;
    }
    const iconUrl = `/icons/${name}.svg`;
    let svg = null;
    if (PDSIcon.svgCache.has(iconUrl)) {
      svg = PDSIcon.svgCache.get(iconUrl);
    } else {
      // Show placeholder while loading
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: ${size};
            height: ${size};
            background: #e0e0e0;
            border-radius: 4px;
          }
          .placeholder {
            width: 100%;
            height: 100%;
            background: #e0e0e0;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        </style>
        <span class="placeholder"></span>
      `;
      try {
        const response = await fetch(iconUrl);
        if (!response.ok) throw new Error('Icon not found');
        svg = await response.text();
        // Replace any hardcoded stroke with currentColor for token control
        svg = svg.replace(/stroke="(#[^\"]+|black|#000|#fff|white)"/gi, 'stroke="currentColor"');
        PDSIcon.svgCache.set(iconUrl, svg);
      } catch (e) {
        svg = null;
      }
    }
    if (svg) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: ${size};
            height: ${size};
          }
          pds-icon-wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          svg {
            width: 100%;
            height: 100%;
            stroke: ${strokeColor};
            stroke-width: ${strokeWidth};
            fill: none;
            display: block;
          }
        </style>
        <pds-icon-wrapper>
          ${svg}
        </pds-icon-wrapper>
      `;
    } else {
      // If icon failed to load, keep placeholder
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: ${size};
            height: ${size};
            background: #e0e0e0;
            border-radius: 4px;
          }
          .placeholder {
            width: 100%;
            height: 100%;
            background: #e0e0e0;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        </style>
        <span class="placeholder"></span>
      `;
    }
  }
}
customElements.define('pds-icon', PDSIcon); 