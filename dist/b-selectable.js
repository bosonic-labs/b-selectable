(function () {
    var KEY = {
            ENTER: 13,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40
        };
    var BSelectablePrototype = Object.create(HTMLElement.prototype, {
            selectedItemIndex: {
                enumerable: true,
                get: function () {
                    return Number(this.getAttribute('selected'));
                }
            },
            createdCallback: {
                enumerable: true,
                value: function () {
                    this.tabIndex = -1;
                    if (this.hasAttribute('selected')) {
                        this.selectedChanged(null, this.getAttribute('selected'));
                    }
                    this.addEventListener('click', this.clickHandler.bind(this), false);
                    this.addEventListener('keydown', this.keydownHandler.bind(this), false);
                }
            },
            attributeChangedCallback: {
                enumerable: true,
                value: function (name, oldValue, newValue) {
                    if (name === 'selected')
                        this.selectedChanged(oldValue, this.getAttribute(name));
                }
            },
            selectedChanged: {
                enumerable: true,
                value: function (oldValue, newValue) {
                    this.dispatchEvent(new CustomEvent('b-select', { detail: { item: newValue } }));
                    if (oldValue !== null) {
                        this.getItem(oldValue).classList.remove('b-selectable-selected');
                        this.getItem(oldValue).removeAttribute('active');
                    }
                    this.getItem(newValue).classList.add('b-selectable-selected');
                    this.getItem(newValue).setAttribute('active', '');
                }
            },
            clickHandler: {
                enumerable: true,
                value: function (e) {
                    var itemIndex = this.getItems().indexOf(e.target);
                    if (itemIndex !== -1) {
                        this.setAttribute('selected', itemIndex);
                        this.activate();
                    }
                }
            },
            keydownHandler: {
                enumerable: true,
                value: function (e) {
                    switch (e.keyCode) {
                    case KEY.ENTER: {
                            this.activate();
                            break;
                        }
                    case KEY.DOWN: {
                            this.selectNextItem();
                            break;
                        }
                    case KEY.UP: {
                            this.selectPreviousItem();
                            break;
                        }
                    default:
                        return;
                    }
                }
            },
            activate: {
                enumerable: true,
                value: function () {
                    this.dispatchEvent(new CustomEvent('b-activate', { detail: { item: this.getAttribute('selected') } }));
                }
            },
            selectNextItem: {
                enumerable: true,
                value: function () {
                    if (this.selectedItemIndex < this.getItemCount() - 1) {
                        this.setAttribute('selected', this.selectedItemIndex + 1);
                    }
                }
            },
            selectPreviousItem: {
                enumerable: true,
                value: function () {
                    if (this.selectedItemIndex > 0) {
                        this.setAttribute('selected', this.selectedItemIndex - 1);
                    }
                }
            },
            getItem: {
                enumerable: true,
                value: function (pos) {
                    return this.getItems()[pos] || null;
                }
            },
            getItemCount: {
                enumerable: true,
                value: function () {
                    return this.getItems().length;
                }
            },
            getItems: {
                enumerable: true,
                value: function () {
                    var target = this.getAttribute('target');
                    var nodes = target ? this.querySelectorAll(target) : this.children;
                    return Array.prototype.slice.call(nodes, 0);
                }
            }
        });
    window.BSelectable = document.registerElement('b-selectable', { prototype: BSelectablePrototype });
}());