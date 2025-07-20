class PDSIconWrapper extends HTMLElement {
  static get observedAttributes() {
    return ['size'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    // Use token or fallback for size
    const size = this.getAttribute('size') || 'var(--icon-wrapper-size, 16px)';
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: ${size};
          height: ${size};
          /* Add more tokenized styles if needed (e.g., border-radius, background) */
        }
        ::slotted(svg) {
          width: 100%;
          height: 100%;
        }
      </style>
      <slot></slot>
    `;
  }
}
customElements.define('pds-icon-wrapper', PDSIconWrapper); 