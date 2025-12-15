class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
    this.setHeaderCartIconAccessibility();
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector('#cart-icon-bubble');
    if (!cartLink) return;

    cartLink.setAttribute('role', 'button');
    cartLink.setAttribute('aria-haspopup', 'dialog');
    cartLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.open(cartLink);
    });
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault();
        this.open(cartLink);
      }
    });
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy);
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);
    // here the animation doesn't seem to always get triggered. A timeout seem to help
    setTimeout(() => {
      this.classList.add('animate', 'active');
    });

    this.addEventListener(
      'transitionend',
      () => {
        const containerToTrapFocusOn = this.classList.contains('is-empty')
          ? this.querySelector('.drawer__inner-empty')
          : document.getElementById('CartDrawer');
        const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
        trapFocus(containerToTrapFocusOn, focusElement);
      },
      { once: true }
    );

    document.body.classList.add('overflow-hidden');
  }

  close() {
    this.classList.remove('active');
    removeTrapFocus(this.activeElement);
    document.body.classList.remove('overflow-hidden');
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', 'false');

    if (cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
  }

  renderContents(parsedState) {
    this.querySelector('.drawer__inner').classList.contains('is-empty') &&
      this.querySelector('.drawer__inner').classList.remove('is-empty');
    this.productId = parsedState.id;
    this.getSectionsToRender().forEach((section) => {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section.id);

      if (!sectionElement) return;
      const html = parsedState.sections[section.id];
      if (!html) return;
      
      // For cart-drawer section, extract the #CartDrawer content
      if (section.id === 'cart-drawer') {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const cartDrawerContent = doc.querySelector('#CartDrawer');
        if (cartDrawerContent) {
          sectionElement.innerHTML = cartDrawerContent.innerHTML;
        } else {
          // Fallback: try to find cart-drawer-items or drawer__inner
          const fallback = doc.querySelector('cart-drawer-items') || doc.querySelector('.drawer__inner');
          if (fallback) {
            sectionElement.innerHTML = fallback.innerHTML;
          } else {
            sectionElement.innerHTML = this.getSectionInnerHTML(html, section.selector);
          }
        }
      } else {
        sectionElement.innerHTML = this.getSectionInnerHTML(html, section.selector);
      }
    });

    // Re-initialize custom elements after content update
    setTimeout(() => {
      // Re-query and re-initialize quantity inputs and remove buttons
      const quantityInputs = this.querySelectorAll('quantity-input');
      quantityInputs.forEach(el => {
        if (customElements.get('quantity-input') && !el.shadowRoot) {
          // Element will auto-upgrade if not already upgraded
        }
      });
      
      const removeButtons = this.querySelectorAll('cart-remove-button');
      removeButtons.forEach(el => {
        if (customElements.get('cart-remove-button') && !el.shadowRoot) {
          // Element will auto-upgrade if not already upgraded
        }
      });
      
      this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
      this.open();
    }, 100);
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer',
      },
      {
        id: 'cart-icon-bubble',
      },
    ];
  }

  getSectionDOM(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-drawer', CartDrawer);

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.drawer__inner',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
    ];
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // For cart-drawer section, extract the .drawer__inner content
    if (selector === '.drawer__inner') {
      const drawerInner = doc.querySelector('.drawer__inner');
      if (drawerInner) {
        return drawerInner.innerHTML;
      }
      // Fallback: try to find cart-drawer-items
      const cartDrawerItems = doc.querySelector('cart-drawer-items');
      if (cartDrawerItems) {
        return cartDrawerItems.innerHTML;
      }
    }
    
    // Default behavior
    const section = doc.querySelector(selector);
    return section ? section.innerHTML : '';
  }

  updateQuantity(line, quantity, event, name, variantId) {
    this.enableLoading(line);

    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname,
    });
    const eventTarget = event.currentTarget instanceof CartRemoveButton ? 'clear' : 'change';

    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);

        CartPerformance.measure(`${eventTarget}:paint-updated-sections"`, () => {
          const quantityElement =
            document.getElementById(`Quantity-${line}`) || document.getElementById(`Drawer-quantity-${line}`);
          const items = document.querySelectorAll('.cart-item');

          if (parsedState.errors) {
            if (quantityElement) {
              quantityElement.value = quantityElement.getAttribute('value');
            }
            this.updateLiveRegions(line, parsedState.errors);
            return;
          }

          this.classList.toggle('is-empty', parsedState.item_count === 0);
          const cartDrawerWrapper = document.querySelector('cart-drawer');
          const cartFooter = document.getElementById('main-cart-footer');

          if (cartFooter) cartFooter.classList.toggle('is-empty', parsedState.item_count === 0);
          if (cartDrawerWrapper) cartDrawerWrapper.classList.toggle('is-empty', parsedState.item_count === 0);

          // Update sections with proper null checks
          this.getSectionsToRender().forEach((section) => {
            const sectionElement = document.getElementById(section.id);
            if (!sectionElement) {
              console.warn(`Section element not found: ${section.id}`);
              return;
            }

            const elementToReplace = section.selector 
              ? sectionElement.querySelector(section.selector) 
              : sectionElement;
            
            if (!elementToReplace) {
              console.warn(`Element not found: ${section.id} ${section.selector || ''}`);
              return;
            }

            const sectionHTML = parsedState.sections[section.section];
            if (!sectionHTML) {
              console.warn(`Section HTML not found: ${section.section}`);
              return;
            }

            try {
              elementToReplace.innerHTML = this.getSectionInnerHTML(sectionHTML, section.selector);
            } catch (error) {
              console.error('Error updating section:', error);
            }
          });

          const updatedValue = parsedState.items[line - 1] ? parsedState.items[line - 1].quantity : undefined;
          let message = '';
          if (items.length === parsedState.items.length && quantityElement && updatedValue !== parseInt(quantityElement.value)) {
            if (typeof updatedValue === 'undefined') {
              message = window.cartStrings.error;
            } else {
              message = window.cartStrings.quantityError.replace('[quantity]', updatedValue);
            }
          }
          this.updateLiveRegions(line, message);

          const lineItem =
            document.getElementById(`CartItem-${line}`) || document.getElementById(`CartDrawer-Item-${line}`);
          if (lineItem && lineItem.querySelector(`[name="${name}"]`)) {
            cartDrawerWrapper
              ? trapFocus(cartDrawerWrapper, lineItem.querySelector(`[name="${name}"]`))
              : lineItem.querySelector(`[name="${name}"]`).focus();
          } else if (parsedState.item_count === 0 && cartDrawerWrapper) {
            trapFocus(cartDrawerWrapper.querySelector('.drawer__inner-empty'), cartDrawerWrapper.querySelector('a'));
          } else if (document.querySelector('.cart-item') && cartDrawerWrapper) {
            const cartItemName = document.querySelector('.cart-item__semi-mount-title') || document.querySelector('.cart-item__name');
            if (cartItemName) {
              trapFocus(cartDrawerWrapper, cartItemName);
            }
          }
        });

        CartPerformance.measureFromEvent(`${eventTarget}:user-action`, event);

        publish(PUB_SUB_EVENTS.cartUpdate, { source: 'cart-items', cartData: parsedState, variantId: variantId });
      })
      .catch((error) => {
        console.error('Cart update error:', error);
        this.querySelectorAll('.loading__spinner').forEach((overlay) => overlay.classList.add('hidden'));
        const errors = document.getElementById('cart-errors') || document.getElementById('CartDrawer-CartErrors');
        if (errors) {
          errors.textContent = window.cartStrings?.error || 'There was an error while updating your cart. Please try again.';
        }
      })
      .finally(() => {
        this.disableLoading(line);
      });
  }
}

customElements.define('cart-drawer-items', CartDrawerItems);
