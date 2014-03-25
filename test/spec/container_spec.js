"use strict";

define(['build/Component', 'build/Container', 'build/ComponentSelector'], function (Component, Container, ComponentSelector) {

  describe('Container', function () {

    describe('core mixins', function() {

      it('should have functions supported by dou core mixins', function () {
        var inst = new Container();

        inst.set.should.be.a('function');

        inst.serialize.should.be.a('function');

      });

      it('should contain components as a children', function () {
        var inst = new Container();

        inst.add(new Component());

        inst.size().should.equal(1);

      });

    });

    describe('initialize', function() {

      it('should make components container for the mixined object', function () {
        
        var inst = new Container();

        inst.add('a');

        inst.size().should.equal(1);
      });
    });

    describe('add', function() {

      it('should be able to accept a component or a array of components', function () {

        var inst = new Container();

        inst.add('a');
        inst.add(['b', 'c', 'd']);

        inst.size().should.equal(4);
        inst.getAt(3).should.equal('d');
      });

      it('should make container to be a event delegator for component', function () {

        var container = new Container('for_add_container');
        var component = new Component('for_add_component');

        var component_added_event_occurred = 0;
        var container_add_event_occurred = 0;
        var delegated_added_event_occurred = 0;

        component.on('all', function(e) {
          var event = arguments[arguments.length - 1].name;

          switch(event) {
            case 'added' :
              component_added_event_occurred++;
          }
        });
        container.on('all', function(e) {
          var event = arguments[arguments.length - 1].name;

          switch(event) {
            case 'add' :
              container_add_event_occurred++;
              break;
            case 'added' :
              delegated_added_event_occurred++;
          }
        });

        container.add(component);

        component_added_event_occurred.should.equal(1);
        container_add_event_occurred.should.equal(1);
        delegated_added_event_occurred.should.equal(1);
      });
    });

    describe('remove', function() {

      it('should be able to accept a child or array of children', function () {

        var inst = new Container();

        inst.initialize({});

        inst.add(['a', 'b', 'c', 'd', 'e']);
        inst.remove(['b', 'c', 'd']);

        inst.size().should.equal(2);
        inst.getAt(1).should.equal('e');
      });

      it('should remove event delegation relation', function () {

        var root = new Container('root');
        var folder = new Container('folder');
        var file = new Component('file');

        root.add(folder);
        
        var root_event_count = 0;
        var file_event_count = 0;
        var delegated_event_count = 0;

        file.on('all', function(e) {
          var event = arguments[arguments.length - 1].name;
          switch(event) {
            case 'added' :
              file_event_count++;
              break;
            case 'removed' :
              file_event_count--;
              break;
          }
        });

        root.on('all', function(e) {
          var event = arguments[arguments.length - 1].name;
          switch(event) {
            case 'add' :
              root_event_count++;
              break;
            case 'remove' :
              root_event_count--;
              break;
            case 'added' :
              delegated_event_count++;
              break;
            case 'removed' :
              delegated_event_count--;
          }
        });

        folder.add(file);

        file_event_count.should.equal(1);
        root_event_count.should.equal(1);
        delegated_event_count.should.equal(1);

        folder.remove(file);

        file_event_count.should.equal(0);
        root_event_count.should.equal(0);
        delegated_event_count.should.equal(0);

        /* check folder to be removed as a event delegator for the removed file */
        file.trigger('added', {});

        file_event_count.should.equal(1);
        root_event_count.should.equal(0);
        delegated_event_count.should.equal(0);

        file.trigger('removed', {});

        file_event_count.should.equal(0);
        root_event_count.should.equal(0);
        delegated_event_count.should.equal(0);
      });
    });

    describe('forEach', function() {

      it('should execute function based on the specified context for all items', function () {

        var inst = new Container();

        inst.initialize({});

        inst.add(['a', 'b', 'c', 'd', 'e']);

        var context = {
          join : ''
        };

        inst.forEach(function(i) {
          this.join += i
        }, context);

        context.join.should.be.equal('abcde');
      });

    });

    describe('moveChildDown', function () {
      it('should exchange positions of the child and the precedence each other', function() {
        var inst = new Container();

        inst.initialize({});

        inst.add([1, 2, 3, 4]);

        inst.moveChildDown(2);
        expect(inst.indexOf(2)).to.equal(0);
        expect(inst.indexOf(1)).to.equal(1);

        inst.moveChildDown(2);
        expect(inst.indexOf(2)).to.equal(0);
      });
    });

    describe('moveChildUp', function () {
      it('should exchange positions of the child and the following each other', function() {
        var inst = new Container();

        inst.initialize({});

        inst.add([1, 2, 3, 4]);

        inst.moveChildUp(2);
        expect(inst.indexOf(2)).to.equal(2);
        expect(inst.indexOf(3)).to.equal(1);

        inst.moveChildUp(4);
        expect(inst.indexOf(4)).to.equal(3);
      });
    });

    describe('moveChildToBottom', function () {
      it('should move the child to the top of the list', function() {
        var inst = new Container();

        inst.initialize({});

        inst.add([1, 2, 3, 4]);

        inst.moveChildToBottom(1);
        expect(inst.indexOf(1)).to.equal(0);

        inst.moveChildToBottom(3);
        expect(inst.indexOf(3)).to.equal(0);
        expect(inst.indexOf(1)).to.equal(1);
      });
    });

    describe('moveChildToTop', function () {
      it('should move the child to the end of the list', function() {
        var inst = new Container();

        inst.initialize({});

        inst.add([1, 2, 3, 4]);

        inst.moveChildToTop(4);
        expect(inst.indexOf(4)).to.equal(3);

        inst.moveChildToTop(1);
        expect(inst.indexOf(1)).to.equal(3);
        expect(inst.indexOf(4)).to.equal(2);
      });
    });

    describe('moveChildAt', function () {
      it('should move the child to the index of the list', function() {
        var inst = new Container();

        inst.initialize({});

        inst.add([1, 2, 3, 4]);

        inst.moveChildAt(1, 4);
        expect(inst.indexOf(4)).to.equal(1);

        inst.moveChildAt(3, 4);
        expect(inst.indexOf(4)).to.equal(3);

      });
    });

  });

});

