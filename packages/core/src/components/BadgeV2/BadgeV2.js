class PDSBadgeV2 extends HTMLElement {
  static get observedAttributes() {
    return ['label', 'icon', 'iconname', 'variant'];
  }
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  attributeChangedCallback() { this.render(); }
  connectedCallback() { this.render(); }
  render() {
    const label = this.getAttribute('label') || '';
    const icon = this.hasAttribute('icon') && this.getAttribute('icon') !== 'false';
    const iconName = this.getAttribute('iconname') || 'info';
    const variant = (this.getAttribute('variant') || 'base').toLowerCase();

    // Use exact tokens for base variant
    const variantTokens = {
      base: {
        bg: 'var(--pillow-color-background-neutral-bold-initial)',
        color: 'var(--pillow-color-text-and-icon-neutral)',
        border: 'var(--pillow-border-action-transparent)',
        borderColor: 'var(--pillow-color-text-and-icon-neutral)'
      },
      // Other variants to be filled in later
    };
    const tokens = variantTokens[variant] || variantTokens['base'];

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --badge-padding-x: var(--pillow-spacing-container-0_75x);
          --badge-padding-y: 0px;
          --badge-gap: var(--pillow-spacing-container-0_25x);
          --badge-radius: var(--pillow-border-radius-container-pill);
          --badge-bg: var(--pillow-color-background-neutral-bold-initial);
          --badge-border-width: var(--pillow-border-action-transparent-width);
          --badge-border-style: var(--pillow-border-action-transparent-style);
          --badge-border-color: var(--pillow-border-action-transparent-color);
          --badge-height: var(--pillow-dimension-action-height-1_5x);
          --icon-size: var(--pillow-dimension-icon-0_5x);
          --text-color: var(--pillow-color-text-and-icon-neutral);
          --text-font-family: var(--pillow-typography-interactive-strong-small-font-family);
          --text-font-weight: var(--pillow-typography-interactive-strong-small-font-weight);
          --text-font-size: var(--pillow-typography-interactive-strong-small-font-size);
          --text-line-height: var(--pillow-typography-interactive-strong-small-line-height);
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: var(--badge-gap);
          padding: var(--badge-padding-y) var(--badge-padding-x);
          border-radius: var(--badge-radius);
          background: var(--badge-bg);
          border: var(--pillow-border-action-transparent-width) var(--pillow-border-action-transparent-style) var(--pillow-border-action-transparent-color);
          box-sizing: border-box;
          height: var(--badge-height);
        }
        .Icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--icon-size);
          height: var(--icon-size);
        }
        .label {
          color: var(--text-color);
          font-family: var(--text-font-family);
          font-weight: var(--text-font-weight);
          font-size: var(--text-font-size);
          line-height: var(--text-line-height);
        }
      </style>
      <span class="badge">
        ${icon ? `<span class="Icon"><pds-icon name="${iconName}" variant="small"></pds-icon></span>` : ''}
        <span class="label"><slot>${label}</slot></span>
      </span>
    `;
  }
}
customElements.define('pds-badge-v2', PDSBadgeV2); 