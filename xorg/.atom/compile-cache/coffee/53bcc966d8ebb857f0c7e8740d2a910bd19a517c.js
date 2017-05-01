(function() {
  var AllWhitespace, Paragraph, Range, SelectAParagraph, SelectAWholeWord, SelectAWord, SelectInsideBrackets, SelectInsideParagraph, SelectInsideQuotes, SelectInsideWholeWord, SelectInsideWord, TextObject, WholeWordRegex, mergeRanges,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Range = require('atom').Range;

  AllWhitespace = /^\s$/;

  WholeWordRegex = /\S+/;

  mergeRanges = require('./utils').mergeRanges;

  TextObject = (function() {
    function TextObject(editor, state) {
      this.editor = editor;
      this.state = state;
    }

    TextObject.prototype.isComplete = function() {
      return true;
    };

    TextObject.prototype.isRecordable = function() {
      return false;
    };

    TextObject.prototype.execute = function() {
      return this.select.apply(this, arguments);
    };

    return TextObject;

  })();

  SelectInsideWord = (function(superClass) {
    extend(SelectInsideWord, superClass);

    function SelectInsideWord() {
      return SelectInsideWord.__super__.constructor.apply(this, arguments);
    }

    SelectInsideWord.prototype.select = function() {
      var i, len, ref, selection;
      ref = this.editor.getSelections();
      for (i = 0, len = ref.length; i < len; i++) {
        selection = ref[i];
        if (selection.isEmpty()) {
          selection.selectRight();
        }
        selection.expandOverWord();
      }
      return [true];
    };

    return SelectInsideWord;

  })(TextObject);

  SelectInsideWholeWord = (function(superClass) {
    extend(SelectInsideWholeWord, superClass);

    function SelectInsideWholeWord() {
      return SelectInsideWholeWord.__super__.constructor.apply(this, arguments);
    }

    SelectInsideWholeWord.prototype.select = function() {
      var i, len, range, ref, results, selection;
      ref = this.editor.getSelections();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        selection = ref[i];
        range = selection.cursor.getCurrentWordBufferRange({
          wordRegex: WholeWordRegex
        });
        selection.setBufferRange(mergeRanges(selection.getBufferRange(), range));
        results.push(true);
      }
      return results;
    };

    return SelectInsideWholeWord;

  })(TextObject);

  SelectInsideQuotes = (function(superClass) {
    extend(SelectInsideQuotes, superClass);

    function SelectInsideQuotes(editor, char1, includeQuotes) {
      this.editor = editor;
      this.char = char1;
      this.includeQuotes = includeQuotes;
    }

    SelectInsideQuotes.prototype.findOpeningQuote = function(pos) {
      var line, start;
      start = pos.copy();
      pos = pos.copy();
      while (pos.row >= 0) {
        line = this.editor.lineTextForBufferRow(pos.row);
        if (pos.column === -1) {
          pos.column = line.length - 1;
        }
        while (pos.column >= 0) {
          if (line[pos.column] === this.char) {
            if (pos.column === 0 || line[pos.column - 1] !== '\\') {
              if (this.isStartQuote(pos)) {
                return pos;
              } else {
                return this.lookForwardOnLine(start);
              }
            }
          }
          --pos.column;
        }
        pos.column = -1;
        --pos.row;
      }
      return this.lookForwardOnLine(start);
    };

    SelectInsideQuotes.prototype.isStartQuote = function(end) {
      var line, numQuotes;
      line = this.editor.lineTextForBufferRow(end.row);
      numQuotes = line.substring(0, end.column + 1).replace("'" + this.char, '').split(this.char).length - 1;
      return numQuotes % 2;
    };

    SelectInsideQuotes.prototype.lookForwardOnLine = function(pos) {
      var index, line;
      line = this.editor.lineTextForBufferRow(pos.row);
      index = line.substring(pos.column).indexOf(this.char);
      if (index >= 0) {
        pos.column += index;
        return pos;
      }
      return null;
    };

    SelectInsideQuotes.prototype.findClosingQuote = function(start) {
      var end, endLine, escaping;
      end = start.copy();
      escaping = false;
      while (end.row < this.editor.getLineCount()) {
        endLine = this.editor.lineTextForBufferRow(end.row);
        while (end.column < endLine.length) {
          if (endLine[end.column] === '\\') {
            ++end.column;
          } else if (endLine[end.column] === this.char) {
            if (this.includeQuotes) {
              --start.column;
            }
            if (this.includeQuotes) {
              ++end.column;
            }
            return end;
          }
          ++end.column;
        }
        end.column = 0;
        ++end.row;
      }
    };

    SelectInsideQuotes.prototype.select = function() {
      var end, i, len, ref, results, selection, start;
      ref = this.editor.getSelections();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        selection = ref[i];
        start = this.findOpeningQuote(selection.cursor.getBufferPosition());
        if (start != null) {
          ++start.column;
          end = this.findClosingQuote(start);
          if (end != null) {
            selection.setBufferRange(mergeRanges(selection.getBufferRange(), [start, end]));
          }
        }
        results.push(!selection.isEmpty());
      }
      return results;
    };

    return SelectInsideQuotes;

  })(TextObject);

  SelectInsideBrackets = (function(superClass) {
    extend(SelectInsideBrackets, superClass);

    function SelectInsideBrackets(editor, beginChar, endChar, includeBrackets) {
      this.editor = editor;
      this.beginChar = beginChar;
      this.endChar = endChar;
      this.includeBrackets = includeBrackets;
    }

    SelectInsideBrackets.prototype.findOpeningBracket = function(pos) {
      var depth, line;
      pos = pos.copy();
      depth = 0;
      while (pos.row >= 0) {
        line = this.editor.lineTextForBufferRow(pos.row);
        if (pos.column === -1) {
          pos.column = line.length - 1;
        }
        while (pos.column >= 0) {
          switch (line[pos.column]) {
            case this.endChar:
              ++depth;
              break;
            case this.beginChar:
              if (--depth < 0) {
                return pos;
              }
          }
          --pos.column;
        }
        pos.column = -1;
        --pos.row;
      }
    };

    SelectInsideBrackets.prototype.findClosingBracket = function(start) {
      var depth, end, endLine;
      end = start.copy();
      depth = 0;
      while (end.row < this.editor.getLineCount()) {
        endLine = this.editor.lineTextForBufferRow(end.row);
        while (end.column < endLine.length) {
          switch (endLine[end.column]) {
            case this.beginChar:
              ++depth;
              break;
            case this.endChar:
              if (--depth < 0) {
                if (this.includeBrackets) {
                  --start.column;
                }
                if (this.includeBrackets) {
                  ++end.column;
                }
                return end;
              }
          }
          ++end.column;
        }
        end.column = 0;
        ++end.row;
      }
    };

    SelectInsideBrackets.prototype.select = function() {
      var end, i, len, ref, results, selection, start;
      ref = this.editor.getSelections();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        selection = ref[i];
        start = this.findOpeningBracket(selection.cursor.getBufferPosition());
        if (start != null) {
          ++start.column;
          end = this.findClosingBracket(start);
          if (end != null) {
            selection.setBufferRange(mergeRanges(selection.getBufferRange(), [start, end]));
          }
        }
        results.push(!selection.isEmpty());
      }
      return results;
    };

    return SelectInsideBrackets;

  })(TextObject);

  SelectAWord = (function(superClass) {
    extend(SelectAWord, superClass);

    function SelectAWord() {
      return SelectAWord.__super__.constructor.apply(this, arguments);
    }

    SelectAWord.prototype.select = function() {
      var char, endPoint, i, len, ref, results, selection;
      ref = this.editor.getSelections();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        selection = ref[i];
        if (selection.isEmpty()) {
          selection.selectRight();
        }
        selection.expandOverWord();
        while (true) {
          endPoint = selection.getBufferRange().end;
          char = this.editor.getTextInRange(Range.fromPointWithDelta(endPoint, 0, 1));
          if (!AllWhitespace.test(char)) {
            break;
          }
          selection.selectRight();
        }
        results.push(true);
      }
      return results;
    };

    return SelectAWord;

  })(TextObject);

  SelectAWholeWord = (function(superClass) {
    extend(SelectAWholeWord, superClass);

    function SelectAWholeWord() {
      return SelectAWholeWord.__super__.constructor.apply(this, arguments);
    }

    SelectAWholeWord.prototype.select = function() {
      var char, endPoint, i, len, range, ref, results, selection;
      ref = this.editor.getSelections();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        selection = ref[i];
        range = selection.cursor.getCurrentWordBufferRange({
          wordRegex: WholeWordRegex
        });
        selection.setBufferRange(mergeRanges(selection.getBufferRange(), range));
        while (true) {
          endPoint = selection.getBufferRange().end;
          char = this.editor.getTextInRange(Range.fromPointWithDelta(endPoint, 0, 1));
          if (!AllWhitespace.test(char)) {
            break;
          }
          selection.selectRight();
        }
        results.push(true);
      }
      return results;
    };

    return SelectAWholeWord;

  })(TextObject);

  Paragraph = (function(superClass) {
    extend(Paragraph, superClass);

    function Paragraph() {
      return Paragraph.__super__.constructor.apply(this, arguments);
    }

    Paragraph.prototype.select = function() {
      var i, len, ref, results, selection;
      ref = this.editor.getSelections();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        selection = ref[i];
        results.push(this.selectParagraph(selection));
      }
      return results;
    };

    Paragraph.prototype.paragraphDelimitedRange = function(startPoint) {
      var inParagraph, lowerRow, upperRow;
      inParagraph = this.isParagraphLine(this.editor.lineTextForBufferRow(startPoint.row));
      upperRow = this.searchLines(startPoint.row, -1, inParagraph);
      lowerRow = this.searchLines(startPoint.row, this.editor.getLineCount(), inParagraph);
      return new Range([upperRow + 1, 0], [lowerRow, 0]);
    };

    Paragraph.prototype.searchLines = function(startRow, rowLimit, startedInParagraph) {
      var currentRow, i, line, ref, ref1;
      for (currentRow = i = ref = startRow, ref1 = rowLimit; ref <= ref1 ? i <= ref1 : i >= ref1; currentRow = ref <= ref1 ? ++i : --i) {
        line = this.editor.lineTextForBufferRow(currentRow);
        if (startedInParagraph !== this.isParagraphLine(line)) {
          return currentRow;
        }
      }
      return rowLimit;
    };

    Paragraph.prototype.isParagraphLine = function(line) {
      return /\S/.test(line);
    };

    return Paragraph;

  })(TextObject);

  SelectInsideParagraph = (function(superClass) {
    extend(SelectInsideParagraph, superClass);

    function SelectInsideParagraph() {
      return SelectInsideParagraph.__super__.constructor.apply(this, arguments);
    }

    SelectInsideParagraph.prototype.selectParagraph = function(selection) {
      var newRange, oldRange, startPoint;
      oldRange = selection.getBufferRange();
      startPoint = selection.cursor.getBufferPosition();
      newRange = this.paragraphDelimitedRange(startPoint);
      selection.setBufferRange(mergeRanges(oldRange, newRange));
      return true;
    };

    return SelectInsideParagraph;

  })(Paragraph);

  SelectAParagraph = (function(superClass) {
    extend(SelectAParagraph, superClass);

    function SelectAParagraph() {
      return SelectAParagraph.__super__.constructor.apply(this, arguments);
    }

    SelectAParagraph.prototype.selectParagraph = function(selection) {
      var newRange, nextRange, oldRange, startPoint;
      oldRange = selection.getBufferRange();
      startPoint = selection.cursor.getBufferPosition();
      newRange = this.paragraphDelimitedRange(startPoint);
      nextRange = this.paragraphDelimitedRange(newRange.end);
      selection.setBufferRange(mergeRanges(oldRange, [newRange.start, nextRange.end]));
      return true;
    };

    return SelectAParagraph;

  })(Paragraph);

  module.exports = {
    TextObject: TextObject,
    SelectInsideWord: SelectInsideWord,
    SelectInsideWholeWord: SelectInsideWholeWord,
    SelectInsideQuotes: SelectInsideQuotes,
    SelectInsideBrackets: SelectInsideBrackets,
    SelectAWord: SelectAWord,
    SelectAWholeWord: SelectAWholeWord,
    SelectInsideParagraph: SelectInsideParagraph,
    SelectAParagraph: SelectAParagraph
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi90ZXh0LW9iamVjdHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxtT0FBQTtJQUFBOzs7RUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSOztFQUNWLGFBQUEsR0FBZ0I7O0VBQ2hCLGNBQUEsR0FBaUI7O0VBQ2hCLGNBQWUsT0FBQSxDQUFRLFNBQVI7O0VBRVY7SUFDUyxvQkFBQyxNQUFELEVBQVUsS0FBVjtNQUFDLElBQUMsQ0FBQSxTQUFEO01BQVMsSUFBQyxDQUFBLFFBQUQ7SUFBVjs7eUJBRWIsVUFBQSxHQUFZLFNBQUE7YUFBRztJQUFIOzt5QkFDWixZQUFBLEdBQWMsU0FBQTthQUFHO0lBQUg7O3lCQUVkLE9BQUEsR0FBUyxTQUFBO2FBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLENBQWMsSUFBZCxFQUFvQixTQUFwQjtJQUFIOzs7Ozs7RUFFTDs7Ozs7OzsrQkFDSixNQUFBLEdBQVEsU0FBQTtBQUNOLFVBQUE7QUFBQTtBQUFBLFdBQUEscUNBQUE7O1FBQ0UsSUFBRyxTQUFTLENBQUMsT0FBVixDQUFBLENBQUg7VUFDRSxTQUFTLENBQUMsV0FBVixDQUFBLEVBREY7O1FBRUEsU0FBUyxDQUFDLGNBQVYsQ0FBQTtBQUhGO2FBSUEsQ0FBQyxJQUFEO0lBTE07Ozs7S0FEcUI7O0VBUXpCOzs7Ozs7O29DQUNKLE1BQUEsR0FBUSxTQUFBO0FBQ04sVUFBQTtBQUFBO0FBQUE7V0FBQSxxQ0FBQTs7UUFDRSxLQUFBLEdBQVEsU0FBUyxDQUFDLE1BQU0sQ0FBQyx5QkFBakIsQ0FBMkM7VUFBQyxTQUFBLEVBQVcsY0FBWjtTQUEzQztRQUNSLFNBQVMsQ0FBQyxjQUFWLENBQXlCLFdBQUEsQ0FBWSxTQUFTLENBQUMsY0FBVixDQUFBLENBQVosRUFBd0MsS0FBeEMsQ0FBekI7cUJBQ0E7QUFIRjs7SUFE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QTtNQUNiLFFBQUEsR0FBVyxJQUFDLENBQUEsdUJBQUQsQ0FBeUIsVUFBekI7TUFDWCxTQUFBLEdBQVksSUFBQyxDQUFBLHVCQUFELENBQXlCLFFBQVEsQ0FBQyxHQUFsQztNQUNaLFNBQVMsQ0FBQyxjQUFWLENBQXlCLFdBQUEsQ0FBWSxRQUFaLEVBQXNCLENBQUMsUUFBUSxDQUFDLEtBQVYsRUFBaUIsU0FBUyxDQUFDLEdBQTNCLENBQXRCLENBQXpCO2FBQ0E7SUFOZTs7OztLQURZOztFQVMvQixNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUFDLFlBQUEsVUFBRDtJQUFhLGtCQUFBLGdCQUFiO0lBQStCLHVCQUFBLHFCQUEvQjtJQUFzRCxvQkFBQSxrQkFBdEQ7SUFDZixzQkFBQSxvQkFEZTtJQUNPLGFBQUEsV0FEUDtJQUNvQixrQkFBQSxnQkFEcEI7SUFDc0MsdUJBQUEscUJBRHRDO0lBQzZELGtCQUFBLGdCQUQ3RDs7QUFqTmpCIiwic291cmNlc0NvbnRlbnQiOlsie1JhbmdlfSA9IHJlcXVpcmUgJ2F0b20nXG5BbGxXaGl0ZXNwYWNlID0gL15cXHMkL1xuV2hvbGVXb3JkUmVnZXggPSAvXFxTKy9cbnttZXJnZVJhbmdlc30gPSByZXF1aXJlICcuL3V0aWxzJ1xuXG5jbGFzcyBUZXh0T2JqZWN0XG4gIGNvbnN0cnVjdG9yOiAoQGVkaXRvciwgQHN0YXRlKSAtPlxuXG4gIGlzQ29tcGxldGU6IC0+IHRydWVcbiAgaXNSZWNvcmRhYmxlOiAtPiBmYWxzZVxuXG4gIGV4ZWN1dGU6IC0+IEBzZWxlY3QuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuXG5jbGFzcyBTZWxlY3RJbnNpZGVXb3JkIGV4dGVuZHMgVGV4dE9iamVjdFxuICBzZWxlY3Q6IC0+XG4gICAgZm9yIHNlbGVjdGlvbiBpbiBAZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICAgICAgaWYgc2VsZWN0aW9uLmlzRW1wdHkoKVxuICAgICAgICBzZWxlY3Rpb24uc2VsZWN0UmlnaHQoKVxuICAgICAgc2VsZWN0aW9uLmV4cGFuZE92ZXJXb3JkKClcbiAgICBbdHJ1ZV1cblxuY2xhc3MgU2VsZWN0SW5zaWRlV2hvbGVXb3JkIGV4dGVuZHMgVGV4dE9iamVjdFxuICBzZWxlY3Q6IC0+XG4gICAgZm9yIHNlbGVjdGlvbiBpbiBAZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICAgICAgcmFuZ2UgPSBzZWxlY3Rpb24uY3Vyc29yLmdldEN1cnJlbnRXb3JkQnVmZmVyUmFuZ2Uoe3dvcmRSZWdleDogV2hvbGVXb3JkUmVnZXh9KVxuICAgICAgc2VsZWN0aW9uLnNldEJ1ZmZlclJhbmdlKG1lcmdlUmFuZ2VzKHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpLCByYW5nZSkpXG4gICAgICB0cnVlXG5cbiMgU2VsZWN0SW5zaWRlUXVvdGVzIGFuZCB0aGUgbmV4dCBjbGFzcyBkZWZpbmVkIChTZWxlY3RJbnNpZGVCcmFja2V0cykgYXJlXG4jIGFsbW9zdC1idXQtbm90LXF1aXRlLXJlcGVhdGVkIGNvZGUuIFRoZXkgYXJlIGRpZmZlcmVudCBiZWNhdXNlIG9mIHRoZSBkZXB0aFxuIyBjaGVja3MgaW4gdGhlIGJyYWNrZXQgbWF0Y2hlci5cblxuY2xhc3MgU2VsZWN0SW5zaWRlUXVvdGVzIGV4dGVuZHMgVGV4dE9iamVjdFxuICBjb25zdHJ1Y3RvcjogKEBlZGl0b3IsIEBjaGFyLCBAaW5jbHVkZVF1b3RlcykgLT5cblxuICBmaW5kT3BlbmluZ1F1b3RlOiAocG9zKSAtPlxuICAgIHN0YXJ0ID0gcG9zLmNvcHkoKVxuICAgIHBvcyA9IHBvcy5jb3B5KClcbiAgICB3aGlsZSBwb3Mucm93ID49IDBcbiAgICAgIGxpbmUgPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHBvcy5yb3cpXG4gICAgICBwb3MuY29sdW1uID0gbGluZS5sZW5ndGggLSAxIGlmIHBvcy5jb2x1bW4gaXMgLTFcbiAgICAgIHdoaWxlIHBvcy5jb2x1bW4gPj0gMFxuICAgICAgICBpZiBsaW5lW3Bvcy5jb2x1bW5dIGlzIEBjaGFyXG4gICAgICAgICAgaWYgcG9zLmNvbHVtbiBpcyAwIG9yIGxpbmVbcG9zLmNvbHVtbiAtIDFdIGlzbnQgJ1xcXFwnXG4gICAgICAgICAgICBpZiBAaXNTdGFydFF1b3RlKHBvcylcbiAgICAgICAgICAgICAgcmV0dXJuIHBvc1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICByZXR1cm4gQGxvb2tGb3J3YXJkT25MaW5lKHN0YXJ0KVxuICAgICAgICAtLSBwb3MuY29sdW1uXG4gICAgICBwb3MuY29sdW1uID0gLTFcbiAgICAgIC0tIHBvcy5yb3dcbiAgICBAbG9va0ZvcndhcmRPbkxpbmUoc3RhcnQpXG5cbiAgaXNTdGFydFF1b3RlOiAoZW5kKSAtPlxuICAgIGxpbmUgPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGVuZC5yb3cpXG4gICAgbnVtUXVvdGVzID0gbGluZS5zdWJzdHJpbmcoMCwgZW5kLmNvbHVtbiArIDEpLnJlcGxhY2UoIFwiJyN7QGNoYXJ9XCIsICcnKS5zcGxpdChAY2hhcikubGVuZ3RoIC0gMVxuICAgIG51bVF1b3RlcyAlIDJcblxuICBsb29rRm9yd2FyZE9uTGluZTogKHBvcykgLT5cbiAgICBsaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhwb3Mucm93KVxuXG4gICAgaW5kZXggPSBsaW5lLnN1YnN0cmluZyhwb3MuY29sdW1uKS5pbmRleE9mKEBjaGFyKVxuICAgIGlmIGluZGV4ID49IDBcbiAgICAgIHBvcy5jb2x1bW4gKz0gaW5kZXhcbiAgICAgIHJldHVybiBwb3NcbiAgICBudWxsXG5cbiAgZmluZENsb3NpbmdRdW90ZTogKHN0YXJ0KSAtPlxuICAgIGVuZCA9IHN0YXJ0LmNvcHkoKVxuICAgIGVzY2FwaW5nID0gZmFsc2VcblxuICAgIHdoaWxlIGVuZC5yb3cgPCBAZWRpdG9yLmdldExpbmVDb3VudCgpXG4gICAgICBlbmRMaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhlbmQucm93KVxuICAgICAgd2hpbGUgZW5kLmNvbHVtbiA8IGVuZExpbmUubGVuZ3RoXG4gICAgICAgIGlmIGVuZExpbmVbZW5kLmNvbHVtbl0gaXMgJ1xcXFwnXG4gICAgICAgICAgKysgZW5kLmNvbHVtblxuICAgICAgICBlbHNlIGlmIGVuZExpbmVbZW5kLmNvbHVtbl0gaXMgQGNoYXJcbiAgICAgICAgICAtLSBzdGFydC5jb2x1bW4gaWYgQGluY2x1ZGVRdW90ZXNcbiAgICAgICAgICArKyBlbmQuY29sdW1uIGlmIEBpbmNsdWRlUXVvdGVzXG4gICAgICAgICAgcmV0dXJuIGVuZFxuICAgICAgICArKyBlbmQuY29sdW1uXG4gICAgICBlbmQuY29sdW1uID0gMFxuICAgICAgKysgZW5kLnJvd1xuICAgIHJldHVyblxuXG4gIHNlbGVjdDogLT5cbiAgICBmb3Igc2VsZWN0aW9uIGluIEBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gICAgICBzdGFydCA9IEBmaW5kT3BlbmluZ1F1b3RlKHNlbGVjdGlvbi5jdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKSlcbiAgICAgIGlmIHN0YXJ0P1xuICAgICAgICArKyBzdGFydC5jb2x1bW4gIyBza2lwIHRoZSBvcGVuaW5nIHF1b3RlXG4gICAgICAgIGVuZCA9IEBmaW5kQ2xvc2luZ1F1b3RlKHN0YXJ0KVxuICAgICAgICBpZiBlbmQ/XG4gICAgICAgICAgc2VsZWN0aW9uLnNldEJ1ZmZlclJhbmdlKG1lcmdlUmFuZ2VzKHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpLCBbc3RhcnQsIGVuZF0pKVxuICAgICAgbm90IHNlbGVjdGlvbi5pc0VtcHR5KClcblxuIyBTZWxlY3RJbnNpZGVCcmFja2V0cyBhbmQgdGhlIHByZXZpb3VzIGNsYXNzIGRlZmluZWQgKFNlbGVjdEluc2lkZVF1b3RlcykgYXJlXG4jIGFsbW9zdC1idXQtbm90LXF1aXRlLXJlcGVhdGVkIGNvZGUuIFRoZXkgYXJlIGRpZmZlcmVudCBiZWNhdXNlIG9mIHRoZSBkZXB0aFxuIyBjaGVja3MgaW4gdGhlIGJyYWNrZXQgbWF0Y2hlci5cblxuY2xhc3MgU2VsZWN0SW5zaWRlQnJhY2tldHMgZXh0ZW5kcyBUZXh0T2JqZWN0XG4gIGNvbnN0cnVjdG9yOiAoQGVkaXRvciwgQGJlZ2luQ2hhciwgQGVuZENoYXIsIEBpbmNsdWRlQnJhY2tldHMpIC0+XG5cbiAgZmluZE9wZW5pbmdCcmFja2V0OiAocG9zKSAtPlxuICAgIHBvcyA9IHBvcy5jb3B5KClcbiAgICBkZXB0aCA9IDBcbiAgICB3aGlsZSBwb3Mucm93ID49IDBcbiAgICAgIGxpbmUgPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHBvcy5yb3cpXG4gICAgICBwb3MuY29sdW1uID0gbGluZS5sZW5ndGggLSAxIGlmIHBvcy5jb2x1bW4gaXMgLTFcbiAgICAgIHdoaWxlIHBvcy5jb2x1bW4gPj0gMFxuICAgICAgICBzd2l0Y2ggbGluZVtwb3MuY29sdW1uXVxuICAgICAgICAgIHdoZW4gQGVuZENoYXIgdGhlbiArKyBkZXB0aFxuICAgICAgICAgIHdoZW4gQGJlZ2luQ2hhclxuICAgICAgICAgICAgcmV0dXJuIHBvcyBpZiAtLSBkZXB0aCA8IDBcbiAgICAgICAgLS0gcG9zLmNvbHVtblxuICAgICAgcG9zLmNvbHVtbiA9IC0xXG4gICAgICAtLSBwb3Mucm93XG5cbiAgZmluZENsb3NpbmdCcmFja2V0OiAoc3RhcnQpIC0+XG4gICAgZW5kID0gc3RhcnQuY29weSgpXG4gICAgZGVwdGggPSAwXG4gICAgd2hpbGUgZW5kLnJvdyA8IEBlZGl0b3IuZ2V0TGluZUNvdW50KClcbiAgICAgIGVuZExpbmUgPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGVuZC5yb3cpXG4gICAgICB3aGlsZSBlbmQuY29sdW1uIDwgZW5kTGluZS5sZW5ndGhcbiAgICAgICAgc3dpdGNoIGVuZExpbmVbZW5kLmNvbHVtbl1cbiAgICAgICAgICB3aGVuIEBiZWdpbkNoYXIgdGhlbiArKyBkZXB0aFxuICAgICAgICAgIHdoZW4gQGVuZENoYXJcbiAgICAgICAgICAgIGlmIC0tIGRlcHRoIDwgMFxuICAgICAgICAgICAgICAtLSBzdGFydC5jb2x1bW4gaWYgQGluY2x1ZGVCcmFja2V0c1xuICAgICAgICAgICAgICArKyBlbmQuY29sdW1uIGlmIEBpbmNsdWRlQnJhY2tldHNcbiAgICAgICAgICAgICAgcmV0dXJuIGVuZFxuICAgICAgICArKyBlbmQuY29sdW1uXG4gICAgICBlbmQuY29sdW1uID0gMFxuICAgICAgKysgZW5kLnJvd1xuICAgIHJldHVyblxuXG4gIHNlbGVjdDogLT5cbiAgICBmb3Igc2VsZWN0aW9uIGluIEBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gICAgICBzdGFydCA9IEBmaW5kT3BlbmluZ0JyYWNrZXQoc2VsZWN0aW9uLmN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpKVxuICAgICAgaWYgc3RhcnQ/XG4gICAgICAgICsrIHN0YXJ0LmNvbHVtbiAjIHNraXAgdGhlIG9wZW5pbmcgcXVvdGVcbiAgICAgICAgZW5kID0gQGZpbmRDbG9zaW5nQnJhY2tldChzdGFydClcbiAgICAgICAgaWYgZW5kP1xuICAgICAgICAgIHNlbGVjdGlvbi5zZXRCdWZmZXJSYW5nZShtZXJnZVJhbmdlcyhzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKSwgW3N0YXJ0LCBlbmRdKSlcbiAgICAgIG5vdCBzZWxlY3Rpb24uaXNFbXB0eSgpXG5cbmNsYXNzIFNlbGVjdEFXb3JkIGV4dGVuZHMgVGV4dE9iamVjdFxuICBzZWxlY3Q6IC0+XG4gICAgZm9yIHNlbGVjdGlvbiBpbiBAZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICAgICAgaWYgc2VsZWN0aW9uLmlzRW1wdHkoKVxuICAgICAgICBzZWxlY3Rpb24uc2VsZWN0UmlnaHQoKVxuICAgICAgc2VsZWN0aW9uLmV4cGFuZE92ZXJXb3JkKClcbiAgICAgIGxvb3BcbiAgICAgICAgZW5kUG9pbnQgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKS5lbmRcbiAgICAgICAgY2hhciA9IEBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoUmFuZ2UuZnJvbVBvaW50V2l0aERlbHRhKGVuZFBvaW50LCAwLCAxKSlcbiAgICAgICAgYnJlYWsgdW5sZXNzIEFsbFdoaXRlc3BhY2UudGVzdChjaGFyKVxuICAgICAgICBzZWxlY3Rpb24uc2VsZWN0UmlnaHQoKVxuICAgICAgdHJ1ZVxuXG5jbGFzcyBTZWxlY3RBV2hvbGVXb3JkIGV4dGVuZHMgVGV4dE9iamVjdFxuICBzZWxlY3Q6IC0+XG4gICAgZm9yIHNlbGVjdGlvbiBpbiBAZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICAgICAgcmFuZ2UgPSBzZWxlY3Rpb24uY3Vyc29yLmdldEN1cnJlbnRXb3JkQnVmZmVyUmFuZ2Uoe3dvcmRSZWdleDogV2hvbGVXb3JkUmVnZXh9KVxuICAgICAgc2VsZWN0aW9uLnNldEJ1ZmZlclJhbmdlKG1lcmdlUmFuZ2VzKHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpLCByYW5nZSkpXG4gICAgICBsb29wXG4gICAgICAgIGVuZFBvaW50ID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCkuZW5kXG4gICAgICAgIGNoYXIgPSBAZWRpdG9yLmdldFRleHRJblJhbmdlKFJhbmdlLmZyb21Qb2ludFdpdGhEZWx0YShlbmRQb2ludCwgMCwgMSkpXG4gICAgICAgIGJyZWFrIHVubGVzcyBBbGxXaGl0ZXNwYWNlLnRlc3QoY2hhcilcbiAgICAgICAgc2VsZWN0aW9uLnNlbGVjdFJpZ2h0KClcbiAgICAgIHRydWVcblxuY2xhc3MgUGFyYWdyYXBoIGV4dGVuZHMgVGV4dE9iamVjdFxuXG4gIHNlbGVjdDogLT5cbiAgICBmb3Igc2VsZWN0aW9uIGluIEBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gICAgICBAc2VsZWN0UGFyYWdyYXBoKHNlbGVjdGlvbilcblxuICAjIFJldHVybiBhIHJhbmdlIGRlbGltdGVkIGJ5IHRoZSBzdGFydCBvciB0aGUgZW5kIG9mIGEgcGFyYWdyYXBoXG4gIHBhcmFncmFwaERlbGltaXRlZFJhbmdlOiAoc3RhcnRQb2ludCkgLT5cbiAgICBpblBhcmFncmFwaCA9IEBpc1BhcmFncmFwaExpbmUoQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhzdGFydFBvaW50LnJvdykpXG4gICAgdXBwZXJSb3cgPSBAc2VhcmNoTGluZXMoc3RhcnRQb2ludC5yb3csIC0xLCBpblBhcmFncmFwaClcbiAgICBsb3dlclJvdyA9IEBzZWFyY2hMaW5lcyhzdGFydFBvaW50LnJvdywgQGVkaXRvci5nZXRMaW5lQ291bnQoKSwgaW5QYXJhZ3JhcGgpXG4gICAgbmV3IFJhbmdlKFt1cHBlclJvdyArIDEsIDBdLCBbbG93ZXJSb3csIDBdKVxuXG4gIHNlYXJjaExpbmVzOiAoc3RhcnRSb3csIHJvd0xpbWl0LCBzdGFydGVkSW5QYXJhZ3JhcGgpIC0+XG4gICAgZm9yIGN1cnJlbnRSb3cgaW4gW3N0YXJ0Um93Li5yb3dMaW1pdF1cbiAgICAgIGxpbmUgPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGN1cnJlbnRSb3cpXG4gICAgICBpZiBzdGFydGVkSW5QYXJhZ3JhcGggaXNudCBAaXNQYXJhZ3JhcGhMaW5lKGxpbmUpXG4gICAgICAgIHJldHVybiBjdXJyZW50Um93XG4gICAgcm93TGltaXRcblxuICBpc1BhcmFncmFwaExpbmU6IChsaW5lKSAtPiAoL1xcUy8udGVzdChsaW5lKSlcblxuY2xhc3MgU2VsZWN0SW5zaWRlUGFyYWdyYXBoIGV4dGVuZHMgUGFyYWdyYXBoXG4gIHNlbGVjdFBhcmFncmFwaDogKHNlbGVjdGlvbikgLT5cbiAgICBvbGRSYW5nZSA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG4gICAgc3RhcnRQb2ludCA9IHNlbGVjdGlvbi5jdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgIG5ld1JhbmdlID0gQHBhcmFncmFwaERlbGltaXRlZFJhbmdlKHN0YXJ0UG9pbnQpXG4gICAgc2VsZWN0aW9uLnNldEJ1ZmZlclJhbmdlKG1lcmdlUmFuZ2VzKG9sZFJhbmdlLCBuZXdSYW5nZSkpXG4gICAgdHJ1ZVxuXG5jbGFzcyBTZWxlY3RBUGFyYWdyYXBoIGV4dGVuZHMgUGFyYWdyYXBoXG4gIHNlbGVjdFBhcmFncmFwaDogKHNlbGVjdGlvbikgLT5cbiAgICBvbGRSYW5nZSA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG4gICAgc3RhcnRQb2ludCA9IHNlbGVjdGlvbi5jdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgIG5ld1JhbmdlID0gQHBhcmFncmFwaERlbGltaXRlZFJhbmdlKHN0YXJ0UG9pbnQpXG4gICAgbmV4dFJhbmdlID0gQHBhcmFncmFwaERlbGltaXRlZFJhbmdlKG5ld1JhbmdlLmVuZClcbiAgICBzZWxlY3Rpb24uc2V0QnVmZmVyUmFuZ2UobWVyZ2VSYW5nZXMob2xkUmFuZ2UsIFtuZXdSYW5nZS5zdGFydCwgbmV4dFJhbmdlLmVuZF0pKVxuICAgIHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSB7VGV4dE9iamVjdCwgU2VsZWN0SW5zaWRlV29yZCwgU2VsZWN0SW5zaWRlV2hvbGVXb3JkLCBTZWxlY3RJbnNpZGVRdW90ZXMsXG4gIFNlbGVjdEluc2lkZUJyYWNrZXRzLCBTZWxlY3RBV29yZCwgU2VsZWN0QVdob2xlV29yZCwgU2VsZWN0SW5zaWRlUGFyYWdyYXBoLCBTZWxlY3RBUGFyYWdyYXBofVxuIl19
