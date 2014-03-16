"use strict";

define([
  'build/Component',
  'build/Container',
  'build/EventPump'
], function (
  Component,
  Container,
  EventPump
) {

  describe('EventPump', function () {

    var root;

    var computer;

    var folder1;
    var folder2;
    var folder3;

    var folder11;

    var file111;
    var file112;
    var file113;
    var link114;

    var file21;
    var link22;

    var file31;
    var link32;

    var origin_computer_count;
    var origin_folder_count;
    var origin_file_count;
    var origin_link_count;

    var deliverer_computer_count;
    var deliverer_folder_count;
    var deliverer_file_count;
    var deliverer_link_count;

    beforeEach(function() {
      origin_computer_count = 0;
      origin_folder_count = 0;
      origin_file_count = 0;
      origin_link_count = 0;

      deliverer_computer_count = 0;
      deliverer_folder_count = 0;
      deliverer_file_count = 0;
      deliverer_link_count = 0;

      root = computer = new Container('computer');
      computer.initialize({id: 'computer1'});
      
      folder1 = new Container('folder');
      folder1.initialize({id: 'folder1'});
      folder2 = new Container('folder');
      folder2.initialize({id: 'folder2'});
      folder3 = new Container('folder');
      folder3.initialize({id: 'folder3'});

      root.add([folder1, folder2, folder3]);

      folder11 = new Container('folder');
      folder11.initialize({id: 'folder11'});

      folder1.add(folder11);

      file111 = new Component('file');
      file111.initialize({id: 'file111'});
      file112 = new Component('file');
      file112.initialize({id: 'file112'});
      file113 = new Component('file');
      file113.initialize({id: 'file113'});
      link114 = new Component('link');
      link114.initialize({id: 'link114'});

      folder11.add([file111, file112, file113, link114]);

      file21 = new Component('file');
      file21.initialize({id: 'file21'});
      link22 = new Component('link');
      link22.initialize({id: 'link22'});

      folder2.add([file21, link22]);

      file31 = new Component('file');
      file31.initialize({id: 'file31'});
      link32 = new Component('link');
      link32.initialize({id: 'link32q'});

      folder3.add([file31, link32]);
    });

    describe('on/off', function() {

      it('should be able to use id, type and special(self, all) selector', function() {
      
        var listener = {}

        function handler(e) {
          eval("origin_" + e.origin.type + "_count++");
          eval("deliverer_" + e.deliverer.type + "_count++");

          var listener_count = listener[e.listener.get('id')];
          listener[e.listener.get('id')] = listener_count ? ++listener_count : 1;
        }

        var computer_listener = {
          '(self)': {
            'event': handler
          },
          '#file111': {
            'event': handler
          }
        };

        var pump = new EventPump(computer);

        pump.on(computer, computer_listener);

        var folder_listener = {
          '(self)': {
            'event': handler
          },
          '#link114': {
            'event': handler
          }
        };

        pump.on(folder1, folder_listener);

        pump.start();

        file111.trigger('event');
        computer.trigger('event');

        link114.trigger('event');
        folder1.trigger('event');

        listener['computer1'].should.exist;
        listener['computer1'].should.be.equal(2);
        listener['folder1'].should.be.equal(2);

        origin_computer_count.should.be.equal(1);
        origin_file_count.should.be.equal(1);
        origin_folder_count.should.be.equal(1);
        origin_link_count.should.be.equal(1);

        deliverer_computer_count.should.be.equal(4);

        /* Remove Subscriber */ 

        pump.off(folder1);

        file111.trigger('event');
        computer.trigger('event');

        link114.trigger('event');
        folder1.trigger('event');

        listener['computer1'].should.be.equal(4);
        listener['folder1'].should.be.equal(2);

        origin_computer_count.should.be.equal(2);
        origin_file_count.should.be.equal(2);
        origin_folder_count.should.be.equal(1);
        origin_link_count.should.be.equal(1);

        deliverer_computer_count.should.be.equal(6);
      });

      it('should be able to use variable selector', function() {
      
        var file_count = 0;
        var link_count = 0;

        function handler1(e) {
          file_count++;
        }

        function handler2(e) {
          link_count++;
        }

        computer.set('var1', '#file31');
        computer.set('var2', '#link22');

        var computer_listener = {
          '?var1': {
            'event': handler1
          },
          '?var2': {
            'event': handler2
          }
        };

        var pump = new EventPump(computer);
        pump.start();

        pump.on(computer, computer_listener);

        file31.trigger('event');
        link22.trigger('event');

        file_count.should.be.equal(1);
        link_count.should.be.equal(1);
      });

      it('should call handlers with context');
      it('should recognize synonyms with parenthesys');
    });

  });

});

