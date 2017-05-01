(function() {
  var Scroll, ScrollCursor, ScrollCursorToBottom, ScrollCursorToLeft, ScrollCursorToMiddle, ScrollCursorToRight, ScrollCursorToTop, ScrollDown, ScrollHorizontal, ScrollUp,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Scroll = (function() {
    Scroll.prototype.isComplete = function() {
      return true;
    };

    Scroll.prototype.isRecordable = function() {
      return false;
    };

    function Scroll(editorElement) {
      this.editorElement = editorElement;
      this.scrolloff = 2;
      this.editor = this.editorElement.getModel();
      this.rows = {
        first: this.editorElement.getFirstVisibleScreenRow(),
        last: this.editorElement.getLastVisibleScreenRow(),
        final: this.editor.getLastScreenRow()
      };
    }

    return Scroll;

  })();

  ScrollDown = (function(superClass) {
    extend(ScrollDown, superClass);

    function ScrollDown() {
      return ScrollDown.__super__.constructor.apply(this, arguments);
    }

    ScrollDown.prototype.execute = function(count) {
      var cursor, i, len, newFirstRow, oldFirstRow, position, ref;
      if (count == null) {
        count = 1;
      }
      oldFirstRow = this.editor.getFirstVisibleScreenRow();
      this.editor.setFirstVisibleScreenRow(oldFirstRow + count);
      newFirstRow = this.editor.getFirstVisibleScreenRow();
      ref = this.editor.getCursors();
      for (i = 0, len = ref.length; i < len; i++) {
        cursor = ref[i];
        position = cursor.getScreenPosition();
        if (position.row <= newFirstRow + this.scrolloff) {
          cursor.setScreenPosition([position.row + newFirstRow - oldFirstRow, position.column], {
            autoscroll: false
          });
        }
      }
      this.editorElement.component.updateSync();
    };

    return ScrollDown;

  })(Scroll);

  ScrollUp = (function(superClass) {
    extend(ScrollUp, superClass);

    function ScrollUp() {
      return ScrollUp.__super__.constructor.apply(this, arguments);
    }

    ScrollUp.prototype.execute = function(count) {
      var cursor, i, len, newLastRow, oldFirstRow, oldLastRow, position, ref;
      if (count == null) {
        count = 1;
      }
      oldFirstRow = this.editor.getFirstVisibleScreenRow();
      oldLastRow = this.editor.getLastVisibleScreenRow();
      this.editor.setFirstVisibleScreenRow(oldFirstRow - count);
      newLastRow = this.editor.getLastVisibleScreenRow();
      ref = this.editor.getCursors();
      for (i = 0, len = ref.length; i < len; i++) {
        cursor = ref[i];
        position = cursor.getScreenPosition();
        if (position.row >= newLastRow - this.scrolloff) {
          cursor.setScreenPosition([position.row - (oldLastRow - newLastRow), position.column], {
            autoscroll: false
          });
        }
      }
      this.editorElement.component.updateSync();
    };

    return ScrollUp;

  })(Scroll);

  ScrollCursor = (function(superClass) {
    extend(ScrollCursor, superClass);

    function ScrollCursor(editorElement, opts) {
      var cursor;
      this.editorElement = editorElement;
      this.opts = opts != null ? opts : {};
      ScrollCursor.__super__.constructor.apply(this, arguments);
      cursor = this.editor.getCursorScreenPosition();
      this.pixel = this.editorElement.pixelPositionForScreenPosition(cursor).top;
    }

    return ScrollCursor;

  })(Scroll);

  ScrollCursorToTop = (function(superClass) {
    extend(ScrollCursorToTop, superClass);

    function ScrollCursorToTop() {
      return ScrollCursorToTop.__super__.constructor.apply(this, arguments);
    }

    ScrollCursorToTop.prototype.execute = function() {
      if (!this.opts.leaveCursor) {
        this.moveToFirstNonBlank();
      }
      return this.scrollUp();
    };

    ScrollCursorToTop.prototype.scrollUp = function() {
      if (this.rows.last === this.rows.final) {
        return;
      }
      this.pixel -= this.editor.getLineHeightInPixels() * this.scrolloff;
      return this.editorElement.setScrollTop(this.pixel);
    };

    ScrollCursorToTop.prototype.moveToFirstNonBlank = function() {
      return this.editor.moveToFirstCharacterOfLine();
    };

    return ScrollCursorToTop;

  })(ScrollCursor);

  ScrollCursorToMiddle = (function(superClass) {
    extend(ScrollCursorToMiddle, superClass);

    function ScrollCursorToMiddle() {
      return ScrollCursorToMiddle.__super__.constructor.apply(this, arguments);
    }

    ScrollCursorToMiddle.prototype.execute = function() {
      if (!this.opts.leaveCursor) {
        this.moveToFirstNonBlank();
      }
      return this.scrollMiddle();
    };

    ScrollCursorToMiddle.prototype.scrollMiddle = function() {
      this.pixel -= this.editorElement.getHeight() / 2;
      return this.editorElement.setScrollTop(this.pixel);
    };

    ScrollCursorToMiddle.prototype.moveToFirstNonBlank = function() {
      return this.editor.moveToFirstCharacterOfLine();
    };

    return ScrollCursorToMiddle;

  })(ScrollCursor);

  ScrollCursorToBottom = (function(superClass) {
    extend(ScrollCursorToBottom, superClass);

    function ScrollCursorToBottom() {
      return ScrollCursorToBottom.__super__.constructor.apply(this, arguments);
    }

    ScrollCursorToBottom.prototype.execute = function() {
      if (!this.opts.leaveCursor) {
        this.moveToFirstNonBlank();
      }
      return this.scrollDown();
    };

    ScrollCursorToBottom.prototype.scrollDown = function() {
      var offset;
      if (this.rows.first === 0) {
        return;
      }
      offset = this.editor.getLineHeightInPixels() * (this.scrolloff + 1);
      this.pixel -= this.editorElement.getHeight() - offset;
      return this.editorElement.setScrollTop(this.pixel);
    };

    ScrollCursorToBottom.prototype.moveToFirstNonBlank = function() {
      return this.editor.moveToFirstCharacterOfLine();
    };

    return ScrollCursorToBottom;

  })(ScrollCursor);

  ScrollHorizontal = (function() {
    ScrollHorizontal.prototype.isComplete = function() {
      return true;
    };

    ScrollHorizontal.prototype.isRecordable = function() {
      return false;
    };

    function ScrollHorizontal(editorElement) {
      var cursorPos;
      this.editorElement = editorElement;
      this.editor = this.editorElement.getModel();
      cursorPos = this.editor.getCursorScreenPosition();
      this.pixel = this.editorElement.pixelPositionForScreenPosition(cursorPos).left;
      this.cursor = this.editor.getLastCursor();
    }

    ScrollHorizontal.prototype.putCursorOnScreen = function() {
      return this.editor.scrollToCursorPosition({
        center: false
      });
    };

    return ScrollHorizontal;

  })();

  ScrollCursorToLeft = (function(superClass) {
    extend(ScrollCursorToLeft, superClass);

    function ScrollCursorToLeft() {
      return ScrollCursorToLeft.__super__.constructor.apply(this, arguments);
    }

    ScrollCursorToLeft.prototype.execute = function() {
      this.editorElement.setScrollLeft(this.pixel);
      return this.putCursorOnScreen();
    };

    return ScrollCursorToLeft;

  })(ScrollHorizontal);

  ScrollCursorToRight = (function(superClass) {
    extend(ScrollCursorToRight, superClass);

    function ScrollCursorToRight() {
      return ScrollCursorToRight.__super__.constructor.apply(this, arguments);
    }

    ScrollCursorToRight.prototype.execute = function() {
      this.editorElement.setScrollRight(this.pixel);
      return this.putCursorOnScreen();
    };

    return ScrollCursorToRight;

  })(ScrollHorizontal);

  module.exports = {
    ScrollDown: ScrollDown,
    ScrollUp: ScrollUp,
    ScrollCursorToTop: ScrollCursorToTop,
    ScrollCursorToMiddle: ScrollCursorToMiddle,
    ScrollCursorToBottom: ScrollCursorToBottom,
    ScrollCursorToLeft: ScrollCursorToLeft,
    ScrollCursorToRight: ScrollCursorToRight
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9zY3JvbGwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxvS0FBQTtJQUFBOzs7RUFBTTtxQkFDSixVQUFBLEdBQVksU0FBQTthQUFHO0lBQUg7O3FCQUNaLFlBQUEsR0FBYyxTQUFBO2FBQUc7SUFBSDs7SUFDRCxnQkFBQyxhQUFEO01BQUMsSUFBQyxDQUFBLGdCQUFEO01BQ1osSUFBQyxDQUFBLFNBQUQsR0FBYTtNQUNiLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLGFBQWEsQ0FBQyxRQUFmLENBQUE7TUFDVixJQUFDLENBQUEsSUFBRCxHQUNFO1FBQUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxhQUFhLENBQUMsd0JBQWYsQ0FBQSxDQUFQO1FBQ0EsSUFBQSxFQUFNLElBQUMsQ0FBQSxhQUFhLENBQUMsdUJBQWYsQ0FBQSxDQUROO1FBRUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQVIsQ0FBQSxDQUZQOztJQUpTOzs7Ozs7RUFRVDs7Ozs7Ozt5QkFDSixPQUFBLEdBQVMsU0FBQyxLQUFEO0FBQ1AsVUFBQTs7UUFEUSxRQUFNOztNQUNkLFdBQUEsR0FBYyxJQUFDLENBQUEsTUFBTSxDQUFDLHdCQUFSLENBQUE7TUFDZCxJQUFDLENBQUEsTUFBTSxDQUFDLHdCQUFSLENBQWlDLFdBQUEsR0FBYyxLQUEvQztNQUNBLFdBQUEsR0FBYyxJQUFDLENBQUEsTUFBTSxDQUFDLHdCQUFSLENBQUE7QUFFZDtBQUFBLFdBQUEscUNBQUE7O1FBQ0UsUUFBQSxHQUFXLE1BQU0sQ0FBQyxpQkFBUCxDQUFBO1FBQ1gsSUFBRyxRQUFRLENBQUMsR0FBVCxJQUFnQixXQUFBLEdBQWMsSUFBQyxDQUFBLFNBQWxDO1VBQ0UsTUFBTSxDQUFDLGlCQUFQLENBQXlCLENBQUMsUUFBUSxDQUFDLEdBQVQs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QkFBUixDQUErQjtRQUFDLE1BQUEsRUFBUSxLQUFUO09BQS9CO0lBRGlCOzs7Ozs7RUFHZjs7Ozs7OztpQ0FDSixPQUFBLEdBQVMsU0FBQTtNQUNQLElBQUMsQ0FBQSxhQUFhLENBQUMsYUFBZixDQUE2QixJQUFDLENBQUEsS0FBOUI7YUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTtJQUZPOzs7O0tBRHNCOztFQUszQjs7Ozs7OztrQ0FDSixPQUFBLEdBQVMsU0FBQTtNQUNQLElBQUMsQ0FBQSxhQUFhLENBQUMsY0FBZixDQUE4QixJQUFDLENBQUEsS0FBL0I7YUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTtJQUZPOzs7O0tBRHVCOztFQUtsQyxNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUFDLFlBQUEsVUFBRDtJQUFhLFVBQUEsUUFBYjtJQUF1QixtQkFBQSxpQkFBdkI7SUFBMEMsc0JBQUEsb0JBQTFDO0lBQ2Ysc0JBQUEsb0JBRGU7SUFDTyxvQkFBQSxrQkFEUDtJQUMyQixxQkFBQSxtQkFEM0I7O0FBakhqQiIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNjcm9sbFxuICBpc0NvbXBsZXRlOiAtPiB0cnVlXG4gIGlzUmVjb3JkYWJsZTogLT4gZmFsc2VcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yRWxlbWVudCkgLT5cbiAgICBAc2Nyb2xsb2ZmID0gMiAjIGF0b20gZGVmYXVsdFxuICAgIEBlZGl0b3IgPSBAZWRpdG9yRWxlbWVudC5nZXRNb2RlbCgpXG4gICAgQHJvd3MgPVxuICAgICAgZmlyc3Q6IEBlZGl0b3JFbGVtZW50LmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpXG4gICAgICBsYXN0OiBAZWRpdG9yRWxlbWVudC5nZXRMYXN0VmlzaWJsZVNjcmVlblJvdygpXG4gICAgICBmaW5hbDogQGVkaXRvci5nZXRMYXN0U2NyZWVuUm93KClcblxuY2xhc3MgU2Nyb2xsRG93biBleHRlbmRzIFNjcm9sbFxuICBleGVjdXRlOiAoY291bnQ9MSkgLT5cbiAgICBvbGRGaXJzdFJvdyA9IEBlZGl0b3IuZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93KClcbiAgICBAZWRpdG9yLnNldEZpcnN0VmlzaWJsZVNjcmVlblJvdyhvbGRGaXJzdFJvdyArIGNvdW50KVxuICAgIG5ld0ZpcnN0Um93ID0gQGVkaXRvci5nZXRGaXJzdFZpc2libGVTY3JlZW5Sb3coKVxuXG4gICAgZm9yIGN1cnNvciBpbiBAZWRpdG9yLmdldEN1cnNvcnMoKVxuICAgICAgcG9zaXRpb24gPSBjdXJzb3IuZ2V0U2NyZWVuUG9zaXRpb24oKVxuICAgICAgaWYgcG9zaXRpb24ucm93IDw9IG5ld0ZpcnN0Um93ICsgQHNjcm9sbG9mZlxuICAgICAgICBjdXJzb3Iuc2V0U2NyZWVuUG9zaXRpb24oW3Bvc2l0aW9uLnJvdyArIG5ld0ZpcnN0Um93IC0gb2xkRmlyc3RSb3csIHBvc2l0aW9uLmNvbHVtbl0sIGF1dG9zY3JvbGw6IGZhbHNlKVxuXG4gICAgIyBUT0RPOiByZW1vdmVcbiAgICAjIFRoaXMgaXMgYSB3b3JrYXJvdW5kIGZvciBhIGJ1ZyBmaXhlZCBpbiBhdG9tL2F0b20jMTAwNjJcbiAgICBAZWRpdG9yRWxlbWVudC5jb21wb25lbnQudXBkYXRlU3luYygpXG5cbiAgICByZXR1cm5cblxuY2xhc3MgU2Nyb2xsVXAgZXh0ZW5kcyBTY3JvbGxcbiAgZXhlY3V0ZTogKGNvdW50PTEpIC0+XG4gICAgb2xkRmlyc3RSb3cgPSBAZWRpdG9yLmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpXG4gICAgb2xkTGFzdFJvdyA9IEBlZGl0b3IuZ2V0TGFzdFZpc2libGVTY3JlZW5Sb3coKVxuICAgIEBlZGl0b3Iuc2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93KG9sZEZpcnN0Um93IC0gY291bnQpXG4gICAgbmV3TGFzdFJvdyA9IEBlZGl0b3IuZ2V0TGFzdFZpc2libGVTY3JlZW5Sb3coKVxuXG4gICAgZm9yIGN1cnNvciBpbiBAZWRpdG9yLmdldEN1cnNvcnMoKVxuICAgICAgcG9zaXRpb24gPSBjdXJzb3IuZ2V0U2NyZWVuUG9zaXRpb24oKVxuICAgICAgaWYgcG9zaXRpb24ucm93ID49IG5ld0xhc3RSb3cgLSBAc2Nyb2xsb2ZmXG4gICAgICAgIGN1cnNvci5zZXRTY3JlZW5Qb3NpdGlvbihbcG9zaXRpb24ucm93IC0gKG9sZExhc3RSb3cgLSBuZXdMYXN0Um93KSwgcG9zaXRpb24uY29sdW1uXSwgYXV0b3Njcm9sbDogZmFsc2UpXG5cbiAgICAjIFRPRE86IHJlbW92ZVxuICAgICMgVGhpcyBpcyBhIHdvcmthcm91bmQgZm9yIGEgYnVnIGZpeGVkIGluIGF0b20vYXRvbSMxMDA2MlxuICAgIEBlZGl0b3JFbGVtZW50LmNvbXBvbmVudC51cGRhdGVTeW5jKClcblxuICAgIHJldHVyblxuXG5jbGFzcyBTY3JvbGxDdXJzb3IgZXh0ZW5kcyBTY3JvbGxcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yRWxlbWVudCwgQG9wdHM9e30pIC0+XG4gICAgc3VwZXJcbiAgICBjdXJzb3IgPSBAZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKClcbiAgICBAcGl4ZWwgPSBAZWRpdG9yRWxlbWVudC5waXhlbFBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24oY3Vyc29yKS50b3BcblxuY2xhc3MgU2Nyb2xsQ3Vyc29yVG9Ub3AgZXh0ZW5kcyBTY3JvbGxDdXJzb3JcbiAgZXhlY3V0ZTogLT5cbiAgICBAbW92ZVRvRmlyc3ROb25CbGFuaygpIHVubGVzcyBAb3B0cy5sZWF2ZUN1cnNvclxuICAgIEBzY3JvbGxVcCgpXG5cbiAgc2Nyb2xsVXA6IC0+XG4gICAgcmV0dXJuIGlmIEByb3dzLmxhc3QgaXMgQHJvd3MuZmluYWxcbiAgICBAcGl4ZWwgLT0gKEBlZGl0b3IuZ2V0TGluZUhlaWdodEluUGl4ZWxzKCkgKiBAc2Nyb2xsb2ZmKVxuICAgIEBlZGl0b3JFbGVtZW50LnNldFNjcm9sbFRvcChAcGl4ZWwpXG5cbiAgbW92ZVRvRmlyc3ROb25CbGFuazogLT5cbiAgICBAZWRpdG9yLm1vdmVUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lKClcblxuY2xhc3MgU2Nyb2xsQ3Vyc29yVG9NaWRkbGUgZXh0ZW5kcyBTY3JvbGxDdXJzb3JcbiAgZXhlY3V0ZTogLT5cbiAgICBAbW92ZVRvRmlyc3ROb25CbGFuaygpIHVubGVzcyBAb3B0cy5sZWF2ZUN1cnNvclxuICAgIEBzY3JvbGxNaWRkbGUoKVxuXG4gIHNjcm9sbE1pZGRsZTogLT5cbiAgICBAcGl4ZWwgLT0gKEBlZGl0b3JFbGVtZW50LmdldEhlaWdodCgpIC8gMilcbiAgICBAZWRpdG9yRWxlbWVudC5zZXRTY3JvbGxUb3AoQHBpeGVsKVxuXG4gIG1vdmVUb0ZpcnN0Tm9uQmxhbms6IC0+XG4gICAgQGVkaXRvci5tb3ZlVG9GaXJzdENoYXJhY3Rlck9mTGluZSgpXG5cbmNsYXNzIFNjcm9sbEN1cnNvclRvQm90dG9tIGV4dGVuZHMgU2Nyb2xsQ3Vyc29yXG4gIGV4ZWN1dGU6IC0+XG4gICAgQG1vdmVUb0ZpcnN0Tm9uQmxhbmsoKSB1bmxlc3MgQG9wdHMubGVhdmVDdXJzb3JcbiAgICBAc2Nyb2xsRG93bigpXG5cbiAgc2Nyb2xsRG93bjogLT5cbiAgICByZXR1cm4gaWYgQHJvd3MuZmlyc3QgaXMgMFxuICAgIG9mZnNldCA9IChAZWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpICogKEBzY3JvbGxvZmYgKyAxKSlcbiAgICBAcGl4ZWwgLT0gKEBlZGl0b3JFbGVtZW50LmdldEhlaWdodCgpIC0gb2Zmc2V0KVxuICAgIEBlZGl0b3JFbGVtZW50LnNldFNjcm9sbFRvcChAcGl4ZWwpXG5cbiAgbW92ZVRvRmlyc3ROb25CbGFuazogLT5cbiAgICBAZWRpdG9yLm1vdmVUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lKClcblxuY2xhc3MgU2Nyb2xsSG9yaXpvbnRhbFxuICBpc0NvbXBsZXRlOiAtPiB0cnVlXG4gIGlzUmVjb3JkYWJsZTogLT4gZmFsc2VcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yRWxlbWVudCkgLT5cbiAgICBAZWRpdG9yID0gQGVkaXRvckVsZW1lbnQuZ2V0TW9kZWwoKVxuICAgIGN1cnNvclBvcyA9IEBlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKVxuICAgIEBwaXhlbCA9IEBlZGl0b3JFbGVtZW50LnBpeGVsUG9zaXRpb25Gb3JTY3JlZW5Qb3NpdGlvbihjdXJzb3JQb3MpLmxlZnRcbiAgICBAY3Vyc29yID0gQGVkaXRvci5nZXRMYXN0Q3Vyc29yKClcblxuICBwdXRDdXJzb3JPblNjcmVlbjogLT5cbiAgICBAZWRpdG9yLnNjcm9sbFRvQ3Vyc29yUG9zaXRpb24oe2NlbnRlcjogZmFsc2V9KVxuXG5jbGFzcyBTY3JvbGxDdXJzb3JUb0xlZnQgZXh0ZW5kcyBTY3JvbGxIb3Jpem9udGFsXG4gIGV4ZWN1dGU6IC0+XG4gICAgQGVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsTGVmdChAcGl4ZWwpXG4gICAgQHB1dEN1cnNvck9uU2NyZWVuKClcblxuY2xhc3MgU2Nyb2xsQ3Vyc29yVG9SaWdodCBleHRlbmRzIFNjcm9sbEhvcml6b250YWxcbiAgZXhlY3V0ZTogLT5cbiAgICBAZWRpdG9yRWxlbWVudC5zZXRTY3JvbGxSaWdodChAcGl4ZWwpXG4gICAgQHB1dEN1cnNvck9uU2NyZWVuKClcblxubW9kdWxlLmV4cG9ydHMgPSB7U2Nyb2xsRG93biwgU2Nyb2xsVXAsIFNjcm9sbEN1cnNvclRvVG9wLCBTY3JvbGxDdXJzb3JUb01pZGRsZSxcbiAgU2Nyb2xsQ3Vyc29yVG9Cb3R0b20sIFNjcm9sbEN1cnNvclRvTGVmdCwgU2Nyb2xsQ3Vyc29yVG9SaWdodH1cbiJdfQ==
