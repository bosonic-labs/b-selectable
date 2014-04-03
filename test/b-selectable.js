var kb = effroi.keyboard,
    mouse = effroi.mouse;

function createSelectableList() {
    var selectable = document.createElement('b-selectable');
    selectable.setAttribute('target', 'li');
    selectable.innerHTML = '<ul><li>toto</li><li>toto</li><li>toto</li></ul>';
    document.body.appendChild(selectable);
    return selectable;
}

describe('b-selectable', function() {

    describe('when setting selected attribute', function() {
        it('should add a class to the selected item', function() {
            var selectable = createSelectableList();
            selectable.setAttribute('selected', 1);
            expect(selectable.querySelectorAll('li')[1].className).to.equal('b-selectable-selected');
        });

        it('should dispatch a b-select event', function(done) {
            var selectable = createSelectableList();
            selectable.addEventListener('b-select', function(e) {
                expect(e.detail.item).to.equal('1');
                done();
            });
            selectable.setAttribute('selected', 1);
        });
    });

    describe('when clicking on an item', function() {
        it('should set the selected attribute', function() {
            var selectable = createSelectableList();
            mouse.click(selectable.querySelectorAll('li')[2]);
            expect(selectable.getAttribute('selected')).to.equal('2');
        });

        it('should dispatch a b-activate event', function(done) {
            var selectable = createSelectableList();
            selectable.addEventListener('b-activate', function(e) {
                expect(e.detail.item).to.equal('2');
                done();
            });
            mouse.click(selectable.querySelectorAll('li')[2]);
        });
    });

    describe('when pressing down', function() {
        it('should select the next item', function() {
            var selectable = createSelectableList();
            selectable.setAttribute('selected', 0);
            selectable.focus();
            kb.hit(kb.DOWN);
            expect(selectable.getAttribute('selected')).to.equal('1');
        });

        it('should do nothing if we are at the end of the list', function() {
            var selectable = createSelectableList();
            selectable.setAttribute('selected', 2);
            selectable.focus();
            kb.hit(kb.DOWN);
            expect(selectable.getAttribute('selected')).to.equal('2');
        });
    });

    describe('when pressing up', function() {
        it('should select the previous item', function() {
            var selectable = createSelectableList();
            selectable.setAttribute('selected', 1);
            selectable.focus();
            kb.hit(kb.UP);
            expect(selectable.getAttribute('selected')).to.equal('0');
        });

        it('should do nothing if we are at the top of the list', function() {
            var selectable = createSelectableList();
            selectable.setAttribute('selected', 0);
            selectable.focus();
            kb.hit(kb.UP);
            expect(selectable.getAttribute('selected')).to.equal('0');
        });
    });

    describe('when pressing enter', function() {
        it('should dispatch a b-activate event', function(done) {
            var selectable = createSelectableList();
            selectable.addEventListener('b-activate', function(e) {
                expect(e.detail.item).to.equal('1');
                done();
            });
            selectable.setAttribute('selected', 1);
            selectable.focus();
            kb.hit(kb.ENTER);
        });
    });
});