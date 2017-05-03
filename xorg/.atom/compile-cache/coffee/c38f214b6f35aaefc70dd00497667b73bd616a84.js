(function() {
  var StyleLine, config, utils;

  config = require("../config");

  utils = require("../utils");

  module.exports = StyleLine = (function() {
    function StyleLine(style) {
      var base, base1, base2, base3, base4, base5;
      this.style = config.get("lineStyles." + style);
      if ((base = this.style).before == null) {
        base.before = "";
      }
      if ((base1 = this.style).after == null) {
        base1.after = "";
      }
      if ((base2 = this.style).regexMatchBefore == null) {
        base2.regexMatchBefore = this.style.regexBefore || this.style.before;
      }
      if ((base3 = this.style).regexMatchAfter == null) {
        base3.regexMatchAfter = this.style.regexAfter || this.style.after;
      }
      if (this.style.before) {
        if ((base4 = this.style).regexBefore == null) {
          base4.regexBefore = this.style.before[0] + "+\\s";
        }
      }
      if (this.style.after) {
        if ((base5 = this.style).regexAfter == null) {
          base5.regexAfter = "\\s" + this.style.after[this.style.after.length - 1] + "*";
        }
      }
    }

    StyleLine.prototype.trigger = function(e) {
      this.editor = atom.workspace.getActiveTextEditor();
      return this.editor.transact((function(_this) {
        return function() {
          return _this.editor.getSelections().forEach(function(selection) {
            var i, line, range, ref, ref1, row, rows;
            range = selection.getBufferRange();
            rows = selection.getBufferRowRange();
            for (row = i = ref = rows[0], ref1 = rows[1]; ref <= ref1 ? i <= ref1 : i >= ref1; row = ref <= ref1 ? ++i : --i) {
              selection.cursor.setBufferPosition([row, 0]);
              selection.selectToEndOfLine();
              if (line = selection.getText()) {
                _this.toggleStyle(selection, line);
              } else {
                _this.insertEmptyStyle(selection);
              }
            }
            if (rows[0] !== rows[1]) {
              return selection.setBufferRange(range);
            }
          });
        };
      })(this));
    };

    StyleLine.prototype.toggleStyle = function(selection, text) {
      if (this.isStyleOn(text)) {
        text = this.removeStyle(text);
      } else {
        text = this.addStyle(text);
      }
      return selection.insertText(text);
    };

    StyleLine.prototype.insertEmptyStyle = function(selection) {
      var position;
      selection.insertText(this.style.before);
      position = selection.cursor.getBufferPosition();
      selection.insertText(this.style.after);
      return selection.cursor.setBufferPosition(position);
    };

    StyleLine.prototype.isStyleOn = function(text) {
      return RegExp("^(\\s*)" + this.style.regexMatchBefore + "(.*?)" + this.style.regexMatchAfter + "(\\s*)$", "i").test(text);
    };

    StyleLine.prototype.addStyle = function(text) {
      var match;
      match = this.getStylePattern().exec(text);
      if (match) {
        return "" + match[1] + this.style.before + match[2] + this.style.after + match[3];
      } else {
        return "" + this.style.before + this.style.after;
      }
    };

    StyleLine.prototype.removeStyle = function(text) {
      var matches;
      matches = this.getStylePattern().exec(text);
      return matches.slice(1).join("");
    };

    StyleLine.prototype.getStylePattern = function() {
      var after, before;
      before = this.style.regexBefore || utils.escapeRegExp(this.style.before);
      after = this.style.regexAfter || utils.escapeRegExp(this.style.after);
      return RegExp("^(\\s*)(?:" + before + ")?(.*?)(?:" + after + ")?(\\s*)$", "i");
    };

    return StyleLine;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvY29tbWFuZHMvc3R5bGUtbGluZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUjs7RUFDVCxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVI7O0VBRVIsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQVVTLG1CQUFDLEtBQUQ7QUFDWCxVQUFBO01BQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxNQUFNLENBQUMsR0FBUCxDQUFXLGFBQUEsR0FBYyxLQUF6Qjs7WUFFSCxDQUFDLFNBQVU7OzthQUNYLENBQUMsUUFBUzs7O2FBRVYsQ0FBQyxtQkFBb0IsSUFBQyxDQUFBLEtBQUssQ0FBQyxXQUFQLElBQXNCLElBQUMsQ0FBQSxLQUFLLENBQUM7OzthQUNsRCxDQUFDLGtCQUFtQixJQUFDLENBQUEsS0FBSyxDQUFDLFVBQVAsSUFBcUIsSUFBQyxDQUFBLEtBQUssQ0FBQzs7TUFFdEQsSUFBbUQsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUExRDs7ZUFBTSxDQUFDLGNBQWtCLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTyxDQUFBLENBQUEsQ0FBZixHQUFrQjtTQUExQzs7TUFDQSxJQUF1RSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQTlFOztlQUFNLENBQUMsYUFBYyxLQUFBLEdBQU0sSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFNLENBQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBYixHQUFzQixDQUF0QixDQUFuQixHQUE0QztTQUFqRTs7SUFWVzs7d0JBWWIsT0FBQSxHQUFTLFNBQUMsQ0FBRDtNQUNQLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO2FBQ1YsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFS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c0IsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUExQjtNQUMvQixLQUFBLEdBQVEsSUFBQyxDQUFBLEtBQUssQ0FBQyxVQUFQLElBQXFCLEtBQUssQ0FBQyxZQUFOLENBQW1CLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBMUI7YUFFN0IsTUFBQSxDQUFBLFlBQUEsR0FBZ0IsTUFBaEIsR0FBdUIsWUFBdkIsR0FBcUMsS0FBckMsR0FBMkMsV0FBM0MsRUFBd0QsR0FBeEQ7SUFKZTs7Ozs7QUE1RW5CIiwic291cmNlc0NvbnRlbnQiOlsiY29uZmlnID0gcmVxdWlyZSBcIi4uL2NvbmZpZ1wiXG51dGlscyA9IHJlcXVpcmUgXCIuLi91dGlsc1wiXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFN0eWxlTGluZVxuICAjIEBzdHlsZSBjb25maWcgY291bGQgY29udGFpbnM6XG4gICNcbiAgIyAtIGJlZm9yZSAocmVxdWlyZWQpXG4gICMgLSBhZnRlciAocmVxdWlyZWQpXG4gICMgLSByZWdleEJlZm9yZSAob3B0aW9uYWwpIG92ZXJ3cml0ZXMgYmVmb3JlIHdoZW4gdG8gbWF0Y2gvcmVwbGFjZSBzdHJpbmdcbiAgIyAtIHJlZ2V4QWZ0ZXIgKG9wdGlvbmFsKSBvdmVyd3JpdGVzIGFmdGVyIHdoZW4gdG8gbWF0Y2gvcmVwbGFjZSBzdHJpbmdcbiAgIyAtIHJlZ2V4TWF0Y2hCZWZvcmUgKG9wdGlvbmFsKSB0byBkZXRlY3QgYSBzdHJpbmcgbWF0Y2ggdGhlIHN0eWxlIHBhdHRlcm5cbiAgIyAtIHJlZ2V4TWF0Y2hBZnRlciAob3B0aW9uYWwpIHRvIGRldGVjdCBhIHN0cmluZyBtYXRjaCB0aGUgc3R5bGUgcGF0dGVyblxuICAjXG4gIGNvbnN0cnVjdG9yOiAoc3R5bGUpIC0+XG4gICAgQHN0eWxlID0gY29uZmlnLmdldChcImxpbmVTdHlsZXMuI3tzdHlsZX1cIilcbiAgICAjIG1ha2Ugc3VyZSBiZWZvcmUvYWZ0ZXIgZXhpc3RcbiAgICBAc3R5bGUuYmVmb3JlID89IFwiXCJcbiAgICBAc3R5bGUuYWZ0ZXIgPz0gXCJcIlxuICAgICMgdXNlIHJlZ2V4QmVmb3JlLCByZWdleEFmdGVyIGlmIG5vdCBzcGVjaWZpZWRcbiAgICBAc3R5bGUucmVnZXhNYXRjaEJlZm9yZSA/PSBAc3R5bGUucmVnZXhCZWZvcmUgfHwgQHN0eWxlLmJlZm9yZVxuICAgIEBzdHlsZS5yZWdleE1hdGNoQWZ0ZXIgPz0gQHN0eWxlLnJlZ2V4QWZ0ZXIgfHwgQHN0eWxlLmFmdGVyXG4gICAgIyBzZXQgcmVnZXhCZWZvcmUgZm9yIGhlYWRpbmdzIHRoYXQgb25seSBuZWVkIHRvIGNoZWNrIHRoZSAxc3QgY2hhclxuICAgIEBzdHlsZS5yZWdleEJlZm9yZSA/PSBcIiN7QHN0eWxlLmJlZm9yZVswXX0rXFxcXHNcIiBpZiBAc3R5bGUuYmVmb3JlXG4gICAgQHN0eWxlLnJlZ2V4QWZ0ZXIgPz0gXCJcXFxccyN7QHN0eWxlLmFmdGVyW0BzdHlsZS5hZnRlci5sZW5ndGggLSAxXX0qXCIgaWYgQHN0eWxlLmFmdGVyXG5cbiAgdHJpZ2dlcjogKGUpIC0+XG4gICAgQGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIEBlZGl0b3IudHJhbnNhY3QgPT5cbiAgICAgIEBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpLmZvckVhY2ggKHNlbGVjdGlvbikgPT5cbiAgICAgICAgcmFuZ2UgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgICAjIHdoZW4gc2VsZWN0aW9uIGNvbnRhaW5zIG11bHRpcGxlIHJvd3MsIGFwcGx5IHN0eWxlIHRvIGVhY2ggcm93XG4gICAgICAgIHJvd3MgID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJvd1JhbmdlKClcbiAgICAgICAgZm9yIHJvdyBpbiBbcm93c1swXS4ucm93c1sxXV1cbiAgICAgICAgICBzZWxlY3Rpb24uY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKFtyb3csIDBdKVxuICAgICAgICAgIHNlbGVjdGlvbi5zZWxlY3RUb0VuZE9mTGluZSgpXG5cbiAgICAgICAgICBpZiBsaW5lID0gc2VsZWN0aW9uLmdldFRleHQoKVxuICAgICAgICAgICAgQHRvZ2dsZVN0eWxlKHNlbGVjdGlvbiwgbGluZSlcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAaW5zZXJ0RW1wdHlTdHlsZShzZWxlY3Rpb24pXG4gICAgICAgICMgc2VsZWN0IHRoZSB3aG9sZSByYW5nZSwgaWYgc2VsZWN0aW9uIGNvbnRhaW5zIG11bHRpcGxlIHJvd3NcbiAgICAgICAgc2VsZWN0aW9uLnNldEJ1ZmZlclJhbmdlKHJhbmdlKSBpZiByb3dzWzBdICE9IHJvd3NbMV1cblxuICB0b2dnbGVTdHlsZTogKHNlbGVjdGlvbiwgdGV4dCkgLT5cbiAgICBpZiBAaXNTdHlsZU9uKHRleHQpXG4gICAgICB0ZXh0ID0gQHJlbW92ZVN0eWxlKHRleHQpXG4gICAgZWxzZVxuICAgICAgdGV4dCA9IEBhZGRTdHlsZSh0ZXh0KVxuICAgIHNlbGVjdGlvbi5pbnNlcnRUZXh0KHRleHQpXG5cbiAgaW5zZXJ0RW1wdHlTdHlsZTogKHNlbGVjdGlvbikgLT5cbiAgICBzZWxlY3Rpb24uaW5zZXJ0VGV4dChAc3R5bGUuYmVmb3JlKVxuICAgIHBvc2l0aW9uID0gc2VsZWN0aW9uLmN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgc2VsZWN0aW9uLmluc2VydFRleHQoQHN0eWxlLmFmdGVyKVxuICAgIHNlbGVjdGlvbi5jdXJzb3Iuc2V0QnVmZmVyUG9zaXRpb24ocG9zaXRpb24pXG5cbiAgIyB1c2UgcmVnZXhNYXRjaEJlZm9yZS9yZWdleE1hdGNoQWZ0ZXIgdG8gbWF0Y2ggdGhlIHN0cmluZ1xuICBpc1N0eWxlT246ICh0ZXh0KSAtPlxuICAgIC8vLyBeKFxccyopICAgICAgICAgICAgICAgICAgICMgc3RhcnQgd2l0aCBhbnkgc3BhY2VzXG4gICAgI3tAc3R5bGUucmVnZXhNYXRjaEJlZm9yZX0gICAjIHN0eWxlIHN0YXJ0XG4gICAgICAoLio/KSAgICAgICAgICAgICAgICAgICAgICAjIGFueSB0ZXh0XG4gICAgI3tAc3R5bGUucmVnZXhNYXRjaEFmdGVyfSAgICAjIHN0eWxlIGVuZFxuICAgIChcXHMqKSQgLy8vaS50ZXN0KHRleHQpXG5cbiAgYWRkU3R5bGU6ICh0ZXh0KSAtPlxuICAgIG1hdGNoID0gQGdldFN0eWxlUGF0dGVybigpLmV4ZWModGV4dClcbiAgICBpZiBtYXRjaFxuICAgICAgXCIje21hdGNoWzFdfSN7QHN0eWxlLmJlZm9yZX0je21hdGNoWzJdfSN7QHN0eWxlLmFmdGVyfSN7bWF0Y2hbM119XCJcbiAgICBlbHNlXG4gICAgICBcIiN7QHN0eWxlLmJlZm9yZX0je0BzdHlsZS5hZnRlcn1cIlxuXG4gIHJlbW92ZVN0eWxlOiAodGV4dCkgLT5cbiAgICBtYXRjaGVzID0gQGdldFN0eWxlUGF0dGVybigpLmV4ZWModGV4dClcbiAgICByZXR1cm4gbWF0Y2hlc1sxLi5dLmpvaW4oXCJcIilcblxuICBnZXRTdHlsZVBhdHRlcm46IC0+XG4gICAgYmVmb3JlID0gQHN0eWxlLnJlZ2V4QmVmb3JlIHx8IHV0aWxzLmVzY2FwZVJlZ0V4cChAc3R5bGUuYmVmb3JlKVxuICAgIGFmdGVyID0gQHN0eWxlLnJlZ2V4QWZ0ZXIgfHwgdXRpbHMuZXNjYXBlUmVnRXhwKEBzdHlsZS5hZnRlcilcblxuICAgIC8vLyBeKFxccyopICg/OiN7YmVmb3JlfSk/ICguKj8pICg/OiN7YWZ0ZXJ9KT8gKFxccyopJCAvLy9pXG4iXX0=
