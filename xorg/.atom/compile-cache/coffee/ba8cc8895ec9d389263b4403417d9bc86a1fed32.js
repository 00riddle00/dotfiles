(function() {
  var Delete, Join, LowerCase, Mark, Operator, OperatorError, OperatorWithInput, Point, Range, Repeat, ToggleCase, UpperCase, Utils, ViewModel, Yank, _, ref, settings,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require('underscore-plus');

  ref = require('atom'), Point = ref.Point, Range = ref.Range;

  ViewModel = require('../view-models/view-model').ViewModel;

  Utils = require('../utils');

  settings = require('../settings');

  OperatorError = (function() {
    function OperatorError(message) {
      this.message = message;
      this.name = 'Operator Error';
    }

    return OperatorError;

  })();

  Operator = (function() {
    Operator.prototype.vimState = null;

    Operator.prototype.motion = null;

    Operator.prototype.complete = null;

    function Operator(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.complete = false;
    }

    Operator.prototype.isComplete = function() {
      return this.complete;
    };

    Operator.prototype.isRecordable = function() {
      return true;
    };

    Operator.prototype.compose = function(motion) {
      if (!motion.select) {
        throw new OperatorError('Must compose with a motion');
      }
      this.motion = motion;
      return this.complete = true;
    };

    Operator.prototype.canComposeWith = function(operation) {
      return operation.select != null;
    };

    Operator.prototype.setTextRegister = function(register, text) {
      var ref1, type;
      if ((ref1 = this.motion) != null ? typeof ref1.isLinewise === "function" ? ref1.isLinewise() : void 0 : void 0) {
        type = 'linewise';
        if (text.slice(-1) !== '\n') {
          text += '\n';
        }
      } else {
        type = Utils.copyType(text);
      }
      if (text !== '') {
        return this.vimState.setRegister(register, {
          text: text,
          type: type
        });
      }
    };

    return Operator;

  })();

  OperatorWithInput = (function(superClass) {
    extend(OperatorWithInput, superClass);

    function OperatorWithInput(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.editor = this.editor;
      this.complete = false;
    }

    OperatorWithInput.prototype.canComposeWith = function(operation) {
      return (operation.characters != null) || (operation.select != null);
    };

    OperatorWithInput.prototype.compose = function(operation) {
      if (operation.select != null) {
        this.motion = operation;
      }
      if (operation.characters != null) {
        this.input = operation;
        return this.complete = true;
      }
    };

    return OperatorWithInput;

  })(Operator);

  Delete = (function(superClass) {
    extend(Delete, superClass);

    Delete.prototype.register = null;

    function Delete(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.complete = false;
      this.register = settings.defaultRegister();
    }

    Delete.prototype.execute = function(count) {
      var base, cursor, j, len, ref1;
      if (_.contains(this.motion.select(count), true)) {
        this.setTextRegister(this.register, this.editor.getSelectedText());
        this.editor.transact((function(_this) {
          return function() {
            var j, len, ref1, results, selection;
            ref1 = _this.editor.getSelections();
            results = [];
            for (j = 0, len = ref1.length; j < len; j++) {
              selection = ref1[j];
              results.push(selection.deleteSelectedText());
            }
            return results;
          };
        })(this));
        ref1 = this.editor.getCursors();
        for (j = 0, len = ref1.length; j < len; j++) {
          cursor = ref1[j];
          if (typeof (base = this.motion).isLinewise === "function" ? base.isLinewise() : void 0) {
            cursor.skipLeadingWhitespace();
          } else {
            if (cursor.isAtEndOfLine() && !cursor.isAtBeginningOfLine()) {
              cursor.moveLeft();
            }
          }
        }
      }
      return this.vimState.activateNormalMode();
    };

    return Delete;

  })(Operator);

  ToggleCase = (function(superClass) {
    extend(ToggleCase, superClass);

    function ToggleCase(editor, vimState, arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.complete = (arg != null ? arg : {}).complete;
    }

    ToggleCase.prototype.execute = function(count) {
      if (this.motion != null) {
        if (_.contains(this.motion.select(count), true)) {
          this.editor.replaceSelectedText({}, function(text) {
            return text.split('').map(function(char) {
              var lower;
              lower = char.toLowerCase();
              if (char === lower) {
                return char.toUpperCase();
              } else {
                return lower;
              }
            }).join('');
          });
        }
      } else {
        this.editor.transact((function(_this) {
          return function() {
            var cursor, cursorCount, j, len, lineLength, point, ref1, results;
            ref1 = _this.editor.getCursors();
            results = [];
            for (j = 0, len = ref1.length; j < len; j++) {
              cursor = ref1[j];
              point = cursor.getBufferPosition();
              lineLength = _this.editor.lineTextForBufferRow(point.row).length;
              cursorCount = Math.min(count != null ? count : 1, lineLength - point.column);
              results.push(_.times(cursorCount, function() {
                var char, range;
                point = cursor.getBufferPosition();
                range = Range.fromPointWithDelta(point, 0, 1);
                char = _this.editor.getTextInBufferRange(range);
                if (char === char.toLowerCase()) {
                  _this.editor.setTextInBufferRange(range, char.toUpperCase());
                } else {
                  _this.editor.setTextInBufferRange(range, char.toLowerCase());
                }
                if (!(point.column >= lineLength - 1)) {
                  return cursor.moveRight();
                }
              }));
            }
            return results;
          };
        })(this));
      }
      return this.vimState.activateNormalMode();
    };

    return ToggleCase;

  })(Operator);

  UpperCase = (function(superClass) {
    extend(UpperCase, superClass);

    function UpperCase(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.complete = false;
    }

    UpperCase.prototype.execute = function(count) {
      if (_.contains(this.motion.select(count), true)) {
        this.editor.replaceSelectedText({}, function(text) {
          return text.toUpperCase();
        });
      }
      return this.vimState.activateNormalMode();
    };

    return UpperCase;

  })(Operator);

  LowerCase = (function(superClass) {
    extend(LowerCase, superClass);

    function LowerCase(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.complete = false;
    }

    LowerCase.prototype.execute = function(count) {
      if (_.contains(this.motion.select(count), true)) {
        this.editor.replaceSelectedText({}, function(text) {
          return text.toLowerCase();
        });
      }
      return this.vimState.activateNormalMode();
    };

    return LowerCase;

  })(Operator);

  Yank = (function(superClass) {
    extend(Yank, superClass);

    Yank.prototype.register = null;

    function Yank(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.editorElement = atom.views.getView(this.editor);
      this.register = settings.defaultRegister();
    }

    Yank.prototype.execute = function(count) {
      var i, newPositions, oldLastCursorPosition, oldLeft, oldTop, originalPosition, originalPositions, position, startPositions, text;
      oldTop = this.editorElement.getScrollTop();
      oldLeft = this.editorElement.getScrollLeft();
      oldLastCursorPosition = this.editor.getCursorBufferPosition();
      originalPositions = this.editor.getCursorBufferPositions();
      if (_.contains(this.motion.select(count), true)) {
        text = this.editor.getSelectedText();
        startPositions = _.pluck(this.editor.getSelectedBufferRanges(), "start");
        newPositions = (function() {
          var base, j, len, results;
          results = [];
          for (i = j = 0, len = originalPositions.length; j < len; i = ++j) {
            originalPosition = originalPositions[i];
            if (startPositions[i]) {
              position = Point.min(startPositions[i], originalPositions[i]);
              if (this.vimState.mode !== 'visual' && (typeof (base = this.motion).isLinewise === "function" ? base.isLinewise() : void 0)) {
                position = new Point(position.row, originalPositions[i].column);
              }
              results.push(position);
            } else {
              results.push(originalPosition);
            }
          }
          return results;
        }).call(this);
      } else {
        text = '';
        newPositions = originalPositions;
      }
      this.setTextRegister(this.register, text);
      this.editor.setSelectedBufferRanges(newPositions.map(function(p) {
        return new Range(p, p);
      }));
      if (oldLastCursorPosition.isEqual(this.editor.getCursorBufferPosition())) {
        this.editorElement.setScrollLeft(oldLeft);
        this.editorElement.setScrollTop(oldTop);
      }
      return this.vimState.activateNormalMode();
    };

    return Yank;

  })(Operator);

  Join = (function(superClass) {
    extend(Join, superClass);

    function Join(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.complete = true;
    }

    Join.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.editor.transact((function(_this) {
        return function() {
          return _.times(count, function() {
            return _this.editor.joinLines();
          });
        };
      })(this));
      return this.vimState.activateNormalMode();
    };

    return Join;

  })(Operator);

  Repeat = (function(superClass) {
    extend(Repeat, superClass);

    function Repeat(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.complete = true;
    }

    Repeat.prototype.isRecordable = function() {
      return false;
    };

    Repeat.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.editor.transact((function(_this) {
        return function() {
          return _.times(count, function() {
            var cmd;
            cmd = _this.vimState.history[0];
            return cmd != null ? cmd.execute() : void 0;
          });
        };
      })(this));
    };

    return Repeat;

  })(Operator);

  Mark = (function(superClass) {
    extend(Mark, superClass);

    function Mark(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      Mark.__super__.constructor.call(this, this.editor, this.vimState);
      this.viewModel = new ViewModel(this, {
        "class": 'mark',
        singleChar: true,
        hidden: true
      });
    }

    Mark.prototype.execute = function() {
      this.vimState.setMark(this.input.characters, this.editor.getCursorBufferPosition());
      return this.vimState.activateNormalMode();
    };

    return Mark;

  })(OperatorWithInput);

  module.exports = {
    Operator: Operator,
    OperatorWithInput: OperatorWithInput,
    OperatorError: OperatorError,
    Delete: Delete,
    ToggleCase: ToggleCase,
    UpperCase: UpperCase,
    LowerCase: LowerCase,
    Yank: Yank,
    Join: Join,
    Repeat: Repeat,
    Mark: Mark
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9vcGVyYXRvcnMvZ2VuZXJhbC1vcGVyYXRvcnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxnS0FBQTtJQUFBOzs7RUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSOztFQUNKLE1BQWlCLE9BQUEsQ0FBUSxNQUFSLENBQWpCLEVBQUMsaUJBQUQsRUFBUTs7RUFDUCxZQUFhLE9BQUEsQ0FBUSwyQkFBUjs7RUFDZCxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVI7O0VBQ1IsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUVMO0lBQ1MsdUJBQUMsT0FBRDtNQUFDLElBQUMsQ0FBQSxVQUFEO01BQ1osSUFBQyxDQUFBLElBQUQsR0FBUTtJQURHOzs7Ozs7RUFHVDt1QkFDSixRQUFBLEdBQVU7O3VCQUNWLE1BQUEsR0FBUTs7dUJBQ1IsUUFBQSxHQUFVOztJQUVHLGtCQUFDLE1BQUQsRUFBVSxRQUFWO01BQUMsSUFBQyxDQUFBLFNBQUQ7TUFBUyxJQUFDLENBQUEsV0FBRDtNQUNyQixJQUFDLENBQUEsUUFBRCxHQUFZO0lBREQ7O3VCQU1iLFVBQUEsR0FBWSxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUo7O3VCQU1aLFlBQUEsR0FBYyxTQUFBO2FBQUc7SUFBSDs7dUJBT2QsT0FBQSxHQUFTLFNBQUMsTUFBRDtNQUNQLElBQUcsQ0FBSSxNQUFNLENBQUMsTUFBZDtBQUNFLGNBQVUsSUFBQSxhQUFBLENBQWMsNEJBQWQsRUFEWjs7TUFHQSxJQUFDLENBQUEsTUFBRCxHQUFVO2FBQ1YsSUFBQyxDQUFBLFFBQUQsR0FBWTtJQUxMOzt1QkFPVCxjQUFBLEdBQWdCLFNBQUMsU0FBRDthQUFlO0lBQWY7O3VCQUtoQixlQUFBLEdBQWlCLFNBQUMsUUFBRCxFQUFXLElBQVg7QUFDZixVQUFBO01BQUEsK0VBQVUs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QUFBLFFBQVEsQ0FBQyxrQkFBVixDQUFBO0lBRk87Ozs7S0FUUTs7RUFhbkIsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFDZixVQUFBLFFBRGU7SUFDTCxtQkFBQSxpQkFESztJQUNjLGVBQUEsYUFEZDtJQUM2QixRQUFBLE1BRDdCO0lBQ3FDLFlBQUEsVUFEckM7SUFFZixXQUFBLFNBRmU7SUFFSixXQUFBLFNBRkk7SUFFTyxNQUFBLElBRlA7SUFFYSxNQUFBLElBRmI7SUFFbUIsUUFBQSxNQUZuQjtJQUUyQixNQUFBLElBRjNCOztBQWpRakIiLCJzb3VyY2VzQ29udGVudCI6WyJfID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xue1BvaW50LCBSYW5nZX0gPSByZXF1aXJlICdhdG9tJ1xue1ZpZXdNb2RlbH0gPSByZXF1aXJlICcuLi92aWV3LW1vZGVscy92aWV3LW1vZGVsJ1xuVXRpbHMgPSByZXF1aXJlICcuLi91dGlscydcbnNldHRpbmdzID0gcmVxdWlyZSAnLi4vc2V0dGluZ3MnXG5cbmNsYXNzIE9wZXJhdG9yRXJyb3JcbiAgY29uc3RydWN0b3I6IChAbWVzc2FnZSkgLT5cbiAgICBAbmFtZSA9ICdPcGVyYXRvciBFcnJvcidcblxuY2xhc3MgT3BlcmF0b3JcbiAgdmltU3RhdGU6IG51bGxcbiAgbW90aW9uOiBudWxsXG4gIGNvbXBsZXRlOiBudWxsXG5cbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBAdmltU3RhdGUpIC0+XG4gICAgQGNvbXBsZXRlID0gZmFsc2VcblxuICAjIFB1YmxpYzogRGV0ZXJtaW5lcyB3aGVuIHRoZSBjb21tYW5kIGNhbiBiZSBleGVjdXRlZC5cbiAgI1xuICAjIFJldHVybnMgdHJ1ZSBpZiByZWFkeSB0byBleGVjdXRlIGFuZCBmYWxzZSBvdGhlcndpc2UuXG4gIGlzQ29tcGxldGU6IC0+IEBjb21wbGV0ZVxuXG4gICMgUHVibGljOiBEZXRlcm1pbmVzIGlmIHRoaXMgY29tbWFuZCBzaG91bGQgYmUgcmVjb3JkZWQgaW4gdGhlIGNvbW1hbmRcbiAgIyBoaXN0b3J5IGZvciByZXBlYXRzLlxuICAjXG4gICMgUmV0dXJucyB0cnVlIGlmIHRoaXMgY29tbWFuZCBzaG91bGQgYmUgcmVjb3JkZWQuXG4gIGlzUmVjb3JkYWJsZTogLT4gdHJ1ZVxuXG4gICMgUHVibGljOiBNYXJrcyB0aGlzIGFzIHJlYWR5IHRvIGV4ZWN1dGUgYW5kIHNhdmVzIHRoZSBtb3Rpb24uXG4gICNcbiAgIyBtb3Rpb24gLSBUaGUgbW90aW9uIHVzZWQgdG8gc2VsZWN0IHdoYXQgdG8gb3BlcmF0ZSBvbi5cbiAgI1xuICAjIFJldHVybnMgbm90aGluZy5cbiAgY29tcG9zZTogKG1vdGlvbikgLT5cbiAgICBpZiBub3QgbW90aW9uLnNlbGVjdFxuICAgICAgdGhyb3cgbmV3IE9wZXJhdG9yRXJyb3IoJ011c3QgY29tcG9zZSB3aXRoIGEgbW90aW9uJylcblxuICAgIEBtb3Rpb24gPSBtb3Rpb25cbiAgICBAY29tcGxldGUgPSB0cnVlXG5cbiAgY2FuQ29tcG9zZVdpdGg6IChvcGVyYXRpb24pIC0+IG9wZXJhdGlvbi5zZWxlY3Q/XG5cbiAgIyBQdWJsaWM6IFByZXBzIHRleHQgYW5kIHNldHMgdGhlIHRleHQgcmVnaXN0ZXJcbiAgI1xuICAjIFJldHVybnMgbm90aGluZ1xuICBzZXRUZXh0UmVnaXN0ZXI6IChyZWdpc3RlciwgdGV4dCkgLT5cbiAgICBpZiBAbW90aW9uPy5pc0xpbmV3aXNlPygpXG4gICAgICB0eXBlID0gJ2xpbmV3aXNlJ1xuICAgICAgaWYgdGV4dFstMS4uXSBpc250ICdcXG4nXG4gICAgICAgIHRleHQgKz0gJ1xcbidcbiAgICBlbHNlXG4gICAgICB0eXBlID0gVXRpbHMuY29weVR5cGUodGV4dClcbiAgICBAdmltU3RhdGUuc2V0UmVnaXN0ZXIocmVnaXN0ZXIsIHt0ZXh0LCB0eXBlfSkgdW5sZXNzIHRleHQgaXMgJydcblxuIyBQdWJsaWM6IEdlbmVyaWMgY2xhc3MgZm9yIGFuIG9wZXJhdG9yIHRoYXQgcmVxdWlyZXMgZXh0cmEgaW5wdXRcbmNsYXNzIE9wZXJhdG9yV2l0aElucHV0IGV4dGVuZHMgT3BlcmF0b3JcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBAdmltU3RhdGUpIC0+XG4gICAgQGVkaXRvciA9IEBlZGl0b3JcbiAgICBAY29tcGxldGUgPSBmYWxzZVxuXG4gIGNhbkNvbXBvc2VXaXRoOiAob3BlcmF0aW9uKSAtPiBvcGVyYXRpb24uY2hhcmFjdGVycz8gb3Igb3BlcmF0aW9uLnNlbGVjdD9cblxuICBjb21wb3NlOiAob3BlcmF0aW9uKSAtPlxuICAgIGlmIG9wZXJhdGlvbi5zZWxlY3Q/XG4gICAgICBAbW90aW9uID0gb3BlcmF0aW9uXG4gICAgaWYgb3BlcmF0aW9uLmNoYXJhY3RlcnM/XG4gICAgICBAaW5wdXQgPSBvcGVyYXRpb25cbiAgICAgIEBjb21wbGV0ZSA9IHRydWVcblxuI1xuIyBJdCBkZWxldGVzIGV2ZXJ5dGhpbmcgc2VsZWN0ZWQgYnkgdGhlIGZvbGxvd2luZyBtb3Rpb24uXG4jXG5jbGFzcyBEZWxldGUgZXh0ZW5kcyBPcGVyYXRvclxuICByZWdpc3RlcjogbnVsbFxuXG4gIGNvbnN0cnVjdG9yOiAoQGVkaXRvciwgQHZpbVN0YXRlKSAtPlxuICAgIEBjb21wbGV0ZSA9IGZhbHNlXG4gICAgQHJlZ2lzdGVyID0gc2V0dGluZ3MuZGVmYXVsdFJlZ2lzdGVyKClcblxuICAjIFB1YmxpYzogRGVsZXRlcyB0aGUgdGV4dCBzZWxlY3RlZCBieSB0aGUgZ2l2ZW4gbW90aW9uLlxuICAjXG4gICMgY291bnQgLSBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGV4ZWN1dGUuXG4gICNcbiAgIyBSZXR1cm5zIG5vdGhpbmcuXG4gIGV4ZWN1dGU6IChjb3VudCkgLT5cbiAgICBpZiBfLmNvbnRhaW5zKEBtb3Rpb24uc2VsZWN0KGNvdW50KSwgdHJ1ZSlcbiAgICAgIEBzZXRUZXh0UmVnaXN0ZXIoQHJlZ2lzdGVyLCBAZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpKVxuICAgICAgQGVkaXRvci50cmFuc2FjdCA9PlxuICAgICAgICBmb3Igc2VsZWN0aW9uIGluIEBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gICAgICAgICAgc2VsZWN0aW9uLmRlbGV0ZVNlbGVjdGVkVGV4dCgpXG4gICAgICBmb3IgY3Vyc29yIGluIEBlZGl0b3IuZ2V0Q3Vyc29ycygpXG4gICAgICAgIGlmIEBtb3Rpb24uaXNMaW5ld2lzZT8oKVxuICAgICAgICAgIGN1cnNvci5za2lwTGVhZGluZ1doaXRlc3BhY2UoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgY3Vyc29yLm1vdmVMZWZ0KCkgaWYgY3Vyc29yLmlzQXRFbmRPZkxpbmUoKSBhbmQgbm90IGN1cnNvci5pc0F0QmVnaW5uaW5nT2ZMaW5lKClcblxuICAgIEB2aW1TdGF0ZS5hY3RpdmF0ZU5vcm1hbE1vZGUoKVxuXG4jXG4jIEl0IHRvZ2dsZXMgdGhlIGNhc2Ugb2YgZXZlcnl0aGluZyBzZWxlY3RlZCBieSB0aGUgZm9sbG93aW5nIG1vdGlvblxuI1xuY2xhc3MgVG9nZ2xlQ2FzZSBleHRlbmRzIE9wZXJhdG9yXG4gIGNvbnN0cnVjdG9yOiAoQGVkaXRvciwgQHZpbVN0YXRlLCB7QGNvbXBsZXRlfT17fSkgLT5cblxuICBleGVjdXRlOiAoY291bnQpIC0+XG4gICAgaWYgQG1vdGlvbj9cbiAgICAgIGlmIF8uY29udGFpbnMoQG1vdGlvbi5zZWxlY3QoY291bnQpLCB0cnVlKVxuICAgICAgICBAZWRpdG9yLnJlcGxhY2VTZWxlY3RlZFRleHQge30sICh0ZXh0KSAtPlxuICAgICAgICAgIHRleHQuc3BsaXQoJycpLm1hcCgoY2hhcikgLT5cbiAgICAgICAgICAgIGxvd2VyID0gY2hhci50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICBpZiBjaGFyIGlzIGxvd2VyXG4gICAgICAgICAgICAgIGNoYXIudG9VcHBlckNhc2UoKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBsb3dlclxuICAgICAgICAgICkuam9pbignJylcbiAgICBlbHNlXG4gICAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICAgIGZvciBjdXJzb3IgaW4gQGVkaXRvci5nZXRDdXJzb3JzKClcbiAgICAgICAgICBwb2ludCA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgICAgICAgbGluZUxlbmd0aCA9IEBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cocG9pbnQucm93KS5sZW5ndGhcbiAgICAgICAgICBjdXJzb3JDb3VudCA9IE1hdGgubWluKGNvdW50ID8gMSwgbGluZUxlbmd0aCAtIHBvaW50LmNvbHVtbilcblxuICAgICAgICAgIF8udGltZXMgY3Vyc29yQ291bnQsID0+XG4gICAgICAgICAgICBwb2ludCA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgICAgICAgICByYW5nZSA9IFJhbmdlLmZyb21Qb2ludFdpdGhEZWx0YShwb2ludCwgMCwgMSlcbiAgICAgICAgICAgIGNoYXIgPSBAZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlKVxuXG4gICAgICAgICAgICBpZiBjaGFyIGlzIGNoYXIudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICBAZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlLCBjaGFyLnRvVXBwZXJDYXNlKCkpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIEBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UsIGNoYXIudG9Mb3dlckNhc2UoKSlcblxuICAgICAgICAgICAgY3Vyc29yLm1vdmVSaWdodCgpIHVubGVzcyBwb2ludC5jb2x1bW4gPj0gbGluZUxlbmd0aCAtIDFcblxuICAgIEB2aW1TdGF0ZS5hY3RpdmF0ZU5vcm1hbE1vZGUoKVxuXG4jXG4jIEluIHZpc3VhbCBtb2RlIG9yIGFmdGVyIGBnYCB3aXRoIGEgbW90aW9uLCBpdCBtYWtlcyB0aGUgc2VsZWN0aW9uIHVwcGVyY2FzZVxuI1xuY2xhc3MgVXBwZXJDYXNlIGV4dGVuZHMgT3BlcmF0b3JcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBAdmltU3RhdGUpIC0+XG4gICAgQGNvbXBsZXRlID0gZmFsc2VcblxuICBleGVjdXRlOiAoY291bnQpIC0+XG4gICAgaWYgXy5jb250YWlucyhAbW90aW9uLnNlbGVjdChjb3VudCksIHRydWUpXG4gICAgICBAZWRpdG9yLnJlcGxhY2VTZWxlY3RlZFRleHQge30sICh0ZXh0KSAtPlxuICAgICAgICB0ZXh0LnRvVXBwZXJDYXNlKClcblxuICAgIEB2aW1TdGF0ZS5hY3RpdmF0ZU5vcm1hbE1vZGUoKVxuXG4jXG4jIEluIHZpc3VhbCBtb2RlIG9yIGFmdGVyIGBnYCB3aXRoIGEgbW90aW9uLCBpdCBtYWtlcyB0aGUgc2VsZWN0aW9uIGxvd2VyY2FzZVxuI1xuY2xhc3MgTG93ZXJDYXNlIGV4dGVuZHMgT3BlcmF0b3JcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBAdmltU3RhdGUpIC0+XG4gICAgQGNvbXBsZXRlID0gZmFsc2VcblxuICBleGVjdXRlOiAoY291bnQpIC0+XG4gICAgaWYgXy5jb250YWlucyhAbW90aW9uLnNlbGVjdChjb3VudCksIHRydWUpXG4gICAgICBAZWRpdG9yLnJlcGxhY2VTZWxlY3RlZFRleHQge30sICh0ZXh0KSAtPlxuICAgICAgICB0ZXh0LnRvTG93ZXJDYXNlKClcblxuICAgIEB2aW1TdGF0ZS5hY3RpdmF0ZU5vcm1hbE1vZGUoKVxuXG4jXG4jIEl0IGNvcGllcyBldmVyeXRoaW5nIHNlbGVjdGVkIGJ5IHRoZSBmb2xsb3dpbmcgbW90aW9uLlxuI1xuY2xhc3MgWWFuayBleHRlbmRzIE9wZXJhdG9yXG4gIHJlZ2lzdGVyOiBudWxsXG5cbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBAdmltU3RhdGUpIC0+XG4gICAgQGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoQGVkaXRvcilcbiAgICBAcmVnaXN0ZXIgPSBzZXR0aW5ncy5kZWZhdWx0UmVnaXN0ZXIoKVxuXG4gICMgUHVibGljOiBDb3BpZXMgdGhlIHRleHQgc2VsZWN0ZWQgYnkgdGhlIGdpdmVuIG1vdGlvbi5cbiAgI1xuICAjIGNvdW50IC0gVGhlIG51bWJlciBvZiB0aW1lcyB0byBleGVjdXRlLlxuICAjXG4gICMgUmV0dXJucyBub3RoaW5nLlxuICBleGVjdXRlOiAoY291bnQpIC0+XG4gICAgb2xkVG9wID0gQGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wKClcbiAgICBvbGRMZWZ0ID0gQGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsTGVmdCgpXG4gICAgb2xkTGFzdEN1cnNvclBvc2l0aW9uID0gQGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG5cbiAgICBvcmlnaW5hbFBvc2l0aW9ucyA9IEBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb25zKClcbiAgICBpZiBfLmNvbnRhaW5zKEBtb3Rpb24uc2VsZWN0KGNvdW50KSwgdHJ1ZSlcbiAgICAgIHRleHQgPSBAZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpXG4gICAgICBzdGFydFBvc2l0aW9ucyA9IF8ucGx1Y2soQGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpLCBcInN0YXJ0XCIpXG4gICAgICBuZXdQb3NpdGlvbnMgPSBmb3Igb3JpZ2luYWxQb3NpdGlvbiwgaSBpbiBvcmlnaW5hbFBvc2l0aW9uc1xuICAgICAgICBpZiBzdGFydFBvc2l0aW9uc1tpXVxuICAgICAgICAgIHBvc2l0aW9uID0gUG9pbnQubWluKHN0YXJ0UG9zaXRpb25zW2ldLCBvcmlnaW5hbFBvc2l0aW9uc1tpXSlcbiAgICAgICAgICBpZiBAdmltU3RhdGUubW9kZSBpc250ICd2aXN1YWwnIGFuZCBAbW90aW9uLmlzTGluZXdpc2U/KClcbiAgICAgICAgICAgIHBvc2l0aW9uID0gbmV3IFBvaW50KHBvc2l0aW9uLnJvdywgb3JpZ2luYWxQb3NpdGlvbnNbaV0uY29sdW1uKVxuICAgICAgICAgIHBvc2l0aW9uXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBvcmlnaW5hbFBvc2l0aW9uXG4gICAgZWxzZVxuICAgICAgdGV4dCA9ICcnXG4gICAgICBuZXdQb3NpdGlvbnMgPSBvcmlnaW5hbFBvc2l0aW9uc1xuXG4gICAgQHNldFRleHRSZWdpc3RlcihAcmVnaXN0ZXIsIHRleHQpXG5cbiAgICBAZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKG5ld1Bvc2l0aW9ucy5tYXAgKHApIC0+IG5ldyBSYW5nZShwLCBwKSlcblxuICAgIGlmIG9sZExhc3RDdXJzb3JQb3NpdGlvbi5pc0VxdWFsKEBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSlcbiAgICAgIEBlZGl0b3JFbGVtZW50LnNldFNjcm9sbExlZnQob2xkTGVmdClcbiAgICAgIEBlZGl0b3JFbGVtZW50LnNldFNjcm9sbFRvcChvbGRUb3ApXG5cbiAgICBAdmltU3RhdGUuYWN0aXZhdGVOb3JtYWxNb2RlKClcblxuI1xuIyBJdCBjb21iaW5lcyB0aGUgY3VycmVudCBsaW5lIHdpdGggdGhlIGZvbGxvd2luZyBsaW5lLlxuI1xuY2xhc3MgSm9pbiBleHRlbmRzIE9wZXJhdG9yXG4gIGNvbnN0cnVjdG9yOiAoQGVkaXRvciwgQHZpbVN0YXRlKSAtPiBAY29tcGxldGUgPSB0cnVlXG5cbiAgIyBQdWJsaWM6IENvbWJpbmVzIHRoZSBjdXJyZW50IHdpdGggdGhlIGZvbGxvd2luZyBsaW5lc1xuICAjXG4gICMgY291bnQgLSBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGV4ZWN1dGUuXG4gICNcbiAgIyBSZXR1cm5zIG5vdGhpbmcuXG4gIGV4ZWN1dGU6IChjb3VudD0xKSAtPlxuICAgIEBlZGl0b3IudHJhbnNhY3QgPT5cbiAgICAgIF8udGltZXMgY291bnQsID0+XG4gICAgICAgIEBlZGl0b3Iuam9pbkxpbmVzKClcbiAgICBAdmltU3RhdGUuYWN0aXZhdGVOb3JtYWxNb2RlKClcblxuI1xuIyBSZXBlYXQgdGhlIGxhc3Qgb3BlcmF0aW9uXG4jXG5jbGFzcyBSZXBlYXQgZXh0ZW5kcyBPcGVyYXRvclxuICBjb25zdHJ1Y3RvcjogKEBlZGl0b3IsIEB2aW1TdGF0ZSkgLT4gQGNvbXBsZXRlID0gdHJ1ZVxuXG4gIGlzUmVjb3JkYWJsZTogLT4gZmFsc2VcblxuICBleGVjdXRlOiAoY291bnQ9MSkgLT5cbiAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBfLnRpbWVzIGNvdW50LCA9PlxuICAgICAgICBjbWQgPSBAdmltU3RhdGUuaGlzdG9yeVswXVxuICAgICAgICBjbWQ/LmV4ZWN1dGUoKVxuI1xuIyBJdCBjcmVhdGVzIGEgbWFyayBhdCB0aGUgY3VycmVudCBjdXJzb3IgcG9zaXRpb25cbiNcbmNsYXNzIE1hcmsgZXh0ZW5kcyBPcGVyYXRvcldpdGhJbnB1dFxuICBjb25zdHJ1Y3RvcjogKEBlZGl0b3IsIEB2aW1TdGF0ZSkgLT5cbiAgICBzdXBlcihAZWRpdG9yLCBAdmltU3RhdGUpXG4gICAgQHZpZXdNb2RlbCA9IG5ldyBWaWV3TW9kZWwodGhpcywgY2xhc3M6ICdtYXJrJywgc2luZ2xlQ2hhcjogdHJ1ZSwgaGlkZGVuOiB0cnVlKVxuXG4gICMgUHVibGljOiBDcmVhdGVzIHRoZSBtYXJrIGluIHRoZSBzcGVjaWZpZWQgbWFyayByZWdpc3RlciAoZnJvbSB1c2VyIGlucHV0KVxuICAjIGF0IHRoZSBjdXJyZW50IHBvc2l0aW9uXG4gICNcbiAgIyBSZXR1cm5zIG5vdGhpbmcuXG4gIGV4ZWN1dGU6IC0+XG4gICAgQHZpbVN0YXRlLnNldE1hcmsoQGlucHV0LmNoYXJhY3RlcnMsIEBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSlcbiAgICBAdmltU3RhdGUuYWN0aXZhdGVOb3JtYWxNb2RlKClcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIE9wZXJhdG9yLCBPcGVyYXRvcldpdGhJbnB1dCwgT3BlcmF0b3JFcnJvciwgRGVsZXRlLCBUb2dnbGVDYXNlLFxuICBVcHBlckNhc2UsIExvd2VyQ2FzZSwgWWFuaywgSm9pbiwgUmVwZWF0LCBNYXJrXG59XG4iXX0=
