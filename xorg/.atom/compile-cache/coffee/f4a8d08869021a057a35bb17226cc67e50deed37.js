(function() {
  var helpers;

  helpers = require('./spec-helper');

  describe("Scrolling", function() {
    var editor, editorElement, keydown, ref, vimState;
    ref = [], editor = ref[0], editorElement = ref[1], vimState = ref[2];
    beforeEach(function() {
      var vimMode;
      vimMode = atom.packages.loadPackage('vim-mode');
      vimMode.activateResources();
      return helpers.getEditorElement(function(element) {
        editorElement = element;
        editor = editorElement.getModel();
        vimState = editorElement.vimState;
        vimState.activateNormalMode();
        vimState.resetNormalMode();
        return jasmine.attachToDOM(element);
      });
    });
    keydown = function(key, options) {
      if (options == null) {
        options = {};
      }
      if (options.element == null) {
        options.element = editorElement;
      }
      return helpers.keydown(key, options);
    };
    describe("scrolling keybindings", function() {
      beforeEach(function() {
        editor.setText("100\n200\n300\n400\n500\n600\n700\n800\n900\n1000");
        editor.setCursorBufferPosition([1, 2]);
        editorElement.setHeight(editorElement.getHeight() * 4 / 10);
        return expect(editor.getVisibleRowRange()).toEqual([0, 4]);
      });
      return describe("the ctrl-e and ctrl-y keybindings", function() {
        return it("moves the screen up and down by one and keeps cursor onscreen", function() {
          keydown('e', {
            ctrl: true
          });
          expect(editor.getFirstVisibleScreenRow()).toBe(1);
          expect(editor.getLastVisibleScreenRow()).toBe(5);
          expect(editor.getCursorScreenPosition()).toEqual([2, 2]);
          keydown('2');
          keydown('e', {
            ctrl: true
          });
          expect(editor.getFirstVisibleScreenRow()).toBe(3);
          expect(editor.getLastVisibleScreenRow()).toBe(7);
          expect(editor.getCursorScreenPosition()).toEqual([4, 2]);
          keydown('2');
          keydown('y', {
            ctrl: true
          });
          expect(editor.getFirstVisibleScreenRow()).toBe(1);
          expect(editor.getLastVisibleScreenRow()).toBe(5);
          return expect(editor.getCursorScreenPosition()).toEqual([2, 2]);
        });
      });
    });
    describe("scroll cursor keybindings", function() {
      beforeEach(function() {
        var i, j, text;
        text = "";
        for (i = j = 1; j <= 200; i = ++j) {
          text += i + "\n";
        }
        editor.setText(text);
        spyOn(editor, 'moveToFirstCharacterOfLine');
        spyOn(editorElement, 'setScrollTop');
        editorElement.style.lineHeight = "20px";
        editorElement.component.sampleFontStyling();
        editorElement.setHeight(200);
        spyOn(editorElement, 'getFirstVisibleScreenRow').andReturn(90);
        return spyOn(editorElement, 'getLastVisibleScreenRow').andReturn(110);
      });
      describe("the z<CR> keybinding", function() {
        var keydownCodeForEnter;
        keydownCodeForEnter = '\r';
        beforeEach(function() {
          return spyOn(editorElement, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the top of the window and moves cursor to first non-blank in the line", function() {
          keydown('z');
          keydown(keydownCodeForEnter);
          expect(editorElement.setScrollTop).toHaveBeenCalledWith(960);
          return expect(editor.moveToFirstCharacterOfLine).toHaveBeenCalled();
        });
      });
      describe("the zt keybinding", function() {
        beforeEach(function() {
          return spyOn(editorElement, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the top of the window and leave cursor in the same column", function() {
          keydown('z');
          keydown('t');
          expect(editorElement.setScrollTop).toHaveBeenCalledWith(960);
          return expect(editor.moveToFirstCharacterOfLine).not.toHaveBeenCalled();
        });
      });
      describe("the z. keybinding", function() {
        beforeEach(function() {
          return spyOn(editorElement, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the center of the window and moves cursor to first non-blank in the line", function() {
          keydown('z');
          keydown('.');
          expect(editorElement.setScrollTop).toHaveBeenCalledWith(900);
          return expect(editor.moveToFirstCharacterOfLine).toHaveBeenCalled();
        });
      });
      describe("the zz keybinding", function() {
        beforeEach(function() {
          return spyOn(editorElement, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the center of the window and leave cursor in the same column", function() {
          keydown('z');
          keydown('z');
          expect(editorElement.setScrollTop).toHaveBeenCalledWith(900);
          return expect(editor.moveToFirstCharacterOfLine).not.toHaveBeenCalled();
        });
      });
      describe("the z- keybinding", function() {
        beforeEach(function() {
          return spyOn(editorElement, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the bottom of the window and moves cursor to first non-blank in the line", function() {
          keydown('z');
          keydown('-');
          expect(editorElement.setScrollTop).toHaveBeenCalledWith(860);
          return expect(editor.moveToFirstCharacterOfLine).toHaveBeenCalled();
        });
      });
      return describe("the zb keybinding", function() {
        beforeEach(function() {
          return spyOn(editorElement, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the bottom of the window and leave cursor in the same column", function() {
          keydown('z');
          keydown('b');
          expect(editorElement.setScrollTop).toHaveBeenCalledWith(860);
          return expect(editor.moveToFirstCharacterOfLine).not.toHaveBeenCalled();
        });
      });
    });
    return describe("horizontal scroll cursor keybindings", function() {
      beforeEach(function() {
        var i, j, text;
        editorElement.setWidth(600);
        editorElement.setHeight(600);
        editorElement.style.lineHeight = "10px";
        editorElement.style.font = "16px monospace";
        atom.views.performDocumentPoll();
        text = "";
        for (i = j = 100; j <= 199; i = ++j) {
          text += i + " ";
        }
        editor.setText(text);
        return editor.setCursorBufferPosition([0, 0]);
      });
      describe("the zs keybinding", function() {
        var startPosition, zsPos;
        zsPos = function(pos) {
          editor.setCursorBufferPosition([0, pos]);
          keydown('z');
          keydown('s');
          return editorElement.getScrollLeft();
        };
        startPosition = 0/0;
        beforeEach(function() {
          return startPosition = editorElement.getScrollLeft();
        });
        it("does nothing near the start of the line", function() {
          var pos1;
          pos1 = zsPos(1);
          return expect(pos1).toEqual(startPosition);
        });
        it("moves the cursor the nearest it can to the left edge of the editor", function() {
          var pos10, pos11;
          pos10 = zsPos(10);
          expect(pos10).toBeGreaterThan(startPosition);
          pos11 = zsPos(11);
          return expect(pos11 - pos10).toEqual(10);
        });
        it("does nothing near the end of the line", function() {
          var pos340, pos342, pos390, posEnd;
          posEnd = zsPos(399);
          expect(editor.getCursorBufferPosition()).toEqual([0, 399]);
          pos390 = zsPos(390);
          expect(pos390).toEqual(posEnd);
          expect(editor.getCursorBufferPosition()).toEqual([0, 390]);
          pos340 = zsPos(340);
          expect(pos340).toBeLessThan(posEnd);
          pos342 = zsPos(342);
          return expect(pos342 - pos340).toEqual(19);
        });
        return it("does nothing if all lines are short", function() {
          var pos1, pos10;
          editor.setText('short');
          startPosition = editorElement.getScrollLeft();
          pos1 = zsPos(1);
          expect(pos1).toEqual(startPosition);
          expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
          pos10 = zsPos(10);
          expect(pos10).toEqual(startPosition);
          return expect(editor.getCursorBufferPosition()).toEqual([0, 4]);
        });
      });
      return describe("the ze keybinding", function() {
        var startPosition, zePos;
        zePos = function(pos) {
          editor.setCursorBufferPosition([0, pos]);
          keydown('z');
          keydown('e');
          return editorElement.getScrollLeft();
        };
        startPosition = 0/0;
        beforeEach(function() {
          return startPosition = editorElement.getScrollLeft();
        });
        it("does nothing near the start of the line", function() {
          var pos1, pos40;
          pos1 = zePos(1);
          expect(pos1).toEqual(startPosition);
          pos40 = zePos(40);
          return expect(pos40).toEqual(startPosition);
        });
        it("moves the cursor the nearest it can to the right edge of the editor", function() {
          var pos109, pos110;
          pos110 = zePos(110);
          expect(pos110).toBeGreaterThan(startPosition);
          pos109 = zePos(109);
          return expect(pos110 - pos109).toEqual(10);
        });
        it("does nothing when very near the end of the line", function() {
          var pos380, pos382, pos397, posEnd;
          posEnd = zePos(399);
          expect(editor.getCursorBufferPosition()).toEqual([0, 399]);
          pos397 = zePos(397);
          expect(pos397).toEqual(posEnd);
          expect(editor.getCursorBufferPosition()).toEqual([0, 397]);
          pos380 = zePos(380);
          expect(pos380).toBeLessThan(posEnd);
          pos382 = zePos(382);
          return expect(pos382 - pos380).toEqual(19);
        });
        return it("does nothing if all lines are short", function() {
          var pos1, pos10;
          editor.setText('short');
          startPosition = editorElement.getScrollLeft();
          pos1 = zePos(1);
          expect(pos1).toEqual(startPosition);
          expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
          pos10 = zePos(10);
          expect(pos10).toEqual(startPosition);
          return expect(editor.getCursorBufferPosition()).toEqual([0, 4]);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL3NwZWMvc2Nyb2xsLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGVBQVI7O0VBRVYsUUFBQSxDQUFTLFdBQVQsRUFBc0IsU0FBQTtBQUNwQixRQUFBO0lBQUEsTUFBb0MsRUFBcEMsRUFBQyxlQUFELEVBQVMsc0JBQVQsRUFBd0I7SUFFeEIsVUFBQSxDQUFXLFNBQUE7QUFDVCxVQUFBO01BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBZCxDQUEwQixVQUExQjtNQUNWLE9BQU8sQ0FBQyxpQkFBUixDQUFBO2FBRUEsT0FBTyxDQUFDLGdCQUFSLENBQXlCLFNBQUMsT0FBRDtRQUN2QixhQUFBLEdBQWdCO1FBQ2hCLE1BQUEsR0FBUyxhQUFhLENBQUMsUUFBZCxDQUFBO1FBQ1QsUUFBQSxHQUFXLGFBQWEsQ0FBQztRQUN6QixRQUFRLENBQUMsa0JBQVQsQ0FBQTtRQUNBLFFBQVEsQ0FBQyxlQUFULENBQUE7ZUFDQSxPQUFPLENBQUMsV0FBUixDQUFvQixPQUFwQjtNQU51QixDQUF6QjtJQUpTLENBQVg7SUFZQSxPQUFBLEdBQVUsU0FBQyxHQUFELEVBQU0sT0FBTjs7UUFBTSxVQUFROzs7UUFDdEIsT0FBTyxDQUFDLFVBQVc7O2FBQ25CLE9BQU8sQ0FBQyxPQUFSLENBQWdCLEdBQWhCLEVBQXFCLE9BQXJCO0lBRlE7SUFJVixRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQTtNQUNoQyxVQUFBLENBQVcsU0FBQTtRQUNULE1BQU0sQ0FBQyxPQUFQLENBQWUsbURBQWY7UUFhQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtRQUNBLGFBQWEsQ0FBQyxTQUFkLENBQXdCLGFBQWEsQ0FBQyxTQUFkLENB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QUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxPQUFmO1VBQ0EsYUFBQSxHQUFnQixhQUFhLENBQUMsYUFBZCxDQUFBO1VBQ2hCLElBQUEsR0FBTyxLQUFBLENBQU0sQ0FBTjtVQUNQLE1BQUEsQ0FBTyxJQUFQLENBQVksQ0FBQyxPQUFiLENBQXFCLGFBQXJCO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1VBQ0EsS0FBQSxHQUFRLEtBQUEsQ0FBTSxFQUFOO1VBQ1IsTUFBQSxDQUFPLEtBQVAsQ0FBYSxDQUFDLE9BQWQsQ0FBc0IsYUFBdEI7aUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1FBUndDLENBQTFDO01BeEM0QixDQUE5QjtJQTVEK0MsQ0FBakQ7RUF2SW9CLENBQXRCO0FBRkEiLCJzb3VyY2VzQ29udGVudCI6WyJoZWxwZXJzID0gcmVxdWlyZSAnLi9zcGVjLWhlbHBlcidcblxuZGVzY3JpYmUgXCJTY3JvbGxpbmdcIiwgLT5cbiAgW2VkaXRvciwgZWRpdG9yRWxlbWVudCwgdmltU3RhdGVdID0gW11cblxuICBiZWZvcmVFYWNoIC0+XG4gICAgdmltTW9kZSA9IGF0b20ucGFja2FnZXMubG9hZFBhY2thZ2UoJ3ZpbS1tb2RlJylcbiAgICB2aW1Nb2RlLmFjdGl2YXRlUmVzb3VyY2VzKClcblxuICAgIGhlbHBlcnMuZ2V0RWRpdG9yRWxlbWVudCAoZWxlbWVudCkgLT5cbiAgICAgIGVkaXRvckVsZW1lbnQgPSBlbGVtZW50XG4gICAgICBlZGl0b3IgPSBlZGl0b3JFbGVtZW50LmdldE1vZGVsKClcbiAgICAgIHZpbVN0YXRlID0gZWRpdG9yRWxlbWVudC52aW1TdGF0ZVxuICAgICAgdmltU3RhdGUuYWN0aXZhdGVOb3JtYWxNb2RlKClcbiAgICAgIHZpbVN0YXRlLnJlc2V0Tm9ybWFsTW9kZSgpXG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKGVsZW1lbnQpXG5cbiAga2V5ZG93biA9IChrZXksIG9wdGlvbnM9e30pIC0+XG4gICAgb3B0aW9ucy5lbGVtZW50ID89IGVkaXRvckVsZW1lbnRcbiAgICBoZWxwZXJzLmtleWRvd24oa2V5LCBvcHRpb25zKVxuXG4gIGRlc2NyaWJlIFwic2Nyb2xsaW5nIGtleWJpbmRpbmdzXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICAgIDEwMFxuICAgICAgICAyMDBcbiAgICAgICAgMzAwXG4gICAgICAgIDQwMFxuICAgICAgICA1MDBcbiAgICAgICAgNjAwXG4gICAgICAgIDcwMFxuICAgICAgICA4MDBcbiAgICAgICAgOTAwXG4gICAgICAgIDEwMDBcbiAgICAgIFwiXCJcIlxuXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzEsIDJdKVxuICAgICAgZWRpdG9yRWxlbWVudC5zZXRIZWlnaHQoZWRpdG9yRWxlbWVudC5nZXRIZWlnaHQoKSAqIDQgLyAxMClcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VmlzaWJsZVJvd1JhbmdlKCkpLnRvRXF1YWwgWzAsIDRdXG5cbiAgICBkZXNjcmliZSBcInRoZSBjdHJsLWUgYW5kIGN0cmwteSBrZXliaW5kaW5nc1wiLCAtPlxuICAgICAgaXQgXCJtb3ZlcyB0aGUgc2NyZWVuIHVwIGFuZCBkb3duIGJ5IG9uZSBhbmQga2VlcHMgY3Vyc29yIG9uc2NyZWVuXCIsIC0+XG4gICAgICAgIGtleWRvd24oJ2UnLCBjdHJsOiB0cnVlKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpKS50b0JlIDFcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRMYXN0VmlzaWJsZVNjcmVlblJvdygpKS50b0JlIDVcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsyLCAyXVxuXG4gICAgICAgIGtleWRvd24oJzInKVxuICAgICAgICBrZXlkb3duKCdlJywgY3RybDogdHJ1ZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRGaXJzdFZpc2libGVTY3JlZW5Sb3coKSkudG9CZSAzXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0TGFzdFZpc2libGVTY3JlZW5Sb3coKSkudG9CZSA3XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbNCwgMl1cblxuICAgICAgICBrZXlkb3duKCcyJylcbiAgICAgICAga2V5ZG93bigneScsIGN0cmw6IHRydWUpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93KCkpLnRvQmUgMVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldExhc3RWaXNpYmxlU2NyZWVuUm93KCkpLnRvQmUgNVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzIsIDJdXG5cbiAgZGVzY3JpYmUgXCJzY3JvbGwgY3Vyc29yIGtleWJpbmRpbmdzXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgdGV4dCA9IFwiXCJcbiAgICAgIGZvciBpIGluIFsxLi4yMDBdXG4gICAgICAgIHRleHQgKz0gXCIje2l9XFxuXCJcbiAgICAgIGVkaXRvci5zZXRUZXh0KHRleHQpXG5cbiAgICAgIHNweU9uKGVkaXRvciwgJ21vdmVUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lJylcblxuICAgICAgc3B5T24oZWRpdG9yRWxlbWVudCwgJ3NldFNjcm9sbFRvcCcpXG4gICAgICBlZGl0b3JFbGVtZW50LnN0eWxlLmxpbmVIZWlnaHQgPSBcIjIwcHhcIlxuICAgICAgZWRpdG9yRWxlbWVudC5jb21wb25lbnQuc2FtcGxlRm9udFN0eWxpbmcoKVxuICAgICAgZWRpdG9yRWxlbWVudC5zZXRIZWlnaHQoMjAwKVxuICAgICAgc3B5T24oZWRpdG9yRWxlbWVudCwgJ2dldEZpcnN0VmlzaWJsZVNjcmVlblJvdycpLmFuZFJldHVybig5MClcbiAgICAgIHNweU9uKGVkaXRvckVsZW1lbnQsICdnZXRMYXN0VmlzaWJsZVNjcmVlblJvdycpLmFuZFJldHVybigxMTApXG5cbiAgICBkZXNjcmliZSBcInRoZSB6PENSPiBrZXliaW5kaW5nXCIsIC0+XG4gICAgICBrZXlkb3duQ29kZUZvckVudGVyID0gJ1xccidcblxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBzcHlPbihlZGl0b3JFbGVtZW50LCAncGl4ZWxQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uJykuYW5kUmV0dXJuKHt0b3A6IDEwMDAsIGxlZnQ6IDB9KVxuXG4gICAgICBpdCBcIm1vdmVzIHRoZSBzY3JlZW4gdG8gcG9zaXRpb24gY3Vyc29yIGF0IHRoZSB0b3Agb2YgdGhlIHdpbmRvdyBhbmQgbW92ZXMgY3Vyc29yIHRvIGZpcnN0IG5vbi1ibGFuayBpbiB0aGUgbGluZVwiLCAtPlxuICAgICAgICBrZXlkb3duKCd6JylcbiAgICAgICAga2V5ZG93bihrZXlkb3duQ29kZUZvckVudGVyKVxuICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5zZXRTY3JvbGxUb3ApLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKDk2MClcbiAgICAgICAgZXhwZWN0KGVkaXRvci5tb3ZlVG9GaXJzdENoYXJhY3Rlck9mTGluZSkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICBkZXNjcmliZSBcInRoZSB6dCBrZXliaW5kaW5nXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHNweU9uKGVkaXRvckVsZW1lbnQsICdwaXhlbFBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24nKS5hbmRSZXR1cm4oe3RvcDogMTAwMCwgbGVmdDogMH0pXG5cbiAgICAgIGl0IFwibW92ZXMgdGhlIHNjcmVlbiB0byBwb3NpdGlvbiBjdXJzb3IgYXQgdGhlIHRvcCBvZiB0aGUgd2luZG93IGFuZCBsZWF2ZSBjdXJzb3IgaW4gdGhlIHNhbWUgY29sdW1uXCIsIC0+XG4gICAgICAgIGtleWRvd24oJ3onKVxuICAgICAgICBrZXlkb3duKCd0JylcbiAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsVG9wKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCg5NjApXG4gICAgICAgIGV4cGVjdChlZGl0b3IubW92ZVRvRmlyc3RDaGFyYWN0ZXJPZkxpbmUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgIGRlc2NyaWJlIFwidGhlIHouIGtleWJpbmRpbmdcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgc3B5T24oZWRpdG9yRWxlbWVudCwgJ3BpeGVsUG9zaXRpb25Gb3JTY3JlZW5Qb3NpdGlvbicpLmFuZFJldHVybih7dG9wOiAxMDAwLCBsZWZ0OiAwfSlcblxuICAgICAgaXQgXCJtb3ZlcyB0aGUgc2NyZWVuIHRvIHBvc2l0aW9uIGN1cnNvciBhdCB0aGUgY2VudGVyIG9mIHRoZSB3aW5kb3cgYW5kIG1vdmVzIGN1cnNvciB0byBmaXJzdCBub24tYmxhbmsgaW4gdGhlIGxpbmVcIiwgLT5cbiAgICAgICAga2V5ZG93bigneicpXG4gICAgICAgIGtleWRvd24oJy4nKVxuICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5zZXRTY3JvbGxUb3ApLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKDkwMClcbiAgICAgICAgZXhwZWN0KGVkaXRvci5tb3ZlVG9GaXJzdENoYXJhY3Rlck9mTGluZSkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICBkZXNjcmliZSBcInRoZSB6eiBrZXliaW5kaW5nXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHNweU9uKGVkaXRvckVsZW1lbnQsICdwaXhlbFBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24nKS5hbmRSZXR1cm4oe3RvcDogMTAwMCwgbGVmdDogMH0pXG5cbiAgICAgIGl0IFwibW92ZXMgdGhlIHNjcmVlbiB0byBwb3NpdGlvbiBjdXJzb3IgYXQgdGhlIGNlbnRlciBvZiB0aGUgd2luZG93IGFuZCBsZWF2ZSBjdXJzb3IgaW4gdGhlIHNhbWUgY29sdW1uXCIsIC0+XG4gICAgICAgIGtleWRvd24oJ3onKVxuICAgICAgICBrZXlkb3duKCd6JylcbiAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsVG9wKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCg5MDApXG4gICAgICAgIGV4cGVjdChlZGl0b3IubW92ZVRvRmlyc3RDaGFyYWN0ZXJPZkxpbmUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgIGRlc2NyaWJlIFwidGhlIHotIGtleWJpbmRpbmdcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgc3B5T24oZWRpdG9yRWxlbWVudCwgJ3BpeGVsUG9zaXRpb25Gb3JTY3JlZW5Qb3NpdGlvbicpLmFuZFJldHVybih7dG9wOiAxMDAwLCBsZWZ0OiAwfSlcblxuICAgICAgaXQgXCJtb3ZlcyB0aGUgc2NyZWVuIHRvIHBvc2l0aW9uIGN1cnNvciBhdCB0aGUgYm90dG9tIG9mIHRoZSB3aW5kb3cgYW5kIG1vdmVzIGN1cnNvciB0byBmaXJzdCBub24tYmxhbmsgaW4gdGhlIGxpbmVcIiwgLT5cbiAgICAgICAga2V5ZG93bigneicpXG4gICAgICAgIGtleWRvd24oJy0nKVxuICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5zZXRTY3JvbGxUb3ApLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKDg2MClcbiAgICAgICAgZXhwZWN0KGVkaXRvci5tb3ZlVG9GaXJzdENoYXJhY3Rlck9mTGluZSkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICBkZXNjcmliZSBcInRoZSB6YiBrZXliaW5kaW5nXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHNweU9uKGVkaXRvckVsZW1lbnQsICdwaXhlbFBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24nKS5hbmRSZXR1cm4oe3RvcDogMTAwMCwgbGVmdDogMH0pXG5cbiAgICAgIGl0IFwibW92ZXMgdGhlIHNjcmVlbiB0byBwb3NpdGlvbiBjdXJzb3IgYXQgdGhlIGJvdHRvbSBvZiB0aGUgd2luZG93IGFuZCBsZWF2ZSBjdXJzb3IgaW4gdGhlIHNhbWUgY29sdW1uXCIsIC0+XG4gICAgICAgIGtleWRvd24oJ3onKVxuICAgICAgICBrZXlkb3duKCdiJylcbiAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsVG9wKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCg4NjApXG4gICAgICAgIGV4cGVjdChlZGl0b3IubW92ZVRvRmlyc3RDaGFyYWN0ZXJPZkxpbmUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICBkZXNjcmliZSBcImhvcml6b250YWwgc2Nyb2xsIGN1cnNvciBrZXliaW5kaW5nc1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvckVsZW1lbnQuc2V0V2lkdGgoNjAwKVxuICAgICAgZWRpdG9yRWxlbWVudC5zZXRIZWlnaHQoNjAwKVxuICAgICAgZWRpdG9yRWxlbWVudC5zdHlsZS5saW5lSGVpZ2h0ID0gXCIxMHB4XCJcbiAgICAgIGVkaXRvckVsZW1lbnQuc3R5bGUuZm9udCA9IFwiMTZweCBtb25vc3BhY2VcIlxuICAgICAgYXRvbS52aWV3cy5wZXJmb3JtRG9jdW1lbnRQb2xsKClcbiAgICAgIHRleHQgPSBcIlwiXG4gICAgICBmb3IgaSBpbiBbMTAwLi4xOTldXG4gICAgICAgIHRleHQgKz0gXCIje2l9IFwiXG4gICAgICBlZGl0b3Iuc2V0VGV4dCh0ZXh0KVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcblxuICAgIGRlc2NyaWJlIFwidGhlIHpzIGtleWJpbmRpbmdcIiwgLT5cbiAgICAgIHpzUG9zID0gKHBvcykgLT5cbiAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCBwb3NdKVxuICAgICAgICBrZXlkb3duKCd6JylcbiAgICAgICAga2V5ZG93bigncycpXG4gICAgICAgIGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsTGVmdCgpXG5cbiAgICAgIHN0YXJ0UG9zaXRpb24gPSBOYU5cblxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBzdGFydFBvc2l0aW9uID0gZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxMZWZ0KClcblxuICAgICAgaXQgXCJkb2VzIG5vdGhpbmcgbmVhciB0aGUgc3RhcnQgb2YgdGhlIGxpbmVcIiwgLT5cbiAgICAgICAgcG9zMSA9IHpzUG9zKDEpXG4gICAgICAgIGV4cGVjdChwb3MxKS50b0VxdWFsKHN0YXJ0UG9zaXRpb24pXG5cbiAgICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciB0aGUgbmVhcmVzdCBpdCBjYW4gdG8gdGhlIGxlZnQgZWRnZSBvZiB0aGUgZWRpdG9yXCIsIC0+XG4gICAgICAgIHBvczEwID0genNQb3MoMTApXG4gICAgICAgIGV4cGVjdChwb3MxMCkudG9CZUdyZWF0ZXJUaGFuKHN0YXJ0UG9zaXRpb24pXG5cbiAgICAgICAgcG9zMTEgPSB6c1BvcygxMSlcbiAgICAgICAgZXhwZWN0KHBvczExIC0gcG9zMTApLnRvRXF1YWwoMTApXG5cbiAgICAgIGl0IFwiZG9lcyBub3RoaW5nIG5lYXIgdGhlIGVuZCBvZiB0aGUgbGluZVwiLCAtPlxuICAgICAgICBwb3NFbmQgPSB6c1BvcygzOTkpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMzk5XVxuXG4gICAgICAgIHBvczM5MCA9IHpzUG9zKDM5MClcbiAgICAgICAgZXhwZWN0KHBvczM5MCkudG9FcXVhbChwb3NFbmQpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMzkwXVxuXG4gICAgICAgIHBvczM0MCA9IHpzUG9zKDM0MClcbiAgICAgICAgZXhwZWN0KHBvczM0MCkudG9CZUxlc3NUaGFuKHBvc0VuZClcbiAgICAgICAgcG9zMzQyID0genNQb3MoMzQyKVxuICAgICAgICBleHBlY3QocG9zMzQyIC0gcG9zMzQwKS50b0VxdWFsKDE5KVxuXG4gICAgICBpdCBcImRvZXMgbm90aGluZyBpZiBhbGwgbGluZXMgYXJlIHNob3J0XCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KCdzaG9ydCcpXG4gICAgICAgIHN0YXJ0UG9zaXRpb24gPSBlZGl0b3JFbGVtZW50LmdldFNjcm9sbExlZnQoKVxuICAgICAgICBwb3MxID0genNQb3MoMSlcbiAgICAgICAgZXhwZWN0KHBvczEpLnRvRXF1YWwoc3RhcnRQb3NpdGlvbilcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFswLCAxXVxuICAgICAgICBwb3MxMCA9IHpzUG9zKDEwKVxuICAgICAgICBleHBlY3QocG9zMTApLnRvRXF1YWwoc3RhcnRQb3NpdGlvbilcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFswLCA0XVxuXG5cbiAgICBkZXNjcmliZSBcInRoZSB6ZSBrZXliaW5kaW5nXCIsIC0+XG4gICAgICB6ZVBvcyA9IChwb3MpIC0+XG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgcG9zXSlcbiAgICAgICAga2V5ZG93bigneicpXG4gICAgICAgIGtleWRvd24oJ2UnKVxuICAgICAgICBlZGl0b3JFbGVtZW50LmdldFNjcm9sbExlZnQoKVxuXG4gICAgICBzdGFydFBvc2l0aW9uID0gTmFOXG5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgc3RhcnRQb3NpdGlvbiA9IGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsTGVmdCgpXG5cbiAgICAgIGl0IFwiZG9lcyBub3RoaW5nIG5lYXIgdGhlIHN0YXJ0IG9mIHRoZSBsaW5lXCIsIC0+XG4gICAgICAgIHBvczEgPSB6ZVBvcygxKVxuICAgICAgICBleHBlY3QocG9zMSkudG9FcXVhbChzdGFydFBvc2l0aW9uKVxuXG4gICAgICAgIHBvczQwID0gemVQb3MoNDApXG4gICAgICAgIGV4cGVjdChwb3M0MCkudG9FcXVhbChzdGFydFBvc2l0aW9uKVxuXG4gICAgICBpdCBcIm1vdmVzIHRoZSBjdXJzb3IgdGhlIG5lYXJlc3QgaXQgY2FuIHRvIHRoZSByaWdodCBlZGdlIG9mIHRoZSBlZGl0b3JcIiwgLT5cbiAgICAgICAgcG9zMTEwID0gemVQb3MoMTEwKVxuICAgICAgICBleHBlY3QocG9zMTEwKS50b0JlR3JlYXRlclRoYW4oc3RhcnRQb3NpdGlvbilcblxuICAgICAgICBwb3MxMDkgPSB6ZVBvcygxMDkpXG4gICAgICAgIGV4cGVjdChwb3MxMTAgLSBwb3MxMDkpLnRvRXF1YWwoMTApXG5cbiAgICAgIGl0IFwiZG9lcyBub3RoaW5nIHdoZW4gdmVyeSBuZWFyIHRoZSBlbmQgb2YgdGhlIGxpbmVcIiwgLT5cbiAgICAgICAgcG9zRW5kID0gemVQb3MoMzk5KVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDM5OV1cblxuICAgICAgICBwb3MzOTcgPSB6ZVBvcygzOTcpXG4gICAgICAgIGV4cGVjdChwb3MzOTcpLnRvRXF1YWwocG9zRW5kKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDM5N11cblxuICAgICAgICBwb3MzODAgPSB6ZVBvcygzODApXG4gICAgICAgIGV4cGVjdChwb3MzODApLnRvQmVMZXNzVGhhbihwb3NFbmQpXG5cbiAgICAgICAgcG9zMzgyID0gemVQb3MoMzgyKVxuICAgICAgICBleHBlY3QocG9zMzgyIC0gcG9zMzgwKS50b0VxdWFsKDE5KVxuXG4gICAgICBpdCBcImRvZXMgbm90aGluZyBpZiBhbGwgbGluZXMgYXJlIHNob3J0XCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KCdzaG9ydCcpXG4gICAgICAgIHN0YXJ0UG9zaXRpb24gPSBlZGl0b3JFbGVtZW50LmdldFNjcm9sbExlZnQoKVxuICAgICAgICBwb3MxID0gemVQb3MoMSlcbiAgICAgICAgZXhwZWN0KHBvczEpLnRvRXF1YWwoc3RhcnRQb3NpdGlvbilcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFswLCAxXVxuICAgICAgICBwb3MxMCA9IHplUG9zKDEwKVxuICAgICAgICBleHBlY3QocG9zMTApLnRvRXF1YWwoc3RhcnRQb3NpdGlvbilcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFswLCA0XVxuIl19
