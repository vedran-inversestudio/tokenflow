class PDSBadge extends HTMLElement {
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

    // Token mapping for each variant
    const variantTokens = {
      base: {
        bg: 'var(--pillow-color-background-neutral-bold-initial)',
        color: 'var(--pillow-color-text-and-icon-neutral)',
        border: 'var(--pillow-border-action-transparent)',
        borderColor: 'var(--pillow-color-text-and-icon-neutral)'
      },
      info: {
        bg: 'var(--pillow-color-border-info-bold)',
        color: 'var(--pillow-color-border-info-bold)',
        border: 'var(--pillow-color-border-info-bold)'
      },
      success: {
        bg: 'var(--pillow-color-border-success-bold)',
        color: 'var(--pillow-color-border-success-bold)',
        border: 'var(--pillow-color-border-success-bold)'
      },
      warning: {
        bg: 'var(--pillow-color-border-warning-bold)',
        color: 'var(--pillow-color-border-warning-bold)',
        border: 'var(--pillow-color-border-warning-bold)'
      },
      danger: {
        bg: 'var(--pillow-color-border-danger-bold)',
        color: 'var(--pillow-color-border-danger-bold)',
        border: 'var(--pillow-color-border-danger-bold)'
      }
    };
    const tokens = variantTokens[variant] || variantTokens['base'];

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --badge-padding-x: var(--pillow-spacing-container-0_75x);
          --badge-padding-y: 0px;
          --badge-gap: var(--pillow-spacing-container-0_25x);
          --badge-radius: var(--pillow-border-radius-container-pill);
          --badge-font-family: var(--pillow-typography-interactive-strong-small-fontFamily);
          --badge-font-weight: var(--pillow-typography-interactive-strong-small-fontWeight);
          --badge-font-size: var(--pillow-typography-interactive-strong-small-fontSize);
          --badge-line-height: var(--pillow-typography-interactive-strong-small-lineHeight);
          --badge-border-width: var(--pillow-border-width-icon-stroke-s);
          --badge-bg: ${tokens.bg};
          --badge-color: ${tokens.color};
          --badge-border: ${tokens.border};
          --badge-border-color: ${tokens.borderColor};
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: var(--badge-gap);
          padding: var(--badge-padding-y) var(--badge-padding-x);
          border-radius: var(--badge-radius);
          font-family: var(--badge-font-family);
          font-weight: var(--badge-font-weight);
          font-size: var(--badge-font-size);
          line-height: var(--badge-line-height);
          background: var(--badge-bg);
          color: var(--badge-color);
          border: var(--badge-border-width) solid var(--badge-border-color);
          box-sizing: border-box;
          height: var(--pillow-dimension-action-height-1_5x);
        }
        .Icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: var(--badge-gap);
          width: var(--pillow-dimension-icon-0_5x);
          height: var(--pillow-dimension-icon-0_5x);
        }
      </style>
      <span class="badge">
        ${icon ? `<span class="Icon"><pds-icon name="${iconName}" variant="small"></pds-icon></span>` : ''}
        <slot>${label}</slot>
      </span>
    `;
  }
}
customElements.define('pds-badge', PDSBadge); 