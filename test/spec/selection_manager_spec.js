"use strict";

define(['build/SelectionManager'], function (SelectionManager) {

  describe('SelectionManager', function () {

    var selectionManager;
    var changes;

    beforeEach(function() {
      selectionManager = new SelectionManager({
        onselectionchange : function(e) {
          changes = e;
        }
      });

      changes = null;
    });

    describe('select', function () {

      it('should notify the changes', function () {

        selectionManager.select([1, 2, 3, 4, 5]);

        selectionManager.get().length.should.equal(5);
        selectionManager.focus().should.equal(1);

        changes.added.should.have.members([1, 2, 3, 4, 5]);
        changes.removed.should.be.empty;
        changes.before.should.be.empty;
        changes.after.should.have.members([1, 2, 3, 4, 5]);
      });

      it('should accept just one object as parameter', function () {

        selectionManager.select(3);

        selectionManager.get().length.should.equal(1);
        selectionManager.focus().should.equal(3);

        changes.added.should.have.members([3]);
        changes.removed.should.be.empty;
        changes.before.should.be.empty;
        changes.after.should.have.members([3]);

        selectionManager.select(4);

        selectionManager.get().length.should.equal(1);
        selectionManager.focus().should.equal(4);

        changes.added.should.have.members([4]);
        changes.removed.should.have.members([3]);
        changes.before.should.have.members([3]);
        changes.after.should.have.members([4]);
      });
    });

    describe('toggle', function () {

      it('should notify the changes', function () {

        selectionManager.select([1, 2, 3, 4, 5]);
        
        selectionManager.toggle(3);

        selectionManager.get().length.should.equal(4);

        changes.added.should.be.empty;
        changes.removed.should.have.members([3]);
        changes.before.should.have.members([1, 2, 3, 4, 5]);
        changes.after.should.have.members([1, 2, 4, 5]);

        
        selectionManager.toggle(3);

        selectionManager.get().length.should.equal(5);
        selectionManager.focus().should.equal(3);

        changes.added.should.have.members([3]);
        changes.removed.should.be.empty;
        changes.before.should.have.members([1, 2, 4, 5]);
        changes.after.should.have.members([3, 1, 2, 4, 5]);
      });
    });

    describe('focus', function () {

      it('should notify the changes', function () {

        selectionManager.select([1, 2, 3, 4, 5]);
        
        selectionManager.focus(3);

        selectionManager.get().length.should.equal(5);
        selectionManager.focus().should.equal(3);

        changes.added.should.be.empty;
        changes.removed.should.be.empty;
        changes.before.should.have.members([1, 2, 3, 4, 5]);
        changes.after.should.have.members([3, 1, 2, 4, 5]);
      });
    });

        
    describe('reset', function () {

      it('should notify the changes', function () {

        selectionManager.select([1, 2, 3, 4, 5]);
        
        selectionManager.reset();

        selectionManager.get().length.should.equal(0);

        changes.added.should.be.empty;
        changes.removed.should.have.members([1, 2, 3, 4, 5]);
        changes.before.should.have.members([1, 2, 3, 4, 5]);
        changes.after.should.be.empty;
      });

    });

  });

});

