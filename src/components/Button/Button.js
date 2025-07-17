/*
 * <pds-button> API
 *
 * Attributes:
 * - variant: string (primary, secondary, outlined, etc.)
 * - size: string (large, medium, small)
 * - disabled: boolean
 * - type: string (button, submit, reset)
 * - loading: boolean
 * - block: boolean (full width)
 * - state: string (optional, for Storybook/testing: initial, hover, active, focus, disabled)
 *
 * Slots:
 * - icon-left: left icon
 * - icon-right: right icon
 * - (default): button label
 */

class PDSButton extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'size', 'disabled', 'type', 'loading', 'block', 'state'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._slotListenersAttached = false;
    this._iconLeftSlotListener = null;
    this._iconRightSlotListener = null;
    this._labelSlotListener = null;
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
    // Attach slotchange listeners only once
    if (!this._slotListenersAttached) {
      const iconLeftSlot = this.shadowRoot.querySelector('slot[name="icon-left"]');
      const iconRightSlot = this.shadowRoot.querySelector('slot[name="icon-right"]');
      const labelSlot = this.shadowRoot.querySelector('slot:not([name])');
      if (iconLeftSlot) {
        this._iconLeftSlotListener = () => this.updateGap();
        iconLeftSlot.addEventListener('slotchange', this._iconLeftSlotListener);
      }
      if (iconRightSlot) {
        this._iconRightSlotListener = () => this.updateGap();
        iconRightSlot.addEventListener('slotchange', this._iconRightSlotListener);
      }
      if (labelSlot) {
        this._labelSlotListener = () => this.updateGap();
        labelSlot.addEventListener('slotchange', this._labelSlotListener);
      }
      this._slotListenersAttached = true;
    }
    this.updateGap();
  }

  disconnectedCallback() {
    // Clean up slotchange listeners
    const iconLeftSlot = this.shadowRoot.querySelector('slot[name="icon-left"]');
    const iconRightSlot = this.shadowRoot.querySelector('slot[name="icon-right"]');
    const labelSlot = this.shadowRoot.querySelector('slot:not([name])');
    if (iconLeftSlot && this._iconLeftSlotListener) {
      iconLeftSlot.removeEventListener('slotchange', this._iconLeftSlotListener);
      this._iconLeftSlotListener = null;
    }
    if (iconRightSlot && this._iconRightSlotListener) {
      iconRightSlot.removeEventListener('slotchange', this._iconRightSlotListener);
      this._iconRightSlotListener = null;
    }
    if (labelSlot && this._labelSlotListener) {
      labelSlot.removeEventListener('slotchange', this._labelSlotListener);
      this._labelSlotListener = null;
    }
    this._slotListenersAttached = false;
  }

  render() {
    const variant = this.getAttribute('variant') || 'filled';
    const size = this.getAttribute('size') || 'medium';
    const disabled = this.hasAttribute('disabled');
    const type = this.getAttribute('type') || 'button';
    const loading = this.hasAttribute('loading');
    const block = this.hasAttribute('block');
    const state = this.getAttribute('state');

    // Token-based icon stroke color and width logic
    let iconStrokeColor = '';
    let iconStrokeWidth = '';
    if (variant === 'filled') {
      if (disabled || state === 'disabled') {
        iconStrokeColor = 'var(--pillow-color-icon-disabled, #969696)';
        iconStrokeWidth = 'var(--pillow-border-width-icon-stroke-m, 2px)';
      } else {
        iconStrokeColor = 'var(--pillow-color-icon-on-primary, #fff)';
        iconStrokeWidth = 'var(--pillow-border-width-icon-stroke-m, 2px)';
      }
    } else if (variant === 'outlined' || variant === 'transparent') {
      if (disabled || state === 'disabled') {
        iconStrokeColor = 'var(--pillow-color-icon-disabled, #969696)';
        iconStrokeWidth = 'var(--pillow-border-width-icon-stroke-m, 2px)';
      } else {
        iconStrokeColor = 'var(--pillow-color-icon-primary, #019CDE)';
        iconStrokeWidth = 'var(--pillow-border-width-icon-stroke-m, 2px)';
      }
    }

    let blockStyle = block ? 'width: 100%; display: flex;' : '';

    // Detect icon-only: no label, only one icon
    const iconLeftSlot = this.shadowRoot.querySelector('slot[name="icon-left"]');
    const iconRightSlot = this.shadowRoot.querySelector('slot[name="icon-right"]');
    const labelSlot = this.shadowRoot.querySelector('slot:not([name])');
    const getHasLabel = () => {
      if (!labelSlot) return false;
      return labelSlot.assignedNodes().some(
        node =>
          (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') ||
          (node.nodeType === Node.ELEMENT_NODE)
      );
    };
    const getIconCount = () => {
      let count = 0;
      if (iconLeftSlot && iconLeftSlot.assignedNodes().some(n => n.nodeType === Node.ELEMENT_NODE)) count++;
      if (iconRightSlot && iconRightSlot.assignedNodes().some(n => n.nodeType === Node.ELEMENT_NODE)) count++;
      return count;
    };
    const hasLabel = getHasLabel();
    const iconCount = getIconCount();
    const isIconOnly = !hasLabel && iconCount === 1;

    const classes = [
      `variant-${variant}`,
      `size-${size}`,
      loading ? 'is-loading' : '',
      block ? 'is-block' : '',
      disabled ? 'is-disabled' : '',
      state ? `state-${state}` : '',
      isIconOnly ? 'icon-only' : ''
    ].join(' ');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --icon-size: var(--pillow-dimension-icon-0_5x, 12px);
          --button-height: var(--pillow-dimension-action-height-1_5x, 32px);
          --button-width: var(--pillow-dimension-action-width-1_5x, 32px);
          --vertical-padding: var(--pillow-spacing-container-none, 0px);
          --horizontal-padding: var(--pillow-spacing-container-none, 0px);
          --item-spacing: var(--pillow-spacing-container-0_12x, 8px);
          --border-radius: var(--pillow-border-radius-container-pill, 1000px);
          --border-width: var(--pillow-border-width-icon-stroke-s, 1px);
          --font-family: 'Manrope', sans-serif;
          --font-weight: 700;
          --font-size: 14px;
          --line-height: 100%;
          --icon-stroke-color: ${iconStrokeColor};
          --icon-stroke-width: ${iconStrokeWidth};
        }
        button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: var(--button-height);
          min-width: var(--button-width);
          padding: var(--vertical-padding) var(--horizontal-padding);
          border-radius: var(--border-radius);
          border-width: var(--border-width);
          border-style: solid;
          font-family: var(--font-family);
          font-weight: var(--font-weight);
          font-size: var(--font-size);
          line-height: var(--line-height);
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
          outline: none;
          ${blockStyle}
        }
        .icon-only {
          padding: 0 !important;
          width: var(--button-height) !important;
          height: var(--button-height) !important;
          border-radius: 50% !important;
          min-width: 0 !important;
        }
        button:focus {
          box-shadow: 0 0 0 2px var(--focus-ring, #019CDE33);
        }
        ::slotted([slot="icon-left"]), ::slotted([slot="icon-right"]) {
          margin: 0 !important;
          padding: 0 !important;
        }
        /* Filled style */
        .variant-filled {
          background: var(--filled-bg-initial, #019CDE);
          color: var(--filled-color-initial, #fff);
          border-color: var(--filled-border-initial, transparent);
        }
        .variant-filled.is-disabled,
        .variant-filled.state-disabled {
          background: var(--filled-bg-disabled, #e0e0e0);
          color: var(--filled-color-disabled, #969696);
          border-color: var(--filled-border-disabled, transparent);
          cursor: not-allowed;
        }
        .variant-filled.state-hover {
          background: var(--filled-bg-hover, #017bb5);
          color: var(--filled-color-hover, #fff);
          border-color: var(--filled-border-hover, transparent);
        }
        .variant-filled.state-active {
          background: var(--filled-bg-active, #015e8c);
          color: var(--filled-color-active, #fff);
          border-color: var(--filled-border-active, transparent);
        }
        /* Outlined style */
        .variant-outlined {
          background: transparent;
          color: var(--outlined-color-initial, #019CDE);
          border-color: var(--outlined-border-initial, #019CDE);
        }
        .variant-outlined.is-disabled,
        .variant-outlined.state-disabled {
          background: transparent;
          color: var(--outlined-color-disabled, #969696);
          border-color: var(--outlined-border-disabled, #e0e0e0);
          cursor: not-allowed;
        }
        .variant-outlined.state-hover {
          background: transparent;
          color: var(--outlined-color-hover, #017bb5);
          border-color: var(--outlined-border-hover, #017bb5);
        }
        .variant-outlined.state-active {
          background: transparent;
          color: var(--outlined-color-active, #015e8c);
          border-color: var(--outlined-border-active, #015e8c);
        }
        /* Transparent style */
        .variant-transparent {
          background: transparent;
          color: var(--transparent-color-initial, #019CDE);
          border-color: transparent;
        }
        .variant-transparent.is-disabled,
        .variant-transparent.state-disabled {
          background: transparent;
          color: var(--transparent-color-disabled, #969696);
          border-color: transparent;
          cursor: not-allowed;
        }
        .variant-transparent.state-hover {
          background: transparent;
          color: var(--transparent-color-hover, #017bb5);
          border-color: transparent;
        }
        .variant-transparent.state-active {
          background: transparent;
          color: var(--transparent-color-active, #015e8c);
          border-color: transparent;
        }
        /* Size variants */
        .size-large {
          --button-height: var(--pillow-dimension-action-height-2_25x, 36px);
          --font-size: 16px;
          --vertical-padding: var(--pillow-spacing-container-none, 0px);
          --horizontal-padding: var(--pillow-spacing-container-1x, 16px);
          --item-spacing: var(--pillow-spacing-container-0_25x, 4px);
        }
        .size-medium {
          --button-height: var(--pillow-dimension-action-height-1_75x, 28px);
          --font-size: 14px;
          --vertical-padding: var(--pillow-spacing-container-none, 0px);
          --horizontal-padding: var(--pillow-spacing-container-0_75x, 12px);
          --item-spacing: var(--pillow-spacing-container-0_25x, 4px);
        }
        .size-small {
          --button-height: var(--pillow-dimension-action-height-1_5x, 24px);
          --font-size: 12px;
          --vertical-padding: var(--pillow-spacing-container-none, 0px);
          --horizontal-padding: var(--pillow-spacing-container-0_5x, 8px);
          --item-spacing: var(--pillow-spacing-container-0_12x, 2px);
        }
        .is-block {
          width: 100%;
          display: flex;
        }
      </style>
      <button class="${classes}" ${disabled ? 'disabled' : ''} type="${type}">
        <slot name="icon-left"></slot>
        ${loading ? '<span class="loader"></span>' : ''}
        <slot></slot>
        <slot name="icon-right"></slot>
      </button>
    `;
    this.updateGap();
  }

  updateGap() {
    const button = this.shadowRoot.querySelector('button');
    const iconLeftSlot = this.shadowRoot.querySelector('slot[name="icon-left"]');
    const iconRightSlot = this.shadowRoot.querySelector('slot[name="icon-right"]');
    const labelSlot = this.shadowRoot.querySelector('slot:not([name])');
    const getHasLabel = () => {
      if (!labelSlot) return false;
      return labelSlot.assignedNodes().some(
        node =>
          (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') ||
          (node.nodeType === Node.ELEMENT_NODE)
      );
    };
    const getHasIcon = () => {
      const left = iconLeftSlot ? iconLeftSlot.assignedNodes().some(n => n.nodeType === Node.ELEMENT_NODE) : false;
      const right = iconRightSlot ? iconRightSlot.assignedNodes().some(n => n.nodeType === Node.ELEMENT_NODE) : false;
      return left || right;
    };
    const hasIcon = getHasIcon();
    const hasLabel = getHasLabel();
    if (button) button.style.gap = (hasIcon && hasLabel) ? 'var(--pillow-spacing-container-0_25x, 4px)' : '0px';
  }
}

customElements.define('pds-button', PDSButton); 