(function() {
  var EditLine, LineMeta, MAX_SKIP_EMPTY_LINE_ALLOWED, config;

  config = require("../config");

  LineMeta = require("../helpers/line-meta");

  MAX_SKIP_EMPTY_LINE_ALLOWED = 5;

  module.exports = EditLine = (function() {
    function EditLine(action) {
      this.action = action;
      this.editor = atom.workspace.getActiveTextEditor();
    }

    EditLine.prototype.trigger = function(e) {
      var fn;
      fn = this.action.replace(/-[a-z]/ig, function(s) {
        return s[1].toUpperCase();
      });
      return this.editor.transact((function(_this) {
        return function() {
          return _this.editor.getSelections().forEach(function(selection) {
            return _this[fn](e, selection);
          });
        };
      })(this));
    };

    EditLine.prototype.insertNewLine = function(e, selection) {
      var cursor, line, lineMeta;
      if (this._isRangeSelection(selection)) {
        return e.abortKeyBinding();
      }
      cursor = selection.getHeadBufferPosition();
      line = this.editor.lineTextForBufferRow(cursor.row);
      if (cursor.column < line.length && !config.get("inlineNewLineContinuation")) {
        return e.abortKeyBinding();
      }
      lineMeta = new LineMeta(line);
      if (lineMeta.isContinuous()) {
        if (lineMeta.isEmptyBody()) {
          return this._insertNewlineWithoutContinuation(cursor);
        } else {
          return this._insertNewlineWithContinuation(lineMeta.nextLine);
        }
      } else {
        return e.abortKeyBinding();
      }
    };

    EditLine.prototype._insertNewlineWithContinuation = function(nextLine) {
      return this.editor.insertText("\n" + nextLine);
    };

    EditLine.prototype._insertNewlineWithoutContinuation = function(cursor) {
      var currentIndentation, emptyLineSkipped, i, indentation, line, nextLine, ref, row;
      nextLine = "\n";
      currentIndentation = this.editor.indentationForBufferRow(cursor.row);
      if (currentIndentation > 0 && cursor.row > 1) {
        emptyLineSkipped = 0;
        for (row = i = ref = cursor.row - 1; ref <= 0 ? i <= 0 : i >= 0; row = ref <= 0 ? ++i : --i) {
          line = this.editor.lineTextForBufferRow(row);
          if (line.trim() === "") {
            if (emptyLineSkipped > MAX_SKIP_EMPTY_LINE_ALLOWED) {
              break;
            }
            emptyLineSkipped += 1;
          } else {
            indentation = this.editor.indentationForBufferRow(row);
            if (indentation >= currentIndentation) {
              continue;
            }
            if (indentation === currentIndentation - 1 && LineMeta.isList(line)) {
              nextLine = new LineMeta(line).nextLine;
            }
            break;
          }
        }
      }
      this.editor.selectToBeginningOfLine();
      return this.editor.insertText(nextLine);
    };

    EditLine.prototype.indentListLine = function(e, selection) {
      var cursor, line;
      if (this._isRangeSelection(selection)) {
        return e.abortKeyBinding();
      }
      cursor = selection.getHeadBufferPosition();
      line = this.editor.lineTextForBufferRow(cursor.row);
      if (LineMeta.isList(line)) {
        return selection.indentSelectedRows();
      } else if (this._isAtLineBeginning(line, cursor.column)) {
        return selection.indent();
      } else {
        return e.abortKeyBinding();
      }
    };

    EditLine.prototype._isAtLineBeginning = function(line, col) {
      return col === 0 || line.substring(0, col).trim() === "";
    };

    EditLine.prototype._isRangeSelection = function(selection) {
      var head, tail;
      head = selection.getHeadBufferPosition();
      tail = selection.getTailBufferPosition();
      return head.row !== tail.row || head.column !== tail.column;
    };

    return EditLine;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvY29tbWFuZHMvZWRpdC1saW5lLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSOztFQUNULFFBQUEsR0FBVyxPQUFBLENBQVEsc0JBQVI7O0VBRVgsMkJBQUEsR0FBOEI7O0VBRTlCLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFFUyxrQkFBQyxNQUFEO01BQ1gsSUFBQyxDQUFBLE1BQUQsR0FBVTtNQUNWLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO0lBRkM7O3VCQUliLE9BQUEsR0FBUyxTQUFDLENBQUQ7QUFDUCxVQUFBO01BQUEsRUFBQSxHQUFLLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFnQixVQUFoQixFQUE0QixTQUFDLENBQUQ7ZUFBTyxDQUFFLENBQUEsQ0FBQSxDQUFFLENBQUMsV0FBTCxDQUFBO01BQVAsQ0FBNUI7YUFFTCxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsQ0FBaUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNmLEtBQUMsQ0FBQSxNQUFNLENBQUMsYUFBUixDQUFBLENBQXVCLENBQUMsT0FBeEIsQ0FBZ0MsU0FBQyxTQUFEO21CQUM5QixLQUFFLENBQUEsRUFBQSxDQUFGLENBQU0sQ0FBTixFQUFTLFNBQVQ7VUFEOEIsQ0FBaEM7UUFEZTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakI7SUFITzs7dUJBT1QsYUFBQSxHQUFlLFNBQUMsQ0FBRCxFQUFJLFNBQUo7QUFDYixVQUFBO01BQUEsSUFBOEIsSUFBQyxDQUFBLGlCQUFELENBQW1CLFNBQW5CLENBQTlCO0FBQUEsZUFBTyxDQUFDLENBQUMsZUFBRixDQUFBLEVBQVA7O01BRUEsTUFBQSxH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LFNBQUwsQ0FBZSxDQUFmLEVBQWtCLEdBQWxCLENBQXNCLENBQUMsSUFBdkIsQ0FBQSxDQUFBLEtBQWlDO0lBRDNCOzt1QkFHcEIsaUJBQUEsR0FBbUIsU0FBQyxTQUFEO0FBQ2pCLFVBQUE7TUFBQSxJQUFBLEdBQU8sU0FBUyxDQUFDLHFCQUFWLENBQUE7TUFDUCxJQUFBLEdBQU8sU0FBUyxDQUFDLHFCQUFWLENBQUE7YUFFUCxJQUFJLENBQUMsR0FBTCxLQUFZLElBQUksQ0FBQyxHQUFqQixJQUF3QixJQUFJLENBQUMsTUFBTCxLQUFlLElBQUksQ0FBQztJQUozQjs7Ozs7QUFsRnJCIiwic291cmNlc0NvbnRlbnQiOlsiY29uZmlnID0gcmVxdWlyZSBcIi4uL2NvbmZpZ1wiXG5MaW5lTWV0YSA9IHJlcXVpcmUgXCIuLi9oZWxwZXJzL2xpbmUtbWV0YVwiXG5cbk1BWF9TS0lQX0VNUFRZX0xJTkVfQUxMT1dFRCA9IDVcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgRWRpdExpbmVcbiAgIyBhY3Rpb246IGluc2VydC1uZXctbGluZSwgaW5kZW50LWxpc3QtbGluZVxuICBjb25zdHJ1Y3RvcjogKGFjdGlvbikgLT5cbiAgICBAYWN0aW9uID0gYWN0aW9uXG4gICAgQGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gIHRyaWdnZXI6IChlKSAtPlxuICAgIGZuID0gQGFjdGlvbi5yZXBsYWNlIC8tW2Etel0vaWcsIChzKSAtPiBzWzFdLnRvVXBwZXJDYXNlKClcblxuICAgIEBlZGl0b3IudHJhbnNhY3QgPT5cbiAgICAgIEBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpLmZvckVhY2ggKHNlbGVjdGlvbikgPT5cbiAgICAgICAgQFtmbl0oZSwgc2VsZWN0aW9uKVxuXG4gIGluc2VydE5ld0xpbmU6IChlLCBzZWxlY3Rpb24pIC0+XG4gICAgcmV0dXJuIGUuYWJvcnRLZXlCaW5kaW5nKCkgaWYgQF9pc1JhbmdlU2VsZWN0aW9uKHNlbGVjdGlvbilcblxuICAgIGN1cnNvciA9IHNlbGVjdGlvbi5nZXRIZWFkQnVmZmVyUG9zaXRpb24oKVxuICAgIGxpbmUgPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGN1cnNvci5yb3cpXG5cbiAgICAjIHdoZW4gY3Vyc29yIGlzIGF0IG1pZGRsZSBvZiBsaW5lLCBkbyBhIG5vcm1hbCBpbnNlcnQgbGluZVxuICAgICMgdW5sZXNzIGlubGluZSBjb250aW51YXRpb24gaXMgZW5hYmxlZFxuICAgIGlmIGN1cnNvci5jb2x1bW4gPCBsaW5lLmxlbmd0aCAmJiAhY29uZmlnLmdldChcImlubGluZU5ld0xpbmVDb250aW51YXRpb25cIilcbiAgICAgIHJldHVybiBlLmFib3J0S2V5QmluZGluZygpXG5cbiAgICBsaW5lTWV0YSA9IG5ldyBMaW5lTWV0YShsaW5lKVxuICAgIGlmIGxpbmVNZXRhLmlzQ29udGludW91cygpXG4gICAgICBpZiBsaW5lTWV0YS5pc0VtcHR5Qm9keSgpXG4gICAgICAgIEBfaW5zZXJ0TmV3bGluZVdpdGhvdXRDb250aW51YXRpb24oY3Vyc29yKVxuICAgICAgZWxzZVxuICAgICAgICBAX2luc2VydE5ld2xpbmVXaXRoQ29udGludWF0aW9uKGxpbmVNZXRhLm5leHRMaW5lKVxuICAgIGVsc2VcbiAgICAgIGUuYWJvcnRLZXlCaW5kaW5nKClcblxuICBfaW5zZXJ0TmV3bGluZVdpdGhDb250aW51YXRpb246IChuZXh0TGluZSkgLT5cbiAgICBAZWRpdG9yLmluc2VydFRleHQoXCJcXG4je25leHRMaW5lfVwiKVxuXG4gIF9pbnNlcnROZXdsaW5lV2l0aG91dENvbnRpbnVhdGlvbjogKGN1cnNvcikgLT5cbiAgICBuZXh0TGluZSA9IFwiXFxuXCJcbiAgICBjdXJyZW50SW5kZW50YXRpb24gPSBAZWRpdG9yLmluZGVudGF0aW9uRm9yQnVmZmVyUm93KGN1cnNvci5yb3cpXG5cbiAgICAjIGlmIGl0IGlzIGFuIGluZGVudGVkIGVtcHR5IGxpc3QsIHdlIHdpbGwgZ28gdXAgbGluZXMgYW5kIHRyeSB0byBmaW5kXG4gICAgIyBpdHMgcGFyZW50J3MgbGlzdCBwcmVmaXggYW5kIHVzZSB0aGF0IGlmIHBvc3NpYmxlXG4gICAgaWYgY3VycmVudEluZGVudGF0aW9uID4gMCAmJiBjdXJzb3Iucm93ID4gMVxuICAgICAgZW1wdHlMaW5lU2tpcHBlZCA9IDBcblxuICAgICAgZm9yIHJvdyBpbiBbKGN1cnNvci5yb3cgLSAxKS4uMF1cbiAgICAgICAgbGluZSA9IEBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cocm93KVxuXG4gICAgICAgIGlmIGxpbmUudHJpbSgpID09IFwiXCIgIyBza2lwIGVtcHR5IGxpbmVzIGluIGNhc2Ugb2YgbGlzdCBwYXJhZ3JhcGhzXG4gICAgICAgICAgYnJlYWsgaWYgZW1wdHlMaW5lU2tpcHBlZCA+IE1BWF9TS0lQX0VNUFRZX0xJTkVfQUxMT1dFRFxuICAgICAgICAgIGVtcHR5TGluZVNraXBwZWQgKz0gMVxuICAgICAgICBlbHNlICMgZmluZCBwYXJlbnQgd2l0aCBpbmRlbnRhdGlvbiA9IGN1cnJlbnQgaW5kZW50YXRpb24gLSAxXG4gICAgICAgICAgaW5kZW50YXRpb24gPSBAZWRpdG9yLmluZGVudGF0aW9uRm9yQnVmZmVyUm93KHJvdylcbiAgICAgICAgICBjb250aW51ZSBpZiBpbmRlbnRhdGlvbiA+PSBjdXJyZW50SW5kZW50YXRpb25cbiAgICAgICAgICBuZXh0TGluZSA9IG5ldyBMaW5lTWV0YShsaW5lKS5uZXh0TGluZSBpZiBpbmRlbnRhdGlvbiA9PSBjdXJyZW50SW5kZW50YXRpb24gLSAxICYmIExpbmVNZXRhLmlzTGlzdChsaW5lKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICBAZWRpdG9yLnNlbGVjdFRvQmVnaW5uaW5nT2ZMaW5lKClcbiAgICBAZWRpdG9yLmluc2VydFRleHQobmV4dExpbmUpXG5cbiAgaW5kZW50TGlzdExpbmU6IChlLCBzZWxlY3Rpb24pIC0+XG4gICAgcmV0dXJuIGUuYWJvcnRLZXlCaW5kaW5nKCkgaWYgQF9pc1JhbmdlU2VsZWN0aW9uKHNlbGVjdGlvbilcblxuICAgIGN1cnNvciA9IHNlbGVjdGlvbi5nZXRIZWFkQnVmZmVyUG9zaXRpb24oKVxuICAgIGxpbmUgPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGN1cnNvci5yb3cpXG5cbiAgICBpZiBMaW5lTWV0YS5pc0xpc3QobGluZSlcbiAgICAgIHNlbGVjdGlvbi5pbmRlbnRTZWxlY3RlZFJvd3MoKVxuICAgIGVsc2UgaWYgQF9pc0F0TGluZUJlZ2lubmluZyhsaW5lLCBjdXJzb3IuY29sdW1uKSAjIGluZGVudCBvbiBzdGFydCBvZiBsaW5lXG4gICAgICBzZWxlY3Rpb24uaW5kZW50KClcbiAgICBlbHNlXG4gICAgICBlLmFib3J0S2V5QmluZGluZygpXG5cbiAgX2lzQXRMaW5lQmVnaW5uaW5nOiAobGluZSwgY29sKSAtPlxuICAgIGNvbCA9PSAwIHx8IGxpbmUuc3Vic3RyaW5nKDAsIGNvbCkudHJpbSgpID09IFwiXCJcblxuICBfaXNSYW5nZVNlbGVjdGlvbjogKHNlbGVjdGlvbikgLT5cbiAgICBoZWFkID0gc2VsZWN0aW9uLmdldEhlYWRCdWZmZXJQb3NpdGlvbigpXG4gICAgdGFpbCA9IHNlbGVjdGlvbi5nZXRUYWlsQnVmZmVyUG9zaXRpb24oKVxuXG4gICAgaGVhZC5yb3cgIT0gdGFpbC5yb3cgfHwgaGVhZC5jb2x1bW4gIT0gdGFpbC5jb2x1bW5cbiJdfQ==
