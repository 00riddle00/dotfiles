(function() {
  var AllWhitespace, CurrentSelection, Motion, MotionError, MotionWithInput, MoveDown, MoveLeft, MoveRight, MoveToAbsoluteLine, MoveToBeginningOfLine, MoveToBottomOfScreen, MoveToEndOfWholeWord, MoveToEndOfWord, MoveToFirstCharacterOfLine, MoveToFirstCharacterOfLineAndDown, MoveToFirstCharacterOfLineDown, MoveToFirstCharacterOfLineUp, MoveToLastCharacterOfLine, MoveToLastNonblankCharacterOfLineAndDown, MoveToLine, MoveToMiddleOfScreen, MoveToNextParagraph, MoveToNextSentence, MoveToNextWholeWord, MoveToNextWord, MoveToPreviousParagraph, MoveToPreviousSentence, MoveToPreviousWholeWord, MoveToPreviousWord, MoveToRelativeLine, MoveToScreenLine, MoveToStartOfFile, MoveToTopOfScreen, MoveUp, Point, Range, ScrollFullDownKeepCursor, ScrollFullUpKeepCursor, ScrollHalfDownKeepCursor, ScrollHalfUpKeepCursor, ScrollKeepingCursor, WholeWordOrEmptyLineRegex, WholeWordRegex, _, ref, settings,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require('underscore-plus');

  ref = require('atom'), Point = ref.Point, Range = ref.Range;

  settings = require('../settings');

  WholeWordRegex = /\S+/;

  WholeWordOrEmptyLineRegex = /^\s*$|\S+/;

  AllWhitespace = /^\s$/;

  MotionError = (function() {
    function MotionError(message) {
      this.message = message;
      this.name = 'Motion Error';
    }

    return MotionError;

  })();

  Motion = (function() {
    Motion.prototype.operatesInclusively = false;

    Motion.prototype.operatesLinewise = false;

    function Motion(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
    }

    Motion.prototype.select = function(count, options) {
      var selection, value;
      value = (function() {
        var i, len, ref1, results;
        ref1 = this.editor.getSelections();
        results = [];
        for (i = 0, len = ref1.length; i < len; i++) {
          selection = ref1[i];
          if (this.isLinewise()) {
            this.moveSelectionLinewise(selection, count, options);
          } else if (this.vimState.mode === 'visual') {
            this.moveSelectionVisual(selection, count, options);
          } else if (this.operatesInclusively) {
            this.moveSelectionInclusively(selection, count, options);
          } else {
            this.moveSelection(selection, count, options);
          }
          results.push(!selection.isEmpty());
        }
        return results;
      }).call(this);
      this.editor.mergeCursors();
      this.editor.mergeIntersectingSelections();
      return value;
    };

    Motion.prototype.execute = function(count) {
      var cursor, i, len, ref1;
      ref1 = this.editor.getCursors();
      for (i = 0, len = ref1.length; i < len; i++) {
        cursor = ref1[i];
        this.moveCursor(cursor, count);
      }
      return this.editor.mergeCursors();
    };

    Motion.prototype.moveSelectionLinewise = function(selection, count, options) {
      return selection.modifySelection((function(_this) {
        return function() {
          var isEmpty, isReversed, newEndRow, newStartRow, oldEndRow, oldStartRow, ref1, ref2, wasEmpty, wasReversed;
          ref1 = selection.getBufferRowRange(), oldStartRow = ref1[0], oldEndRow = ref1[1];
          wasEmpty = selection.isEmpty();
          wasReversed = selection.isReversed();
          if (!(wasEmpty || wasReversed)) {
            selection.cursor.moveLeft();
          }
          _this.moveCursor(selection.cursor, count, options);
          isEmpty = selection.isEmpty();
          isReversed = selection.isReversed();
          if (!(isEmpty || isReversed)) {
            selection.cursor.moveRight();
          }
          ref2 = selection.getBufferRowRange(), newStartRow = ref2[0], newEndRow = ref2[1];
          if (isReversed && !wasReversed) {
            newEndRow = Math.max(newEndRow, oldStartRow);
          }
          if (wasReversed && !isReversed) {
            newStartRow = Math.min(newStartRow, oldEndRow);
          }
          return selection.setBufferRange([[newStartRow, 0], [newEndRow + 1, 0]], {
            autoscroll: false
          });
        };
      })(this));
    };

    Motion.prototype.moveSelectionInclusively = function(selection, count, options) {
      if (!selection.isEmpty()) {
        return this.moveSelectionVisual(selection, count, options);
      }
      return selection.modifySelection((function(_this) {
        return function() {
          var end, ref1, start;
          _this.moveCursor(selection.cursor, count, options);
          if (selection.isEmpty()) {
            return;
          }
          if (selection.isReversed()) {
            ref1 = selection.getBufferRange(), start = ref1.start, end = ref1.end;
            return selection.setBufferRange([start, [end.row, end.column + 1]]);
          } else {
            return selection.cursor.moveRight();
          }
        };
      })(this));
    };

    Motion.prototype.moveSelectionVisual = function(selection, count, options) {
      return selection.modifySelection((function(_this) {
        return function() {
          var isEmpty, isReversed, newEnd, newStart, oldEnd, oldStart, range, ref1, ref2, ref3, wasEmpty, wasReversed;
          range = selection.getBufferRange();
          ref1 = [range.start, range.end], oldStart = ref1[0], oldEnd = ref1[1];
          wasEmpty = selection.isEmpty();
          wasReversed = selection.isReversed();
          if (!(wasEmpty || wasReversed)) {
            selection.cursor.moveLeft();
          }
          _this.moveCursor(selection.cursor, count, options);
          isEmpty = selection.isEmpty();
          isReversed = selection.isReversed();
          if (!(isEmpty || isReversed)) {
            selection.cursor.moveRight();
          }
          range = selection.getBufferRange();
          ref2 = [range.start, range.end], newStart = ref2[0], newEnd = ref2[1];
          if ((isReversed || isEmpty) && !(wasReversed || wasEmpty)) {
            selection.setBufferRange([newStart, [newEnd.row, oldStart.column + 1]]);
          }
          if (wasReversed && !wasEmpty && !isReversed) {
            selection.setBufferRange([[oldEnd.row, oldEnd.column - 1], newEnd]);
          }
          range = selection.getBufferRange();
          ref3 = [range.start, range.end], newStart = ref3[0], newEnd = ref3[1];
          if (selection.isReversed() && newStart.row === newEnd.row && newStart.column + 1 === newEnd.column) {
            return selection.setBufferRange(range, {
              reversed: false
            });
          }
        };
      })(this));
    };

    Motion.prototype.moveSelection = function(selection, count, options) {
      return selection.modifySelection((function(_this) {
        return function() {
          return _this.moveCursor(selection.cursor, count, options);
        };
      })(this));
    };

    Motion.prototype.isComplete = function() {
      return true;
    };

    Motion.prototype.isRecordable = function() {
      return false;
    };

    Motion.prototype.isLinewise = function() {
      var ref1, ref2;
      if (((ref1 = this.vimState) != null ? ref1.mode : void 0) === 'visual') {
        return ((ref2 = this.vimState) != null ? ref2.submode : void 0) === 'linewise';
      } else {
        return this.operatesLinewise;
      }
    };

    return Motion;

  })();

  CurrentSelection = (function(superClass) {
    extend(CurrentSelection, superClass);

    function CurrentSelection(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      CurrentSelection.__super__.constructor.call(this, this.editor, this.vimState);
      this.lastSelectionRange = this.editor.getSelectedBufferRange();
      this.wasLinewise = this.isLinewise();
    }

    CurrentSelection.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        return true;
      });
    };

    CurrentSelection.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      if (this.vimState.mode !== 'visual') {
        if (this.wasLinewise) {
          this.selectLines();
        } else {
          this.selectCharacters();
        }
      }
      return _.times(count, function() {
        return true;
      });
    };

    CurrentSelection.prototype.selectLines = function() {
      var cursor, i, lastSelectionExtent, len, ref1, selection;
      lastSelectionExtent = this.lastSelectionRange.getExtent();
      ref1 = this.editor.getSelections();
      for (i = 0, len = ref1.length; i < len; i++) {
        selection = ref1[i];
        cursor = selection.cursor.getBufferPosition();
        selection.setBufferRange([[cursor.row, 0], [cursor.row + lastSelectionExtent.row, 0]]);
      }
    };

    CurrentSelection.prototype.selectCharacters = function() {
      var i, lastSelectionExtent, len, newEnd, ref1, selection, start;
      lastSelectionExtent = this.lastSelectionRange.getExtent();
      ref1 = this.editor.getSelections();
      for (i = 0, len = ref1.length; i < len; i++) {
        selection = ref1[i];
        start = selection.getBufferRange().start;
        newEnd = start.traverse(lastSelectionExtent);
        selection.setBufferRange([start, newEnd]);
      }
    };

    return CurrentSelection;

  })(Motion);

  MotionWithInput = (function(superClass) {
    extend(MotionWithInput, superClass);

    function MotionWithInput(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      MotionWithInput.__super__.constructor.call(this, this.editor, this.vimState);
      this.complete = false;
    }

    MotionWithInput.prototype.isComplete = function() {
      return this.complete;
    };

    MotionWithInput.prototype.canComposeWith = function(operation) {
      return operation.characters != null;
    };

    MotionWithInput.prototype.compose = function(input) {
      if (!input.characters) {
        throw new MotionError('Must compose with an Input');
      }
      this.input = input;
      return this.complete = true;
    };

    return MotionWithInput;

  })(Motion);

  MoveLeft = (function(superClass) {
    extend(MoveLeft, superClass);

    function MoveLeft() {
      return MoveLeft.__super__.constructor.apply(this, arguments);
    }

    MoveLeft.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        if (!cursor.isAtBeginningOfLine() || settings.wrapLeftRightMotion()) {
          return cursor.moveLeft();
        }
      });
    };

    return MoveLeft;

  })(Motion);

  MoveRight = (function(superClass) {
    extend(MoveRight, superClass);

    function MoveRight() {
      return MoveRight.__super__.constructor.apply(this, arguments);
    }

    MoveRight.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var wrapToNextLine;
          wrapToNextLine = settings.wrapLeftRightMotion();
          if (_this.vimState.mode === 'operator-pending' && !cursor.isAtEndOfLine()) {
            wrapToNextLine = false;
          }
          if (!cursor.isAtEndOfLine()) {
            cursor.moveRight();
          }
          if (wrapToNextLine && cursor.isAtEndOfLine()) {
            return cursor.moveRight();
          }
        };
      })(this));
    };

    return MoveRight;

  })(Motion);

  MoveUp = (function(superClass) {
    extend(MoveUp, superClass);

    function MoveUp() {
      return MoveUp.__super__.constructor.apply(this, arguments);
    }

    MoveUp.prototype.operatesLinewise = true;

    MoveUp.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        if (cursor.getScreenRow() !== 0) {
          return cursor.moveUp();
        }
      });
    };

    return MoveUp;

  })(Motion);

  MoveDown = (function(superClass) {
    extend(MoveDown, superClass);

    function MoveDown() {
      return MoveDown.__super__.constructor.apply(this, arguments);
    }

    MoveDown.prototype.operatesLinewise = true;

    MoveDown.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          if (cursor.getScreenRow() !== _this.editor.getLastScreenRow()) {
            return cursor.moveDown();
          }
        };
      })(this));
    };

    return MoveDown;

  })(Motion);

  MoveToPreviousWord = (function(superClass) {
    extend(MoveToPreviousWord, superClass);

    function MoveToPreviousWord() {
      return MoveToPreviousWord.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousWord.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        return cursor.moveToBeginningOfWord();
      });
    };

    return MoveToPreviousWord;

  })(Motion);

  MoveToPreviousWholeWord = (function(superClass) {
    extend(MoveToPreviousWholeWord, superClass);

    function MoveToPreviousWholeWord() {
      return MoveToPreviousWholeWord.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousWholeWord.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var results;
          cursor.moveToBeginningOfWord();
          results = [];
          while (!_this.isWholeWord(cursor) && !_this.isBeginningOfFile(cursor)) {
            results.push(cursor.moveToBeginningOfWord());
          }
          return results;
        };
      })(this));
    };

    MoveToPreviousWholeWord.prototype.isWholeWord = function(cursor) {
      var char;
      char = cursor.getCurrentWordPrefix().slice(-1);
      return AllWhitespace.test(char);
    };

    MoveToPreviousWholeWord.prototype.isBeginningOfFile = function(cursor) {
      var cur;
      cur = cursor.getBufferPosition();
      return !cur.row && !cur.column;
    };

    return MoveToPreviousWholeWord;

  })(Motion);

  MoveToNextWord = (function(superClass) {
    extend(MoveToNextWord, superClass);

    function MoveToNextWord() {
      return MoveToNextWord.__super__.constructor.apply(this, arguments);
    }

    MoveToNextWord.prototype.wordRegex = null;

    MoveToNextWord.prototype.moveCursor = function(cursor, count, options) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var current, next;
          current = cursor.getBufferPosition();
          next = (options != null ? options.excludeWhitespace : void 0) ? cursor.getEndOfCurrentWordBufferPosition({
            wordRegex: _this.wordRegex
          }) : cursor.getBeginningOfNextWordBufferPosition({
            wordRegex: _this.wordRegex
          });
          if (_this.isEndOfFile(cursor)) {
            return;
          }
          if (cursor.isAtEndOfLine()) {
            cursor.moveDown();
            cursor.moveToBeginningOfLine();
            return cursor.skipLeadingWhitespace();
          } else if (current.row === next.row && current.column === next.column) {
            return cursor.moveToEndOfWord();
          } else {
            return cursor.setBufferPosition(next);
          }
        };
      })(this));
    };

    MoveToNextWord.prototype.isEndOfFile = function(cursor) {
      var cur, eof;
      cur = cursor.getBufferPosition();
      eof = this.editor.getEofBufferPosition();
      return cur.row === eof.row && cur.column === eof.column;
    };

    return MoveToNextWord;

  })(Motion);

  MoveToNextWholeWord = (function(superClass) {
    extend(MoveToNextWholeWord, superClass);

    function MoveToNextWholeWord() {
      return MoveToNextWholeWord.__super__.constructor.apply(this, arguments);
    }

    MoveToNextWholeWord.prototype.wordRegex = WholeWordOrEmptyLineRegex;

    return MoveToNextWholeWord;

  })(MoveToNextWord);

  MoveToEndOfWord = (function(superClass) {
    extend(MoveToEndOfWord, superClass);

    function MoveToEndOfWord() {
      return MoveToEndOfWord.__super__.constructor.apply(this, arguments);
    }

    MoveToEndOfWord.prototype.operatesInclusively = true;

    MoveToEndOfWord.prototype.wordRegex = null;

    MoveToEndOfWord.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var current, next;
          current = cursor.getBufferPosition();
          next = cursor.getEndOfCurrentWordBufferPosition({
            wordRegex: _this.wordRegex
          });
          if (next.column > 0) {
            next.column--;
          }
          if (next.isEqual(current)) {
            cursor.moveRight();
            if (cursor.isAtEndOfLine()) {
              cursor.moveDown();
              cursor.moveToBeginningOfLine();
            }
            next = cursor.getEndOfCurrentWordBufferPosition({
              wordRegex: _this.wordRegex
            });
            if (next.column > 0) {
              next.column--;
            }
          }
          return cursor.setBufferPosition(next);
        };
      })(this));
    };

    return MoveToEndOfWord;

  })(Motion);

  MoveToEndOfWholeWord = (function(superClass) {
    extend(MoveToEndOfWholeWord, superClass);

    function MoveToEndOfWholeWord() {
      return MoveToEndOfWholeWord.__super__.constructor.apply(this, arguments);
    }

    MoveToEndOfWholeWord.prototype.wordRegex = WholeWordRegex;

    return MoveToEndOfWholeWord;

  })(MoveToEndOfWord);

  MoveToNextSentence = (function(superClass) {
    extend(MoveToNextSentence, superClass);

    function MoveToNextSentence() {
      return MoveToNextSentence.__super__.constructor.apply(this, arguments);
    }

    MoveToNextSentence.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        var eof, scanRange, start;
        start = cursor.getBufferPosition().translate(new Point(0, 1));
        eof = cursor.editor.getBuffer().getEndPosition();
        scanRange = [start, eof];
        return cursor.editor.scanInBufferRange(/(^$)|(([\.!?] )|^[A-Za-z0-9])/, scanRange, function(arg) {
          var adjustment, matchText, range, stop;
          matchText = arg.matchText, range = arg.range, stop = arg.stop;
          adjustment = new Point(0, 0);
          if (matchText.match(/[\.!?]/)) {
            adjustment = new Point(0, 2);
          }
          cursor.setBufferPosition(range.start.translate(adjustment));
          return stop();
        });
      });
    };

    return MoveToNextSentence;

  })(Motion);

  MoveToPreviousSentence = (function(superClass) {
    extend(MoveToPreviousSentence, superClass);

    function MoveToPreviousSentence() {
      return MoveToPreviousSentence.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousSentence.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        var bof, end, scanRange;
        end = cursor.getBufferPosition().translate(new Point(0, -1));
        bof = cursor.editor.getBuffer().getFirstPosition();
        scanRange = [bof, end];
        return cursor.editor.backwardsScanInBufferRange(/(^$)|(([\.!?] )|^[A-Za-z0-9])/, scanRange, function(arg) {
          var adjustment, matchText, range, stop;
          matchText = arg.matchText, range = arg.range, stop = arg.stop;
          adjustment = new Point(0, 0);
          if (matchText.match(/[\.!?]/)) {
            adjustment = new Point(0, 2);
          }
          cursor.setBufferPosition(range.start.translate(adjustment));
          return stop();
        });
      });
    };

    return MoveToPreviousSentence;

  })(Motion);

  MoveToNextParagraph = (function(superClass) {
    extend(MoveToNextParagraph, superClass);

    function MoveToNextParagraph() {
      return MoveToNextParagraph.__super__.constructor.apply(this, arguments);
    }

    MoveToNextParagraph.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        return cursor.moveToBeginningOfNextParagraph();
      });
    };

    return MoveToNextParagraph;

  })(Motion);

  MoveToPreviousParagraph = (function(superClass) {
    extend(MoveToPreviousParagraph, superClass);

    function MoveToPreviousParagraph() {
      return MoveToPreviousParagraph.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousParagraph.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        return cursor.moveToBeginningOfPreviousParagraph();
      });
    };

    return MoveToPreviousParagraph;

  })(Motion);

  MoveToLine = (function(superClass) {
    extend(MoveToLine, superClass);

    function MoveToLine() {
      return MoveToLine.__super__.constructor.apply(this, arguments);
    }

    MoveToLine.prototype.operatesLinewise = true;

    MoveToLine.prototype.getDestinationRow = function(count) {
      if (count != null) {
        return count - 1;
      } else {
        return this.editor.getLineCount() - 1;
      }
    };

    return MoveToLine;

  })(Motion);

  MoveToAbsoluteLine = (function(superClass) {
    extend(MoveToAbsoluteLine, superClass);

    function MoveToAbsoluteLine() {
      return MoveToAbsoluteLine.__super__.constructor.apply(this, arguments);
    }

    MoveToAbsoluteLine.prototype.moveCursor = function(cursor, count) {
      cursor.setBufferPosition([this.getDestinationRow(count), 2e308]);
      cursor.moveToFirstCharacterOfLine();
      if (cursor.getBufferColumn() === 0) {
        return cursor.moveToEndOfLine();
      }
    };

    return MoveToAbsoluteLine;

  })(MoveToLine);

  MoveToRelativeLine = (function(superClass) {
    extend(MoveToRelativeLine, superClass);

    function MoveToRelativeLine() {
      return MoveToRelativeLine.__super__.constructor.apply(this, arguments);
    }

    MoveToRelativeLine.prototype.moveCursor = function(cursor, count) {
      var column, ref1, row;
      if (count == null) {
        count = 1;
      }
      ref1 = cursor.getBufferPosition(), row = ref1.row, column = ref1.column;
      return cursor.setBufferPosition([row + (count - 1), 0]);
    };

    return MoveToRelativeLine;

  })(MoveToLine);

  MoveToScreenLine = (function(superClass) {
    extend(MoveToScreenLine, superClass);

    function MoveToScreenLine(editorElement, vimState, scrolloff) {
      this.editorElement = editorElement;
      this.vimState = vimState;
      this.scrolloff = scrolloff;
      this.scrolloff = 2;
      MoveToScreenLine.__super__.constructor.call(this, this.editorElement.getModel(), this.vimState);
    }

    MoveToScreenLine.prototype.moveCursor = function(cursor, count) {
      var column, ref1, row;
      if (count == null) {
        count = 1;
      }
      ref1 = cursor.getBufferPosition(), row = ref1.row, column = ref1.column;
      return cursor.setScreenPosition([this.getDestinationRow(count), 0]);
    };

    return MoveToScreenLine;

  })(MoveToLine);

  MoveToBeginningOfLine = (function(superClass) {
    extend(MoveToBeginningOfLine, superClass);

    function MoveToBeginningOfLine() {
      return MoveToBeginningOfLine.__super__.constructor.apply(this, arguments);
    }

    MoveToBeginningOfLine.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        return cursor.moveToBeginningOfLine();
      });
    };

    return MoveToBeginningOfLine;

  })(Motion);

  MoveToFirstCharacterOfLine = (function(superClass) {
    extend(MoveToFirstCharacterOfLine, superClass);

    function MoveToFirstCharacterOfLine() {
      return MoveToFirstCharacterOfLine.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLine.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        cursor.moveToBeginningOfLine();
        return cursor.moveToFirstCharacterOfLine();
      });
    };

    return MoveToFirstCharacterOfLine;

  })(Motion);

  MoveToFirstCharacterOfLineAndDown = (function(superClass) {
    extend(MoveToFirstCharacterOfLineAndDown, superClass);

    function MoveToFirstCharacterOfLineAndDown() {
      return MoveToFirstCharacterOfLineAndDown.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLineAndDown.prototype.operatesLinewise = true;

    MoveToFirstCharacterOfLineAndDown.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      _.times(count - 1, function() {
        return cursor.moveDown();
      });
      cursor.moveToBeginningOfLine();
      return cursor.moveToFirstCharacterOfLine();
    };

    return MoveToFirstCharacterOfLineAndDown;

  })(Motion);

  MoveToLastCharacterOfLine = (function(superClass) {
    extend(MoveToLastCharacterOfLine, superClass);

    function MoveToLastCharacterOfLine() {
      return MoveToLastCharacterOfLine.__super__.constructor.apply(this, arguments);
    }

    MoveToLastCharacterOfLine.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        cursor.moveToEndOfLine();
        return cursor.goalColumn = 2e308;
      });
    };

    return MoveToLastCharacterOfLine;

  })(Motion);

  MoveToLastNonblankCharacterOfLineAndDown = (function(superClass) {
    extend(MoveToLastNonblankCharacterOfLineAndDown, superClass);

    function MoveToLastNonblankCharacterOfLineAndDown() {
      return MoveToLastNonblankCharacterOfLineAndDown.__super__.constructor.apply(this, arguments);
    }

    MoveToLastNonblankCharacterOfLineAndDown.prototype.operatesInclusively = true;

    MoveToLastNonblankCharacterOfLineAndDown.prototype.skipTrailingWhitespace = function(cursor) {
      var position, scanRange, startOfTrailingWhitespace;
      position = cursor.getBufferPosition();
      scanRange = cursor.getCurrentLineBufferRange();
      startOfTrailingWhitespace = [scanRange.end.row, scanRange.end.column - 1];
      this.editor.scanInBufferRange(/[ \t]+$/, scanRange, function(arg) {
        var range;
        range = arg.range;
        startOfTrailingWhitespace = range.start;
        return startOfTrailingWhitespace.column -= 1;
      });
      return cursor.setBufferPosition(startOfTrailingWhitespace);
    };

    MoveToLastNonblankCharacterOfLineAndDown.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      _.times(count - 1, function() {
        return cursor.moveDown();
      });
      return this.skipTrailingWhitespace(cursor);
    };

    return MoveToLastNonblankCharacterOfLineAndDown;

  })(Motion);

  MoveToFirstCharacterOfLineUp = (function(superClass) {
    extend(MoveToFirstCharacterOfLineUp, superClass);

    function MoveToFirstCharacterOfLineUp() {
      return MoveToFirstCharacterOfLineUp.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLineUp.prototype.operatesLinewise = true;

    MoveToFirstCharacterOfLineUp.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      _.times(count, function() {
        return cursor.moveUp();
      });
      cursor.moveToBeginningOfLine();
      return cursor.moveToFirstCharacterOfLine();
    };

    return MoveToFirstCharacterOfLineUp;

  })(Motion);

  MoveToFirstCharacterOfLineDown = (function(superClass) {
    extend(MoveToFirstCharacterOfLineDown, superClass);

    function MoveToFirstCharacterOfLineDown() {
      return MoveToFirstCharacterOfLineDown.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLineDown.prototype.operatesLinewise = true;

    MoveToFirstCharacterOfLineDown.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      _.times(count, function() {
        return cursor.moveDown();
      });
      cursor.moveToBeginningOfLine();
      return cursor.moveToFirstCharacterOfLine();
    };

    return MoveToFirstCharacterOfLineDown;

  })(Motion);

  MoveToStartOfFile = (function(superClass) {
    extend(MoveToStartOfFile, superClass);

    function MoveToStartOfFile() {
      return MoveToStartOfFile.__super__.constructor.apply(this, arguments);
    }

    MoveToStartOfFile.prototype.moveCursor = function(cursor, count) {
      var column, ref1, row;
      if (count == null) {
        count = 1;
      }
      ref1 = this.editor.getCursorBufferPosition(), row = ref1.row, column = ref1.column;
      cursor.setBufferPosition([this.getDestinationRow(count), 0]);
      if (!this.isLinewise()) {
        return cursor.moveToFirstCharacterOfLine();
      }
    };

    return MoveToStartOfFile;

  })(MoveToLine);

  MoveToTopOfScreen = (function(superClass) {
    extend(MoveToTopOfScreen, superClass);

    function MoveToTopOfScreen() {
      return MoveToTopOfScreen.__super__.constructor.apply(this, arguments);
    }

    MoveToTopOfScreen.prototype.getDestinationRow = function(count) {
      var firstScreenRow, offset;
      if (count == null) {
        count = 0;
      }
      firstScreenRow = this.editorElement.getFirstVisibleScreenRow();
      if (firstScreenRow > 0) {
        offset = Math.max(count - 1, this.scrolloff);
      } else {
        offset = count > 0 ? count - 1 : count;
      }
      return firstScreenRow + offset;
    };

    return MoveToTopOfScreen;

  })(MoveToScreenLine);

  MoveToBottomOfScreen = (function(superClass) {
    extend(MoveToBottomOfScreen, superClass);

    function MoveToBottomOfScreen() {
      return MoveToBottomOfScreen.__super__.constructor.apply(this, arguments);
    }

    MoveToBottomOfScreen.prototype.getDestinationRow = function(count) {
      var lastRow, lastScreenRow, offset;
      if (count == null) {
        count = 0;
      }
      lastScreenRow = this.editorElement.getLastVisibleScreenRow();
      lastRow = this.editor.getBuffer().getLastRow();
      if (lastScreenRow !== lastRow) {
        offset = Math.max(count - 1, this.scrolloff);
      } else {
        offset = count > 0 ? count - 1 : count;
      }
      return lastScreenRow - offset;
    };

    return MoveToBottomOfScreen;

  })(MoveToScreenLine);

  MoveToMiddleOfScreen = (function(superClass) {
    extend(MoveToMiddleOfScreen, superClass);

    function MoveToMiddleOfScreen() {
      return MoveToMiddleOfScreen.__super__.constructor.apply(this, arguments);
    }

    MoveToMiddleOfScreen.prototype.getDestinationRow = function() {
      var firstScreenRow, height, lastScreenRow;
      firstScreenRow = this.editorElement.getFirstVisibleScreenRow();
      lastScreenRow = this.editorElement.getLastVisibleScreenRow();
      height = lastScreenRow - firstScreenRow;
      return Math.floor(firstScreenRow + (height / 2));
    };

    return MoveToMiddleOfScreen;

  })(MoveToScreenLine);

  ScrollKeepingCursor = (function(superClass) {
    extend(ScrollKeepingCursor, superClass);

    ScrollKeepingCursor.prototype.operatesLinewise = true;

    ScrollKeepingCursor.prototype.cursorRow = null;

    function ScrollKeepingCursor(editorElement, vimState) {
      this.editorElement = editorElement;
      this.vimState = vimState;
      ScrollKeepingCursor.__super__.constructor.call(this, this.editorElement.getModel(), this.vimState);
    }

    ScrollKeepingCursor.prototype.select = function(count, options) {
      var newTopRow, scrollTop;
      if (this.editor.setFirstVisibleScreenRow != null) {
        newTopRow = this.getNewFirstVisibleScreenRow(count);
        ScrollKeepingCursor.__super__.select.call(this, count, options);
        return this.editor.setFirstVisibleScreenRow(newTopRow);
      } else {
        scrollTop = this.getNewScrollTop(count);
        ScrollKeepingCursor.__super__.select.call(this, count, options);
        return this.editorElement.setScrollTop(scrollTop);
      }
    };

    ScrollKeepingCursor.prototype.execute = function(count) {
      var newTopRow, scrollTop;
      if (this.editor.setFirstVisibleScreenRow != null) {
        newTopRow = this.getNewFirstVisibleScreenRow(count);
        ScrollKeepingCursor.__super__.execute.call(this, count);
        return this.editor.setFirstVisibleScreenRow(newTopRow);
      } else {
        scrollTop = this.getNewScrollTop(count);
        ScrollKeepingCursor.__super__.execute.call(this, count);
        return this.editorElement.setScrollTop(scrollTop);
      }
    };

    ScrollKeepingCursor.prototype.moveCursor = function(cursor) {
      return cursor.setScreenPosition(Point(this.cursorRow, 0), {
        autoscroll: false
      });
    };

    ScrollKeepingCursor.prototype.getNewScrollTop = function(count) {
      var currentCursorRow, currentScrollTop, lineHeight, ref1, rowsPerPage, scrollRows;
      if (count == null) {
        count = 1;
      }
      currentScrollTop = (ref1 = this.editorElement.component.presenter.pendingScrollTop) != null ? ref1 : this.editorElement.getScrollTop();
      currentCursorRow = this.editor.getCursorScreenPosition().row;
      rowsPerPage = this.editor.getRowsPerPage();
      lineHeight = this.editor.getLineHeightInPixels();
      scrollRows = Math.floor(this.pageScrollFraction * rowsPerPage * count);
      this.cursorRow = currentCursorRow + scrollRows;
      return currentScrollTop + scrollRows * lineHeight;
    };

    ScrollKeepingCursor.prototype.getNewFirstVisibleScreenRow = function(count) {
      var currentCursorRow, currentTopRow, rowsPerPage, scrollRows;
      if (count == null) {
        count = 1;
      }
      currentTopRow = this.editor.getFirstVisibleScreenRow();
      currentCursorRow = this.editor.getCursorScreenPosition().row;
      rowsPerPage = this.editor.getRowsPerPage();
      scrollRows = Math.ceil(this.pageScrollFraction * rowsPerPage * count);
      this.cursorRow = currentCursorRow + scrollRows;
      return currentTopRow + scrollRows;
    };

    return ScrollKeepingCursor;

  })(Motion);

  ScrollHalfUpKeepCursor = (function(superClass) {
    extend(ScrollHalfUpKeepCursor, superClass);

    function ScrollHalfUpKeepCursor() {
      return ScrollHalfUpKeepCursor.__super__.constructor.apply(this, arguments);
    }

    ScrollHalfUpKeepCursor.prototype.pageScrollFraction = -1 / 2;

    return ScrollHalfUpKeepCursor;

  })(ScrollKeepingCursor);

  ScrollFullUpKeepCursor = (function(superClass) {
    extend(ScrollFullUpKeepCursor, superClass);

    function ScrollFullUpKeepCursor() {
      return ScrollFullUpKeepCursor.__super__.constructor.apply(this, arguments);
    }

    ScrollFullUpKeepCursor.prototype.pageScrollFraction = -1;

    return ScrollFullUpKeepCursor;

  })(ScrollKeepingCursor);

  ScrollHalfDownKeepCursor = (function(superClass) {
    extend(ScrollHalfDownKeepCursor, superClass);

    function ScrollHalfDownKeepCursor() {
      return ScrollHalfDownKeepCursor.__super__.constructor.apply(this, arguments);
    }

    ScrollHalfDownKeepCursor.prototype.pageScrollFraction = 1 / 2;

    return ScrollHalfDownKeepCursor;

  })(ScrollKeepingCursor);

  ScrollFullDownKeepCursor = (function(superClass) {
    extend(ScrollFullDownKeepCursor, superClass);

    function ScrollFullDownKeepCursor() {
      return ScrollFullDownKeepCursor.__super__.constructor.apply(this, arguments);
    }

    ScrollFullDownKeepCursor.prototype.pageScrollFraction = 1;

    return ScrollFullDownKeepCursor;

  })(ScrollKeepingCursor);

  module.exports = {
    Motion: Motion,
    MotionWithInput: MotionWithInput,
    CurrentSelection: CurrentSelection,
    MoveLeft: MoveLeft,
    MoveRight: MoveRight,
    MoveUp: MoveUp,
    MoveDown: MoveDown,
    MoveToPreviousWord: MoveToPreviousWord,
    MoveToPreviousWholeWord: MoveToPreviousWholeWord,
    MoveToNextWord: MoveToNextWord,
    MoveToNextWholeWord: MoveToNextWholeWord,
    MoveToEndOfWord: MoveToEndOfWord,
    MoveToNextSentence: MoveToNextSentence,
    MoveToPreviousSentence: MoveToPreviousSentence,
    MoveToNextParagraph: MoveToNextParagraph,
    MoveToPreviousParagraph: MoveToPreviousParagraph,
    MoveToAbsoluteLine: MoveToAbsoluteLine,
    MoveToRelativeLine: MoveToRelativeLine,
    MoveToBeginningOfLine: MoveToBeginningOfLine,
    MoveToFirstCharacterOfLineUp: MoveToFirstCharacterOfLineUp,
    MoveToFirstCharacterOfLineDown: MoveToFirstCharacterOfLineDown,
    MoveToFirstCharacterOfLine: MoveToFirstCharacterOfLine,
    MoveToFirstCharacterOfLineAndDown: MoveToFirstCharacterOfLineAndDown,
    MoveToLastCharacterOfLine: MoveToLastCharacterOfLine,
    MoveToLastNonblankCharacterOfLineAndDown: MoveToLastNonblankCharacterOfLineAndDown,
    MoveToStartOfFile: MoveToStartOfFile,
    MoveToTopOfScreen: MoveToTopOfScreen,
    MoveToBottomOfScreen: MoveToBottomOfScreen,
    MoveToMiddleOfScreen: MoveToMiddleOfScreen,
    MoveToEndOfWholeWord: MoveToEndOfWholeWord,
    MotionError: MotionError,
    ScrollHalfUpKeepCursor: ScrollHalfUpKeepCursor,
    ScrollFullUpKeepCursor: ScrollFullUpKeepCursor,
    ScrollHalfDownKeepCursor: ScrollHalfDownKeepCursor,
    ScrollFullDownKeepCursor: ScrollFullDownKeepCursor
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9tb3Rpb25zL2dlbmVyYWwtbW90aW9ucy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG8zQkFBQTtJQUFBOzs7RUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSOztFQUNKLE1BQWlCLE9BQUEsQ0FBUSxNQUFSLENBQWpCLEVBQUMsaUJBQUQsRUFBUTs7RUFDUixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBRVgsY0FBQSxHQUFpQjs7RUFDakIseUJBQUEsR0FBNEI7O0VBQzVCLGFBQUEsR0FBZ0I7O0VBRVY7SUFDUyxxQkFBQyxPQUFEO01BQUMsSUFBQyxDQUFBLFVBQUQ7TUFDWixJQUFDLENBQUEsSUFBRCxHQUFRO0lBREc7Ozs7OztFQUdUO3FCQUNKLG1CQUFBLEdBQXFCOztxQkFDckIsZ0JBQUEsR0FBa0I7O0lBRUwsZ0JBQUMsTUFBRCxFQUFVLFFBQVY7TUFBQyxJQUFDLENBQUEsU0FBRDtNQUFTLElBQUMsQ0FBQSxXQUFEO0lBQVY7O3FCQUViLE1BQUEsR0FBUSxTQUFDLEtBQUQsRUFBUSxPQUFSO0FBQ04sVUFBQTtNQUFBLEtBQUE7O0FBQVE7QUFBQTthQUFBLHNDQUFBOztVQUNOLElBQUcsSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQUFIO1lBQ0UsSUFBQyxDQUFBLHFCQUFELENBQXVCLFNBQXZCLEVBQWtDLEtBQWxDLEVBQXlDLE9BQXpDLEVBREY7V0FBQSxNQUVLLElBQUcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLEtBQWtCLFFBQXJCO1lBQ0gsSUFBQyxDQUFBLG1CQUFELENBQXFCLFNBQXJCLEVBQWdDLEtBQWhDLEVBQXVDLE9BQXZDLEVBREc7V0FBQSxNQUVBLElBQUcsSUFBQyxDQUFBLG1CQUFKO1lBQ0gsSUFBQyxDQUFBLHdCQUFELENBQTBCLFNBQTFCLEVBQXFDLEtBQXJD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QkFMZTtJQUthLG1DQUFBLGlDQUxiO0lBS2dELDJCQUFBLHlCQUxoRDtJQU1mLDBDQUFBLHdDQU5lO0lBTTJCLG1CQUFBLGlCQU4zQjtJQU9mLG1CQUFBLGlCQVBlO0lBT0ksc0JBQUEsb0JBUEo7SUFPMEIsc0JBQUEsb0JBUDFCO0lBT2dELHNCQUFBLG9CQVBoRDtJQU9zRSxhQUFBLFdBUHRFO0lBUWYsd0JBQUEsc0JBUmU7SUFRUyx3QkFBQSxzQkFSVDtJQVNmLDBCQUFBLHdCQVRlO0lBU1csMEJBQUEsd0JBVFg7O0FBbmdCakIiLCJzb3VyY2VzQ29udGVudCI6WyJfID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xue1BvaW50LCBSYW5nZX0gPSByZXF1aXJlICdhdG9tJ1xuc2V0dGluZ3MgPSByZXF1aXJlICcuLi9zZXR0aW5ncydcblxuV2hvbGVXb3JkUmVnZXggPSAvXFxTKy9cbldob2xlV29yZE9yRW1wdHlMaW5lUmVnZXggPSAvXlxccyokfFxcUysvXG5BbGxXaGl0ZXNwYWNlID0gL15cXHMkL1xuXG5jbGFzcyBNb3Rpb25FcnJvclxuICBjb25zdHJ1Y3RvcjogKEBtZXNzYWdlKSAtPlxuICAgIEBuYW1lID0gJ01vdGlvbiBFcnJvcidcblxuY2xhc3MgTW90aW9uXG4gIG9wZXJhdGVzSW5jbHVzaXZlbHk6IGZhbHNlXG4gIG9wZXJhdGVzTGluZXdpc2U6IGZhbHNlXG5cbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBAdmltU3RhdGUpIC0+XG5cbiAgc2VsZWN0OiAoY291bnQsIG9wdGlvbnMpIC0+XG4gICAgdmFsdWUgPSBmb3Igc2VsZWN0aW9uIGluIEBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gICAgICBpZiBAaXNMaW5ld2lzZSgpXG4gICAgICAgIEBtb3ZlU2VsZWN0aW9uTGluZXdpc2Uoc2VsZWN0aW9uLCBjb3VudCwgb3B0aW9ucylcbiAgICAgIGVsc2UgaWYgQHZpbVN0YXRlLm1vZGUgaXMgJ3Zpc3VhbCdcbiAgICAgICAgQG1vdmVTZWxlY3Rpb25WaXN1YWwoc2VsZWN0aW9uLCBjb3VudCwgb3B0aW9ucylcbiAgICAgIGVsc2UgaWYgQG9wZXJhdGVzSW5jbHVzaXZlbHlcbiAgICAgICAgQG1vdmVTZWxlY3Rpb25JbmNsdXNpdmVseShzZWxlY3Rpb24sIGNvdW50LCBvcHRpb25zKVxuICAgICAgZWxzZVxuICAgICAgICBAbW92ZVNlbGVjdGlvbihzZWxlY3Rpb24sIGNvdW50LCBvcHRpb25zKVxuICAgICAgbm90IHNlbGVjdGlvbi5pc0VtcHR5KClcblxuICAgIEBlZGl0b3IubWVyZ2VDdXJzb3JzKClcbiAgICBAZWRpdG9yLm1lcmdlSW50ZXJzZWN0aW5nU2VsZWN0aW9ucygpXG4gICAgdmFsdWVcblxuICBleGVjdXRlOiAoY291bnQpIC0+XG4gICAgZm9yIGN1cnNvciBpbiBAZWRpdG9yLmdldEN1cnNvcnMoKVxuICAgICAgQG1vdmVDdXJzb3IoY3Vyc29yLCBjb3VudClcbiAgICBAZWRpdG9yLm1lcmdlQ3Vyc29ycygpXG5cbiAgbW92ZVNlbGVjdGlvbkxpbmV3aXNlOiAoc2VsZWN0aW9uLCBjb3VudCwgb3B0aW9ucykgLT5cbiAgICBzZWxlY3Rpb24ubW9kaWZ5U2VsZWN0aW9uID0+XG4gICAgICBbb2xkU3RhcnRSb3csIG9sZEVuZFJvd10gPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUm93UmFuZ2UoKVxuXG4gICAgICB3YXNFbXB0eSA9IHNlbGVjdGlvbi5pc0VtcHR5KClcbiAgICAgIHdhc1JldmVyc2VkID0gc2VsZWN0aW9uLmlzUmV2ZXJzZWQoKVxuICAgICAgdW5sZXNzIHdhc0VtcHR5IG9yIHdhc1JldmVyc2VkXG4gICAgICAgIHNlbGVjdGlvbi5jdXJzb3IubW92ZUxlZnQoKVxuXG4gICAgICBAbW92ZUN1cnNvcihzZWxlY3Rpb24uY3Vyc29yLCBjb3VudCwgb3B0aW9ucylcblxuICAgICAgaXNFbXB0eSA9IHNlbGVjdGlvbi5pc0VtcHR5KClcbiAgICAgIGlzUmV2ZXJzZWQgPSBzZWxlY3Rpb24uaXNSZXZlcnNlZCgpXG4gICAgICB1bmxlc3MgaXNFbXB0eSBvciBpc1JldmVyc2VkXG4gICAgICAgIHNlbGVjdGlvbi5jdXJzb3IubW92ZVJpZ2h0KClcblxuICAgICAgW25ld1N0YXJ0Um93LCBuZXdFbmRSb3ddID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJvd1JhbmdlKClcblxuICAgICAgaWYgaXNSZXZlcnNlZCBhbmQgbm90IHdhc1JldmVyc2VkXG4gICAgICAgIG5ld0VuZFJvdyA9IE1hdGgubWF4KG5ld0VuZFJvdywgb2xkU3RhcnRSb3cpXG4gICAgICBpZiB3YXNSZXZlcnNlZCBhbmQgbm90IGlzUmV2ZXJzZWRcbiAgICAgICAgbmV3U3RhcnRSb3cgPSBNYXRoLm1pbihuZXdTdGFydFJvdywgb2xkRW5kUm93KVxuXG4gICAgICBzZWxlY3Rpb24uc2V0QnVmZmVyUmFuZ2UoW1tuZXdTdGFydFJvdywgMF0sIFtuZXdFbmRSb3cgKyAxLCAwXV0sIGF1dG9zY3JvbGw6IGZhbHNlKVxuXG4gIG1vdmVTZWxlY3Rpb25JbmNsdXNpdmVseTogKHNlbGVjdGlvbiwgY291bnQsIG9wdGlvbnMpIC0+XG4gICAgcmV0dXJuIEBtb3ZlU2VsZWN0aW9uVmlzdWFsKHNlbGVjdGlvbiwgY291bnQsIG9wdGlvbnMpIHVubGVzcyBzZWxlY3Rpb24uaXNFbXB0eSgpXG5cbiAgICBzZWxlY3Rpb24ubW9kaWZ5U2VsZWN0aW9uID0+XG4gICAgICBAbW92ZUN1cnNvcihzZWxlY3Rpb24uY3Vyc29yLCBjb3VudCwgb3B0aW9ucylcbiAgICAgIHJldHVybiBpZiBzZWxlY3Rpb24uaXNFbXB0eSgpXG5cbiAgICAgIGlmIHNlbGVjdGlvbi5pc1JldmVyc2VkKClcbiAgICAgICAgIyBmb3IgYmFja3dhcmQgbW90aW9uLCBhZGQgdGhlIG9yaWdpbmFsIHN0YXJ0aW5nIGNoYXJhY3RlciBvZiB0aGUgbW90aW9uXG4gICAgICAgIHtzdGFydCwgZW5kfSA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG4gICAgICAgIHNlbGVjdGlvbi5zZXRCdWZmZXJSYW5nZShbc3RhcnQsIFtlbmQucm93LCBlbmQuY29sdW1uICsgMV1dKVxuICAgICAgZWxzZVxuICAgICAgICAjIGZvciBmb3J3YXJkIG1vdGlvbiwgYWRkIHRoZSBlbmRpbmcgY2hhcmFjdGVyIG9mIHRoZSBtb3Rpb25cbiAgICAgICAgc2VsZWN0aW9uLmN1cnNvci5tb3ZlUmlnaHQoKVxuXG4gIG1vdmVTZWxlY3Rpb25WaXN1YWw6IChzZWxlY3Rpb24sIGNvdW50LCBvcHRpb25zKSAtPlxuICAgIHNlbGVjdGlvbi5tb2RpZnlTZWxlY3Rpb24gPT5cbiAgICAgIHJhbmdlID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKClcbiAgICAgIFtvbGRTdGFydCwgb2xkRW5kXSA9IFtyYW5nZS5zdGFydCwgcmFuZ2UuZW5kXVxuXG4gICAgICAjIGluIHZpc3VhbCBtb2RlLCBhdG9tIGN1cnNvciBpcyBhZnRlciB0aGUgbGFzdCBzZWxlY3RlZCBjaGFyYWN0ZXIsXG4gICAgICAjIHNvIGhlcmUgcHV0IGN1cnNvciBpbiB0aGUgZXhwZWN0ZWQgcGxhY2UgZm9yIHRoZSBmb2xsb3dpbmcgbW90aW9uXG4gICAgICB3YXNFbXB0eSA9IHNlbGVjdGlvbi5pc0VtcHR5KClcbiAgICAgIHdhc1JldmVyc2VkID0gc2VsZWN0aW9uLmlzUmV2ZXJzZWQoKVxuICAgICAgdW5sZXNzIHdhc0VtcHR5IG9yIHdhc1JldmVyc2VkXG4gICAgICAgIHNlbGVjdGlvbi5jdXJzb3IubW92ZUxlZnQoKVxuXG4gICAgICBAbW92ZUN1cnNvcihzZWxlY3Rpb24uY3Vyc29yLCBjb3VudCwgb3B0aW9ucylcblxuICAgICAgIyBwdXQgY3Vyc29yIGJhY2sgYWZ0ZXIgdGhlIGxhc3QgY2hhcmFjdGVyIHNvIGl0IGlzIGFsc28gc2VsZWN0ZWRcbiAgICAgIGlzRW1wdHkgPSBzZWxlY3Rpb24uaXNFbXB0eSgpXG4gICAgICBpc1JldmVyc2VkID0gc2VsZWN0aW9uLmlzUmV2ZXJzZWQoKVxuICAgICAgdW5sZXNzIGlzRW1wdHkgb3IgaXNSZXZlcnNlZFxuICAgICAgICBzZWxlY3Rpb24uY3Vyc29yLm1vdmVSaWdodCgpXG5cbiAgICAgIHJhbmdlID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKClcbiAgICAgIFtuZXdTdGFydCwgbmV3RW5kXSA9IFtyYW5nZS5zdGFydCwgcmFuZ2UuZW5kXVxuXG4gICAgICAjIGlmIHdlIHJldmVyc2VkIG9yIGVtcHRpZWQgYSBub3JtYWwgc2VsZWN0aW9uXG4gICAgICAjIHdlIG5lZWQgdG8gc2VsZWN0IGFnYWluIHRoZSBsYXN0IGNoYXJhY3RlciBkZXNlbGVjdGVkIGFib3ZlIHRoZSBtb3Rpb25cbiAgICAgIGlmIChpc1JldmVyc2VkIG9yIGlzRW1wdHkpIGFuZCBub3QgKHdhc1JldmVyc2VkIG9yIHdhc0VtcHR5KVxuICAgICAgICBzZWxlY3Rpb24uc2V0QnVmZmVyUmFuZ2UoW25ld1N0YXJ0LCBbbmV3RW5kLnJvdywgb2xkU3RhcnQuY29sdW1uICsgMV1dKVxuXG4gICAgICAjIGlmIHdlIHJlLXJldmVyc2VkIGEgcmV2ZXJzZWQgbm9uLWVtcHR5IHNlbGVjdGlvbixcbiAgICAgICMgd2UgbmVlZCB0byBrZWVwIHRoZSBsYXN0IGNoYXJhY3RlciBvZiB0aGUgb2xkIHNlbGVjdGlvbiBzZWxlY3RlZFxuICAgICAgaWYgd2FzUmV2ZXJzZWQgYW5kIG5vdCB3YXNFbXB0eSBhbmQgbm90IGlzUmV2ZXJzZWRcbiAgICAgICAgc2VsZWN0aW9uLnNldEJ1ZmZlclJhbmdlKFtbb2xkRW5kLnJvdywgb2xkRW5kLmNvbHVtbiAtIDFdLCBuZXdFbmRdKVxuXG4gICAgICAjIGtlZXAgYSBzaW5nbGUtY2hhcmFjdGVyIHNlbGVjdGlvbiBub24tcmV2ZXJzZWRcbiAgICAgIHJhbmdlID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKClcbiAgICAgIFtuZXdTdGFydCwgbmV3RW5kXSA9IFtyYW5nZS5zdGFydCwgcmFuZ2UuZW5kXVxuICAgICAgaWYgc2VsZWN0aW9uLmlzUmV2ZXJzZWQoKSBhbmQgbmV3U3RhcnQucm93IGlzIG5ld0VuZC5yb3cgYW5kIG5ld1N0YXJ0LmNvbHVtbiArIDEgaXMgbmV3RW5kLmNvbHVtblxuICAgICAgICBzZWxlY3Rpb24uc2V0QnVmZmVyUmFuZ2UocmFuZ2UsIHJldmVyc2VkOiBmYWxzZSlcblxuICBtb3ZlU2VsZWN0aW9uOiAoc2VsZWN0aW9uLCBjb3VudCwgb3B0aW9ucykgLT5cbiAgICBzZWxlY3Rpb24ubW9kaWZ5U2VsZWN0aW9uID0+IEBtb3ZlQ3Vyc29yKHNlbGVjdGlvbi5jdXJzb3IsIGNvdW50LCBvcHRpb25zKVxuXG4gIGlzQ29tcGxldGU6IC0+IHRydWVcblxuICBpc1JlY29yZGFibGU6IC0+IGZhbHNlXG5cbiAgaXNMaW5ld2lzZTogLT5cbiAgICBpZiBAdmltU3RhdGU/Lm1vZGUgaXMgJ3Zpc3VhbCdcbiAgICAgIEB2aW1TdGF0ZT8uc3VibW9kZSBpcyAnbGluZXdpc2UnXG4gICAgZWxzZVxuICAgICAgQG9wZXJhdGVzTGluZXdpc2VcblxuY2xhc3MgQ3VycmVudFNlbGVjdGlvbiBleHRlbmRzIE1vdGlvblxuICBjb25zdHJ1Y3RvcjogKEBlZGl0b3IsIEB2aW1TdGF0ZSkgLT5cbiAgICBzdXBlcihAZWRpdG9yLCBAdmltU3RhdGUpXG4gICAgQGxhc3RTZWxlY3Rpb25SYW5nZSA9IEBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSgpXG4gICAgQHdhc0xpbmV3aXNlID0gQGlzTGluZXdpc2UoKVxuXG4gIGV4ZWN1dGU6IChjb3VudD0xKSAtPlxuICAgIF8udGltZXMoY291bnQsIC0+IHRydWUpXG5cbiAgc2VsZWN0OiAoY291bnQ9MSkgLT5cbiAgICAjIGluIHZpc3VhbCBtb2RlLCB0aGUgY3VycmVudCBzZWxlY3Rpb25zIGFyZSBhbHJlYWR5IHRoZXJlXG4gICAgIyBpZiB3ZSdyZSBub3QgaW4gdmlzdWFsIG1vZGUsIHdlIGFyZSByZXBlYXRpbmcgc29tZSBvcGVyYXRpb24gYW5kIG5lZWQgdG8gcmUtZG8gdGhlIHNlbGVjdGlvbnNcbiAgICB1bmxlc3MgQHZpbVN0YXRlLm1vZGUgaXMgJ3Zpc3VhbCdcbiAgICAgIGlmIEB3YXNMaW5ld2lzZVxuICAgICAgICBAc2VsZWN0TGluZXMoKVxuICAgICAgZWxzZVxuICAgICAgICBAc2VsZWN0Q2hhcmFjdGVycygpXG5cbiAgICBfLnRpbWVzKGNvdW50LCAtPiB0cnVlKVxuXG4gIHNlbGVjdExpbmVzOiAtPlxuICAgIGxhc3RTZWxlY3Rpb25FeHRlbnQgPSBAbGFzdFNlbGVjdGlvblJhbmdlLmdldEV4dGVudCgpXG4gICAgZm9yIHNlbGVjdGlvbiBpbiBAZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICAgICAgY3Vyc29yID0gc2VsZWN0aW9uLmN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgICBzZWxlY3Rpb24uc2V0QnVmZmVyUmFuZ2UgW1tjdXJzb3Iucm93LCAwXSwgW2N1cnNvci5yb3cgKyBsYXN0U2VsZWN0aW9uRXh0ZW50LnJvdywgMF1dXG4gICAgcmV0dXJuXG5cbiAgc2VsZWN0Q2hhcmFjdGVyczogLT5cbiAgICBsYXN0U2VsZWN0aW9uRXh0ZW50ID0gQGxhc3RTZWxlY3Rpb25SYW5nZS5nZXRFeHRlbnQoKVxuICAgIGZvciBzZWxlY3Rpb24gaW4gQGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgICAgIHtzdGFydH0gPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgbmV3RW5kID0gc3RhcnQudHJhdmVyc2UobGFzdFNlbGVjdGlvbkV4dGVudClcbiAgICAgIHNlbGVjdGlvbi5zZXRCdWZmZXJSYW5nZShbc3RhcnQsIG5ld0VuZF0pXG4gICAgcmV0dXJuXG5cbiMgUHVibGljOiBHZW5lcmljIGNsYXNzIGZvciBtb3Rpb25zIHRoYXQgcmVxdWlyZSBleHRyYSBpbnB1dFxuY2xhc3MgTW90aW9uV2l0aElucHV0IGV4dGVuZHMgTW90aW9uXG4gIGNvbnN0cnVjdG9yOiAoQGVkaXRvciwgQHZpbVN0YXRlKSAtPlxuICAgIHN1cGVyKEBlZGl0b3IsIEB2aW1TdGF0ZSlcbiAgICBAY29tcGxldGUgPSBmYWxzZVxuXG4gIGlzQ29tcGxldGU6IC0+IEBjb21wbGV0ZVxuXG4gIGNhbkNvbXBvc2VXaXRoOiAob3BlcmF0aW9uKSAtPiByZXR1cm4gb3BlcmF0aW9uLmNoYXJhY3RlcnM/XG5cbiAgY29tcG9zZTogKGlucHV0KSAtPlxuICAgIGlmIG5vdCBpbnB1dC5jaGFyYWN0ZXJzXG4gICAgICB0aHJvdyBuZXcgTW90aW9uRXJyb3IoJ011c3QgY29tcG9zZSB3aXRoIGFuIElucHV0JylcbiAgICBAaW5wdXQgPSBpbnB1dFxuICAgIEBjb21wbGV0ZSA9IHRydWVcblxuY2xhc3MgTW92ZUxlZnQgZXh0ZW5kcyBNb3Rpb25cbiAgbW92ZUN1cnNvcjogKGN1cnNvciwgY291bnQ9MSkgLT5cbiAgICBfLnRpbWVzIGNvdW50LCAtPlxuICAgICAgY3Vyc29yLm1vdmVMZWZ0KCkgaWYgbm90IGN1cnNvci5pc0F0QmVnaW5uaW5nT2ZMaW5lKCkgb3Igc2V0dGluZ3Mud3JhcExlZnRSaWdodE1vdGlvbigpXG5cbmNsYXNzIE1vdmVSaWdodCBleHRlbmRzIE1vdGlvblxuICBtb3ZlQ3Vyc29yOiAoY3Vyc29yLCBjb3VudD0xKSAtPlxuICAgIF8udGltZXMgY291bnQsID0+XG4gICAgICB3cmFwVG9OZXh0TGluZSA9IHNldHRpbmdzLndyYXBMZWZ0UmlnaHRNb3Rpb24oKVxuXG4gICAgICAjIHdoZW4gdGhlIG1vdGlvbiBpcyBjb21iaW5lZCB3aXRoIGFuIG9wZXJhdG9yLCB3ZSB3aWxsIG9ubHkgd3JhcCB0byB0aGUgbmV4dCBsaW5lXG4gICAgICAjIGlmIHdlIGFyZSBhbHJlYWR5IGF0IHRoZSBlbmQgb2YgdGhlIGxpbmUgKGFmdGVyIHRoZSBsYXN0IGNoYXJhY3RlcilcbiAgICAgIHdyYXBUb05leHRMaW5lID0gZmFsc2UgaWYgQHZpbVN0YXRlLm1vZGUgaXMgJ29wZXJhdG9yLXBlbmRpbmcnIGFuZCBub3QgY3Vyc29yLmlzQXRFbmRPZkxpbmUoKVxuXG4gICAgICBjdXJzb3IubW92ZVJpZ2h0KCkgdW5sZXNzIGN1cnNvci5pc0F0RW5kT2ZMaW5lKClcbiAgICAgIGN1cnNvci5tb3ZlUmlnaHQoKSBpZiB3cmFwVG9OZXh0TGluZSBhbmQgY3Vyc29yLmlzQXRFbmRPZkxpbmUoKVxuXG5jbGFzcyBNb3ZlVXAgZXh0ZW5kcyBNb3Rpb25cbiAgb3BlcmF0ZXNMaW5ld2lzZTogdHJ1ZVxuXG4gIG1vdmVDdXJzb3I6IChjdXJzb3IsIGNvdW50PTEpIC0+XG4gICAgXy50aW1lcyBjb3VudCwgLT5cbiAgICAgIHVubGVzcyBjdXJzb3IuZ2V0U2NyZWVuUm93KCkgaXMgMFxuICAgICAgICBjdXJzb3IubW92ZVVwKClcblxuY2xhc3MgTW92ZURvd24gZXh0ZW5kcyBNb3Rpb25cbiAgb3BlcmF0ZXNMaW5ld2lzZTogdHJ1ZVxuXG4gIG1vdmVDdXJzb3I6IChjdXJzb3IsIGNvdW50PTEpIC0+XG4gICAgXy50aW1lcyBjb3VudCwgPT5cbiAgICAgIHVubGVzcyBjdXJzb3IuZ2V0U2NyZWVuUm93KCkgaXMgQGVkaXRvci5nZXRMYXN0U2NyZWVuUm93KClcbiAgICAgICAgY3Vyc29yLm1vdmVEb3duKClcblxuY2xhc3MgTW92ZVRvUHJldmlvdXNXb3JkIGV4dGVuZHMgTW90aW9uXG4gIG1vdmVDdXJzb3I6IChjdXJzb3IsIGNvdW50PTEpIC0+XG4gICAgXy50aW1lcyBjb3VudCwgLT5cbiAgICAgIGN1cnNvci5tb3ZlVG9CZWdpbm5pbmdPZldvcmQoKVxuXG5jbGFzcyBNb3ZlVG9QcmV2aW91c1dob2xlV29yZCBleHRlbmRzIE1vdGlvblxuICBtb3ZlQ3Vyc29yOiAoY3Vyc29yLCBjb3VudD0xKSAtPlxuICAgIF8udGltZXMgY291bnQsID0+XG4gICAgICBjdXJzb3IubW92ZVRvQmVnaW5uaW5nT2ZXb3JkKClcbiAgICAgIHdoaWxlIG5vdCBAaXNXaG9sZVdvcmQoY3Vyc29yKSBhbmQgbm90IEBpc0JlZ2lubmluZ09mRmlsZShjdXJzb3IpXG4gICAgICAgIGN1cnNvci5tb3ZlVG9CZWdpbm5pbmdPZldvcmQoKVxuXG4gIGlzV2hvbGVXb3JkOiAoY3Vyc29yKSAtPlxuICAgIGNoYXIgPSBjdXJzb3IuZ2V0Q3VycmVudFdvcmRQcmVmaXgoKS5zbGljZSgtMSlcbiAgICBBbGxXaGl0ZXNwYWNlLnRlc3QoY2hhcilcblxuICBpc0JlZ2lubmluZ09mRmlsZTogKGN1cnNvcikgLT5cbiAgICBjdXIgPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgIG5vdCBjdXIucm93IGFuZCBub3QgY3VyLmNvbHVtblxuXG5jbGFzcyBNb3ZlVG9OZXh0V29yZCBleHRlbmRzIE1vdGlvblxuICB3b3JkUmVnZXg6IG51bGxcblxuICBtb3ZlQ3Vyc29yOiAoY3Vyc29yLCBjb3VudD0xLCBvcHRpb25zKSAtPlxuICAgIF8udGltZXMgY291bnQsID0+XG4gICAgICBjdXJyZW50ID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcblxuICAgICAgbmV4dCA9IGlmIG9wdGlvbnM/LmV4Y2x1ZGVXaGl0ZXNwYWNlXG4gICAgICAgIGN1cnNvci5nZXRFbmRPZkN1cnJlbnRXb3JkQnVmZmVyUG9zaXRpb24od29yZFJlZ2V4OiBAd29yZFJlZ2V4KVxuICAgICAgZWxzZVxuICAgICAgICBjdXJzb3IuZ2V0QmVnaW5uaW5nT2ZOZXh0V29yZEJ1ZmZlclBvc2l0aW9uKHdvcmRSZWdleDogQHdvcmRSZWdleClcblxuICAgICAgcmV0dXJuIGlmIEBpc0VuZE9mRmlsZShjdXJzb3IpXG5cbiAgICAgIGlmIGN1cnNvci5pc0F0RW5kT2ZMaW5lKClcbiAgICAgICAgY3Vyc29yLm1vdmVEb3duKClcbiAgICAgICAgY3Vyc29yLm1vdmVUb0JlZ2lubmluZ09mTGluZSgpXG4gICAgICAgIGN1cnNvci5za2lwTGVhZGluZ1doaXRlc3BhY2UoKVxuICAgICAgZWxzZSBpZiBjdXJyZW50LnJvdyBpcyBuZXh0LnJvdyBhbmQgY3VycmVudC5jb2x1bW4gaXMgbmV4dC5jb2x1bW5cbiAgICAgICAgY3Vyc29yLm1vdmVUb0VuZE9mV29yZCgpXG4gICAgICBlbHNlXG4gICAgICAgIGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbihuZXh0KVxuXG4gIGlzRW5kT2ZGaWxlOiAoY3Vyc29yKSAtPlxuICAgIGN1ciA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgZW9mID0gQGVkaXRvci5nZXRFb2ZCdWZmZXJQb3NpdGlvbigpXG4gICAgY3VyLnJvdyBpcyBlb2Yucm93IGFuZCBjdXIuY29sdW1uIGlzIGVvZi5jb2x1bW5cblxuY2xhc3MgTW92ZVRvTmV4dFdob2xlV29yZCBleHRlbmRzIE1vdmVUb05leHRXb3JkXG4gIHdvcmRSZWdleDogV2hvbGVXb3JkT3JFbXB0eUxpbmVSZWdleFxuXG5jbGFzcyBNb3ZlVG9FbmRPZldvcmQgZXh0ZW5kcyBNb3Rpb25cbiAgb3BlcmF0ZXNJbmNsdXNpdmVseTogdHJ1ZVxuICB3b3JkUmVnZXg6IG51bGxcblxuICBtb3ZlQ3Vyc29yOiAoY3Vyc29yLCBjb3VudD0xKSAtPlxuICAgIF8udGltZXMgY291bnQsID0+XG4gICAgICBjdXJyZW50ID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcblxuICAgICAgbmV4dCA9IGN1cnNvci5nZXRFbmRPZkN1cnJlbnRXb3JkQnVmZmVyUG9zaXRpb24od29yZFJlZ2V4OiBAd29yZFJlZ2V4KVxuICAgICAgbmV4dC5jb2x1bW4tLSBpZiBuZXh0LmNvbHVtbiA+IDBcblxuICAgICAgaWYgbmV4dC5pc0VxdWFsKGN1cnJlbnQpXG4gICAgICAgIGN1cnNvci5tb3ZlUmlnaHQoKVxuICAgICAgICBpZiBjdXJzb3IuaXNBdEVuZE9mTGluZSgpXG4gICAgICAgICAgY3Vyc29yLm1vdmVEb3duKClcbiAgICAgICAgICBjdXJzb3IubW92ZVRvQmVnaW5uaW5nT2ZMaW5lKClcblxuICAgICAgICBuZXh0ID0gY3Vyc29yLmdldEVuZE9mQ3VycmVudFdvcmRCdWZmZXJQb3NpdGlvbih3b3JkUmVnZXg6IEB3b3JkUmVnZXgpXG4gICAgICAgIG5leHQuY29sdW1uLS0gaWYgbmV4dC5jb2x1bW4gPiAwXG5cbiAgICAgIGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbihuZXh0KVxuXG5jbGFzcyBNb3ZlVG9FbmRPZldob2xlV29yZCBleHRlbmRzIE1vdmVUb0VuZE9mV29yZFxuICB3b3JkUmVnZXg6IFdob2xlV29yZFJlZ2V4XG5cbmNsYXNzIE1vdmVUb05leHRTZW50ZW5jZSBleHRlbmRzIE1vdGlvblxuICBtb3ZlQ3Vyc29yOiAoY3Vyc29yLCBjb3VudD0xKSAtPlxuICAgIF8udGltZXMgY291bnQsIC0+XG4gICAgICBzdGFydCA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpLnRyYW5zbGF0ZSBuZXcgUG9pbnQoMCwgMSlcbiAgICAgIGVvZiA9IGN1cnNvci5lZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0RW5kUG9zaXRpb24oKVxuICAgICAgc2NhblJhbmdlID0gW3N0YXJ0LCBlb2ZdXG5cbiAgICAgIGN1cnNvci5lZGl0b3Iuc2NhbkluQnVmZmVyUmFuZ2UgLyheJCl8KChbXFwuIT9dICl8XltBLVphLXowLTldKS8sIHNjYW5SYW5nZSwgKHttYXRjaFRleHQsIHJhbmdlLCBzdG9wfSkgLT5cbiAgICAgICAgYWRqdXN0bWVudCA9IG5ldyBQb2ludCgwLCAwKVxuICAgICAgICBpZiBtYXRjaFRleHQubWF0Y2ggL1tcXC4hP10vXG4gICAgICAgICAgYWRqdXN0bWVudCA9IG5ldyBQb2ludCgwLCAyKVxuXG4gICAgICAgIGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbiByYW5nZS5zdGFydC50cmFuc2xhdGUoYWRqdXN0bWVudClcbiAgICAgICAgc3RvcCgpXG5cbmNsYXNzIE1vdmVUb1ByZXZpb3VzU2VudGVuY2UgZXh0ZW5kcyBNb3Rpb25cbiAgbW92ZUN1cnNvcjogKGN1cnNvciwgY291bnQ9MSkgLT5cbiAgICBfLnRpbWVzIGNvdW50LCAtPlxuICAgICAgZW5kID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCkudHJhbnNsYXRlIG5ldyBQb2ludCgwLCAtMSlcbiAgICAgIGJvZiA9IGN1cnNvci5lZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0Rmlyc3RQb3NpdGlvbigpXG4gICAgICBzY2FuUmFuZ2UgPSBbYm9mLCBlbmRdXG5cbiAgICAgIGN1cnNvci5lZGl0b3IuYmFja3dhcmRzU2NhbkluQnVmZmVyUmFuZ2UgLyheJCl8KChbXFwuIT9dICl8XltBLVphLXowLTldKS8sIHNjYW5SYW5nZSwgKHttYXRjaFRleHQsIHJhbmdlLCBzdG9wfSkgLT5cbiAgICAgICAgYWRqdXN0bWVudCA9IG5ldyBQb2ludCgwLCAwKVxuICAgICAgICBpZiBtYXRjaFRleHQubWF0Y2ggL1tcXC4hP10vXG4gICAgICAgICAgYWRqdXN0bWVudCA9IG5ldyBQb2ludCgwLCAyKVxuXG4gICAgICAgIGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbiByYW5nZS5zdGFydC50cmFuc2xhdGUoYWRqdXN0bWVudClcbiAgICAgICAgc3RvcCgpXG5cbmNsYXNzIE1vdmVUb05leHRQYXJhZ3JhcGggZXh0ZW5kcyBNb3Rpb25cbiAgbW92ZUN1cnNvcjogKGN1cnNvciwgY291bnQ9MSkgLT5cbiAgICBfLnRpbWVzIGNvdW50LCAtPlxuICAgICAgY3Vyc29yLm1vdmVUb0JlZ2lubmluZ09mTmV4dFBhcmFncmFwaCgpXG5cbmNsYXNzIE1vdmVUb1ByZXZpb3VzUGFyYWdyYXBoIGV4dGVuZHMgTW90aW9uXG4gIG1vdmVDdXJzb3I6IChjdXJzb3IsIGNvdW50PTEpIC0+XG4gICAgXy50aW1lcyBjb3VudCwgLT5cbiAgICAgIGN1cnNvci5tb3ZlVG9CZWdpbm5pbmdPZlByZXZpb3VzUGFyYWdyYXBoKClcblxuY2xhc3MgTW92ZVRvTGluZSBleHRlbmRzIE1vdGlvblxuICBvcGVyYXRlc0xpbmV3aXNlOiB0cnVlXG5cbiAgZ2V0RGVzdGluYXRpb25Sb3c6IChjb3VudCkgLT5cbiAgICBpZiBjb3VudD8gdGhlbiBjb3VudCAtIDEgZWxzZSAoQGVkaXRvci5nZXRMaW5lQ291bnQoKSAtIDEpXG5cbmNsYXNzIE1vdmVUb0Fic29sdXRlTGluZSBleHRlbmRzIE1vdmVUb0xpbmVcbiAgbW92ZUN1cnNvcjogKGN1cnNvciwgY291bnQpIC0+XG4gICAgY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKFtAZ2V0RGVzdGluYXRpb25Sb3coY291bnQpLCBJbmZpbml0eV0pXG4gICAgY3Vyc29yLm1vdmVUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lKClcbiAgICBjdXJzb3IubW92ZVRvRW5kT2ZMaW5lKCkgaWYgY3Vyc29yLmdldEJ1ZmZlckNvbHVtbigpIGlzIDBcblxuY2xhc3MgTW92ZVRvUmVsYXRpdmVMaW5lIGV4dGVuZHMgTW92ZVRvTGluZVxuICBtb3ZlQ3Vyc29yOiAoY3Vyc29yLCBjb3VudD0xKSAtPlxuICAgIHtyb3csIGNvbHVtbn0gPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgIGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbihbcm93ICsgKGNvdW50IC0gMSksIDBdKVxuXG5jbGFzcyBNb3ZlVG9TY3JlZW5MaW5lIGV4dGVuZHMgTW92ZVRvTGluZVxuICBjb25zdHJ1Y3RvcjogKEBlZGl0b3JFbGVtZW50LCBAdmltU3RhdGUsIEBzY3JvbGxvZmYpIC0+XG4gICAgQHNjcm9sbG9mZiA9IDIgIyBhdG9tIGRlZmF1bHRcbiAgICBzdXBlcihAZWRpdG9yRWxlbWVudC5nZXRNb2RlbCgpLCBAdmltU3RhdGUpXG5cbiAgbW92ZUN1cnNvcjogKGN1cnNvciwgY291bnQ9MSkgLT5cbiAgICB7cm93LCBjb2x1bW59ID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICBjdXJzb3Iuc2V0U2NyZWVuUG9zaXRpb24oW0BnZXREZXN0aW5hdGlvblJvdyhjb3VudCksIDBdKVxuXG5jbGFzcyBNb3ZlVG9CZWdpbm5pbmdPZkxpbmUgZXh0ZW5kcyBNb3Rpb25cbiAgbW92ZUN1cnNvcjogKGN1cnNvciwgY291bnQ9MSkgLT5cbiAgICBfLnRpbWVzIGNvdW50LCAtPlxuICAgICAgY3Vyc29yLm1vdmVUb0JlZ2lubmluZ09mTGluZSgpXG5cbmNsYXNzIE1vdmVUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lIGV4dGVuZHMgTW90aW9uXG4gIG1vdmVDdXJzb3I6IChjdXJzb3IsIGNvdW50PTEpIC0+XG4gICAgXy50aW1lcyBjb3VudCwgLT5cbiAgICAgIGN1cnNvci5tb3ZlVG9CZWdpbm5pbmdPZkxpbmUoKVxuICAgICAgY3Vyc29yLm1vdmVUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lKClcblxuY2xhc3MgTW92ZVRvRmlyc3RDaGFyYWN0ZXJPZkxpbmVBbmREb3duIGV4dGVuZHMgTW90aW9uXG4gIG9wZXJhdGVzTGluZXdpc2U6IHRydWVcblxuICBtb3ZlQ3Vyc29yOiAoY3Vyc29yLCBjb3VudD0xKSAtPlxuICAgIF8udGltZXMgY291bnQtMSwgLT5cbiAgICAgIGN1cnNvci5tb3ZlRG93bigpXG4gICAgY3Vyc29yLm1vdmVUb0JlZ2lubmluZ09mTGluZSgpXG4gICAgY3Vyc29yLm1vdmVUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lKClcblxuY2xhc3MgTW92ZVRvTGFzdENoYXJhY3Rlck9mTGluZSBleHRlbmRzIE1vdGlvblxuICBtb3ZlQ3Vyc29yOiAoY3Vyc29yLCBjb3VudD0xKSAtPlxuICAgIF8udGltZXMgY291bnQsIC0+XG4gICAgICBjdXJzb3IubW92ZVRvRW5kT2ZMaW5lKClcbiAgICAgIGN1cnNvci5nb2FsQ29sdW1uID0gSW5maW5pdHlcblxuY2xhc3MgTW92ZVRvTGFzdE5vbmJsYW5rQ2hhcmFjdGVyT2ZMaW5lQW5kRG93biBleHRlbmRzIE1vdGlvblxuICBvcGVyYXRlc0luY2x1c2l2ZWx5OiB0cnVlXG5cbiAgIyBtb3ZlcyBjdXJzb3IgdG8gdGhlIGxhc3Qgbm9uLXdoaXRlc3BhY2UgY2hhcmFjdGVyIG9uIHRoZSBsaW5lXG4gICMgc2ltaWxhciB0byBza2lwTGVhZGluZ1doaXRlc3BhY2UoKSBpbiBhdG9tJ3MgY3Vyc29yLmNvZmZlZVxuICBza2lwVHJhaWxpbmdXaGl0ZXNwYWNlOiAoY3Vyc29yKSAtPlxuICAgIHBvc2l0aW9uID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICBzY2FuUmFuZ2UgPSBjdXJzb3IuZ2V0Q3VycmVudExpbmVCdWZmZXJSYW5nZSgpXG4gICAgc3RhcnRPZlRyYWlsaW5nV2hpdGVzcGFjZSA9IFtzY2FuUmFuZ2UuZW5kLnJvdywgc2NhblJhbmdlLmVuZC5jb2x1bW4gLSAxXVxuICAgIEBlZGl0b3Iuc2NhbkluQnVmZmVyUmFuZ2UgL1sgXFx0XSskLywgc2NhblJhbmdlLCAoe3JhbmdlfSkgLT5cbiAgICAgIHN0YXJ0T2ZUcmFpbGluZ1doaXRlc3BhY2UgPSByYW5nZS5zdGFydFxuICAgICAgc3RhcnRPZlRyYWlsaW5nV2hpdGVzcGFjZS5jb2x1bW4gLT0gMVxuICAgIGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbihzdGFydE9mVHJhaWxpbmdXaGl0ZXNwYWNlKVxuXG4gIG1vdmVDdXJzb3I6IChjdXJzb3IsIGNvdW50PTEpIC0+XG4gICAgXy50aW1lcyBjb3VudC0xLCAtPlxuICAgICAgY3Vyc29yLm1vdmVEb3duKClcbiAgICBAc2tpcFRyYWlsaW5nV2hpdGVzcGFjZShjdXJzb3IpXG5cbmNsYXNzIE1vdmVUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lVXAgZXh0ZW5kcyBNb3Rpb25cbiAgb3BlcmF0ZXNMaW5ld2lzZTogdHJ1ZVxuXG4gIG1vdmVDdXJzb3I6IChjdXJzb3IsIGNvdW50PTEpIC0+XG4gICAgXy50aW1lcyBjb3VudCwgLT5cbiAgICAgIGN1cnNvci5tb3ZlVXAoKVxuICAgIGN1cnNvci5tb3ZlVG9CZWdpbm5pbmdPZkxpbmUoKVxuICAgIGN1cnNvci5tb3ZlVG9GaXJzdENoYXJhY3Rlck9mTGluZSgpXG5cbmNsYXNzIE1vdmVUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lRG93biBleHRlbmRzIE1vdGlvblxuICBvcGVyYXRlc0xpbmV3aXNlOiB0cnVlXG5cbiAgbW92ZUN1cnNvcjogKGN1cnNvciwgY291bnQ9MSkgLT5cbiAgICBfLnRpbWVzIGNvdW50LCAtPlxuICAgICAgY3Vyc29yLm1vdmVEb3duKClcbiAgICBjdXJzb3IubW92ZVRvQmVnaW5uaW5nT2ZMaW5lKClcbiAgICBjdXJzb3IubW92ZVRvRmlyc3RDaGFyYWN0ZXJPZkxpbmUoKVxuXG5jbGFzcyBNb3ZlVG9TdGFydE9mRmlsZSBleHRlbmRzIE1vdmVUb0xpbmVcbiAgbW92ZUN1cnNvcjogKGN1cnNvciwgY291bnQ9MSkgLT5cbiAgICB7cm93LCBjb2x1bW59ID0gQGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG4gICAgY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKFtAZ2V0RGVzdGluYXRpb25Sb3coY291bnQpLCAwXSlcbiAgICB1bmxlc3MgQGlzTGluZXdpc2UoKVxuICAgICAgY3Vyc29yLm1vdmVUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lKClcblxuY2xhc3MgTW92ZVRvVG9wT2ZTY3JlZW4gZXh0ZW5kcyBNb3ZlVG9TY3JlZW5MaW5lXG4gIGdldERlc3RpbmF0aW9uUm93OiAoY291bnQ9MCkgLT5cbiAgICBmaXJzdFNjcmVlblJvdyA9IEBlZGl0b3JFbGVtZW50LmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpXG4gICAgaWYgZmlyc3RTY3JlZW5Sb3cgPiAwXG4gICAgICBvZmZzZXQgPSBNYXRoLm1heChjb3VudCAtIDEsIEBzY3JvbGxvZmYpXG4gICAgZWxzZVxuICAgICAgb2Zmc2V0ID0gaWYgY291bnQgPiAwIHRoZW4gY291bnQgLSAxIGVsc2UgY291bnRcbiAgICBmaXJzdFNjcmVlblJvdyArIG9mZnNldFxuXG5jbGFzcyBNb3ZlVG9Cb3R0b21PZlNjcmVlbiBleHRlbmRzIE1vdmVUb1NjcmVlbkxpbmVcbiAgZ2V0RGVzdGluYXRpb25Sb3c6IChjb3VudD0wKSAtPlxuICAgIGxhc3RTY3JlZW5Sb3cgPSBAZWRpdG9yRWxlbWVudC5nZXRMYXN0VmlzaWJsZVNjcmVlblJvdygpXG4gICAgbGFzdFJvdyA9IEBlZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0TGFzdFJvdygpXG4gICAgaWYgbGFzdFNjcmVlblJvdyBpc250IGxhc3RSb3dcbiAgICAgIG9mZnNldCA9IE1hdGgubWF4KGNvdW50IC0gMSwgQHNjcm9sbG9mZilcbiAgICBlbHNlXG4gICAgICBvZmZzZXQgPSBpZiBjb3VudCA+IDAgdGhlbiBjb3VudCAtIDEgZWxzZSBjb3VudFxuICAgIGxhc3RTY3JlZW5Sb3cgLSBvZmZzZXRcblxuY2xhc3MgTW92ZVRvTWlkZGxlT2ZTY3JlZW4gZXh0ZW5kcyBNb3ZlVG9TY3JlZW5MaW5lXG4gIGdldERlc3RpbmF0aW9uUm93OiAtPlxuICAgIGZpcnN0U2NyZWVuUm93ID0gQGVkaXRvckVsZW1lbnQuZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93KClcbiAgICBsYXN0U2NyZWVuUm93ID0gQGVkaXRvckVsZW1lbnQuZ2V0TGFzdFZpc2libGVTY3JlZW5Sb3coKVxuICAgIGhlaWdodCA9IGxhc3RTY3JlZW5Sb3cgLSBmaXJzdFNjcmVlblJvd1xuICAgIE1hdGguZmxvb3IoZmlyc3RTY3JlZW5Sb3cgKyAoaGVpZ2h0IC8gMikpXG5cbmNsYXNzIFNjcm9sbEtlZXBpbmdDdXJzb3IgZXh0ZW5kcyBNb3Rpb25cbiAgb3BlcmF0ZXNMaW5ld2lzZTogdHJ1ZVxuICBjdXJzb3JSb3c6IG51bGxcblxuICBjb25zdHJ1Y3RvcjogKEBlZGl0b3JFbGVtZW50LCBAdmltU3RhdGUpIC0+XG4gICAgc3VwZXIoQGVkaXRvckVsZW1lbnQuZ2V0TW9kZWwoKSwgQHZpbVN0YXRlKVxuXG4gIHNlbGVjdDogKGNvdW50LCBvcHRpb25zKSAtPlxuICAgICMgVE9ETzogcmVtb3ZlIHRoaXMgY29uZGl0aW9uYWwgb25jZSBhZnRlciBBdG9tIHYxLjEuMCBpcyByZWxlYXNlZC5cbiAgICBpZiBAZWRpdG9yLnNldEZpcnN0VmlzaWJsZVNjcmVlblJvdz9cbiAgICAgIG5ld1RvcFJvdyA9IEBnZXROZXdGaXJzdFZpc2libGVTY3JlZW5Sb3coY291bnQpXG4gICAgICBzdXBlcihjb3VudCwgb3B0aW9ucylcbiAgICAgIEBlZGl0b3Iuc2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93KG5ld1RvcFJvdylcbiAgICBlbHNlXG4gICAgICBzY3JvbGxUb3AgPSBAZ2V0TmV3U2Nyb2xsVG9wKGNvdW50KVxuICAgICAgc3VwZXIoY291bnQsIG9wdGlvbnMpXG4gICAgICBAZWRpdG9yRWxlbWVudC5zZXRTY3JvbGxUb3Aoc2Nyb2xsVG9wKVxuXG4gIGV4ZWN1dGU6IChjb3VudCkgLT5cbiAgICAjIFRPRE86IHJlbW92ZSB0aGlzIGNvbmRpdGlvbmFsIG9uY2UgYWZ0ZXIgQXRvbSB2MS4xLjAgaXMgcmVsZWFzZWQuXG4gICAgaWYgQGVkaXRvci5zZXRGaXJzdFZpc2libGVTY3JlZW5Sb3c/XG4gICAgICBuZXdUb3BSb3cgPSBAZ2V0TmV3Rmlyc3RWaXNpYmxlU2NyZWVuUm93KGNvdW50KVxuICAgICAgc3VwZXIoY291bnQpXG4gICAgICBAZWRpdG9yLnNldEZpcnN0VmlzaWJsZVNjcmVlblJvdyhuZXdUb3BSb3cpXG4gICAgZWxzZVxuICAgICAgc2Nyb2xsVG9wID0gQGdldE5ld1Njcm9sbFRvcChjb3VudClcbiAgICAgIHN1cGVyKGNvdW50KVxuICAgICAgQGVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsVG9wKHNjcm9sbFRvcClcblxuICBtb3ZlQ3Vyc29yOiAoY3Vyc29yKSAtPlxuICAgIGN1cnNvci5zZXRTY3JlZW5Qb3NpdGlvbihQb2ludChAY3Vyc29yUm93LCAwKSwgYXV0b3Njcm9sbDogZmFsc2UpXG5cbiAgIyBUT0RPOiByZW1vdmUgdGhpcyBtZXRob2Qgb25jZSBhZnRlciBBdG9tIHYxLjEuMCBpcyByZWxlYXNlZC5cbiAgZ2V0TmV3U2Nyb2xsVG9wOiAoY291bnQ9MSkgLT5cbiAgICBjdXJyZW50U2Nyb2xsVG9wID0gQGVkaXRvckVsZW1lbnQuY29tcG9uZW50LnByZXNlbnRlci5wZW5kaW5nU2Nyb2xsVG9wID8gQGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wKClcbiAgICBjdXJyZW50Q3Vyc29yUm93ID0gQGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpLnJvd1xuICAgIHJvd3NQZXJQYWdlID0gQGVkaXRvci5nZXRSb3dzUGVyUGFnZSgpXG4gICAgbGluZUhlaWdodCA9IEBlZGl0b3IuZ2V0TGluZUhlaWdodEluUGl4ZWxzKClcbiAgICBzY3JvbGxSb3dzID0gTWF0aC5mbG9vcihAcGFnZVNjcm9sbEZyYWN0aW9uICogcm93c1BlclBhZ2UgKiBjb3VudClcbiAgICBAY3Vyc29yUm93ID0gY3VycmVudEN1cnNvclJvdyArIHNjcm9sbFJvd3NcbiAgICBjdXJyZW50U2Nyb2xsVG9wICsgc2Nyb2xsUm93cyAqIGxpbmVIZWlnaHRcblxuICBnZXROZXdGaXJzdFZpc2libGVTY3JlZW5Sb3c6IChjb3VudD0xKSAtPlxuICAgIGN1cnJlbnRUb3BSb3cgPSBAZWRpdG9yLmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpXG4gICAgY3VycmVudEN1cnNvclJvdyA9IEBlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKS5yb3dcbiAgICByb3dzUGVyUGFnZSA9IEBlZGl0b3IuZ2V0Um93c1BlclBhZ2UoKVxuICAgIHNjcm9sbFJvd3MgPSBNYXRoLmNlaWwoQHBhZ2VTY3JvbGxGcmFjdGlvbiAqIHJvd3NQZXJQYWdlICogY291bnQpXG4gICAgQGN1cnNvclJvdyA9IGN1cnJlbnRDdXJzb3JSb3cgKyBzY3JvbGxSb3dzXG4gICAgY3VycmVudFRvcFJvdyArIHNjcm9sbFJvd3NcblxuY2xhc3MgU2Nyb2xsSGFsZlVwS2VlcEN1cnNvciBleHRlbmRzIFNjcm9sbEtlZXBpbmdDdXJzb3JcbiAgcGFnZVNjcm9sbEZyYWN0aW9uOiAtMSAvIDJcblxuY2xhc3MgU2Nyb2xsRnVsbFVwS2VlcEN1cnNvciBleHRlbmRzIFNjcm9sbEtlZXBpbmdDdXJzb3JcbiAgcGFnZVNjcm9sbEZyYWN0aW9uOiAtMVxuXG5jbGFzcyBTY3JvbGxIYWxmRG93bktlZXBDdXJzb3IgZXh0ZW5kcyBTY3JvbGxLZWVwaW5nQ3Vyc29yXG4gIHBhZ2VTY3JvbGxGcmFjdGlvbjogMSAvIDJcblxuY2xhc3MgU2Nyb2xsRnVsbERvd25LZWVwQ3Vyc29yIGV4dGVuZHMgU2Nyb2xsS2VlcGluZ0N1cnNvclxuICBwYWdlU2Nyb2xsRnJhY3Rpb246IDFcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIE1vdGlvbiwgTW90aW9uV2l0aElucHV0LCBDdXJyZW50U2VsZWN0aW9uLCBNb3ZlTGVmdCwgTW92ZVJpZ2h0LCBNb3ZlVXAsIE1vdmVEb3duLFxuICBNb3ZlVG9QcmV2aW91c1dvcmQsIE1vdmVUb1ByZXZpb3VzV2hvbGVXb3JkLCBNb3ZlVG9OZXh0V29yZCwgTW92ZVRvTmV4dFdob2xlV29yZCxcbiAgTW92ZVRvRW5kT2ZXb3JkLCBNb3ZlVG9OZXh0U2VudGVuY2UsIE1vdmVUb1ByZXZpb3VzU2VudGVuY2UsIE1vdmVUb05leHRQYXJhZ3JhcGgsIE1vdmVUb1ByZXZpb3VzUGFyYWdyYXBoLCBNb3ZlVG9BYnNvbHV0ZUxpbmUsIE1vdmVUb1JlbGF0aXZlTGluZSwgTW92ZVRvQmVnaW5uaW5nT2ZMaW5lLFxuICBNb3ZlVG9GaXJzdENoYXJhY3Rlck9mTGluZVVwLCBNb3ZlVG9GaXJzdENoYXJhY3Rlck9mTGluZURvd24sXG4gIE1vdmVUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lLCBNb3ZlVG9GaXJzdENoYXJhY3Rlck9mTGluZUFuZERvd24sIE1vdmVUb0xhc3RDaGFyYWN0ZXJPZkxpbmUsXG4gIE1vdmVUb0xhc3ROb25ibGFua0NoYXJhY3Rlck9mTGluZUFuZERvd24sIE1vdmVUb1N0YXJ0T2ZGaWxlLFxuICBNb3ZlVG9Ub3BPZlNjcmVlbiwgTW92ZVRvQm90dG9tT2ZTY3JlZW4sIE1vdmVUb01pZGRsZU9mU2NyZWVuLCBNb3ZlVG9FbmRPZldob2xlV29yZCwgTW90aW9uRXJyb3IsXG4gIFNjcm9sbEhhbGZVcEtlZXBDdXJzb3IsIFNjcm9sbEZ1bGxVcEtlZXBDdXJzb3IsXG4gIFNjcm9sbEhhbGZEb3duS2VlcEN1cnNvciwgU2Nyb2xsRnVsbERvd25LZWVwQ3Vyc29yXG59XG4iXX0=
