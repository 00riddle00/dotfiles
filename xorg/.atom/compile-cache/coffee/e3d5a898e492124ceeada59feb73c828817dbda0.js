(function() {
  var Change, Delete, Insert, InsertAboveWithNewline, InsertAfter, InsertAfterEndOfLine, InsertAtBeginningOfLine, InsertBelowWithNewline, Motions, Operator, ReplaceMode, _, ref, settings,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Motions = require('../motions/index');

  ref = require('./general-operators'), Operator = ref.Operator, Delete = ref.Delete;

  _ = require('underscore-plus');

  settings = require('../settings');

  Insert = (function(superClass) {
    extend(Insert, superClass);

    function Insert() {
      return Insert.__super__.constructor.apply(this, arguments);
    }

    Insert.prototype.standalone = true;

    Insert.prototype.isComplete = function() {
      return this.standalone || Insert.__super__.isComplete.apply(this, arguments);
    };

    Insert.prototype.confirmChanges = function(changes) {
      if (changes.length > 0) {
        return this.typedText = changes[0].newText;
      } else {
        return this.typedText = "";
      }
    };

    Insert.prototype.execute = function() {
      var cursor, i, len, ref1;
      if (this.typingCompleted) {
        if (!((this.typedText != null) && this.typedText.length > 0)) {
          return;
        }
        this.editor.insertText(this.typedText, {
          normalizeLineEndings: true,
          autoIndent: true
        });
        ref1 = this.editor.getCursors();
        for (i = 0, len = ref1.length; i < len; i++) {
          cursor = ref1[i];
          if (!cursor.isAtBeginningOfLine()) {
            cursor.moveLeft();
          }
        }
      } else {
        this.vimState.activateInsertMode();
        this.typingCompleted = true;
      }
    };

    Insert.prototype.inputOperator = function() {
      return true;
    };

    return Insert;

  })(Operator);

  ReplaceMode = (function(superClass) {
    extend(ReplaceMode, superClass);

    function ReplaceMode() {
      return ReplaceMode.__super__.constructor.apply(this, arguments);
    }

    ReplaceMode.prototype.execute = function() {
      if (this.typingCompleted) {
        if (!((this.typedText != null) && this.typedText.length > 0)) {
          return;
        }
        return this.editor.transact((function(_this) {
          return function() {
            var count, cursor, i, j, len, len1, ref1, ref2, results, selection, toDelete;
            _this.editor.insertText(_this.typedText, {
              normalizeLineEndings: true
            });
            toDelete = _this.typedText.length - _this.countChars('\n', _this.typedText);
            ref1 = _this.editor.getSelections();
            for (i = 0, len = ref1.length; i < len; i++) {
              selection = ref1[i];
              count = toDelete;
              while (count-- && !selection.cursor.isAtEndOfLine()) {
                selection["delete"]();
              }
            }
            ref2 = _this.editor.getCursors();
            results = [];
            for (j = 0, len1 = ref2.length; j < len1; j++) {
              cursor = ref2[j];
              if (!cursor.isAtBeginningOfLine()) {
                results.push(cursor.moveLeft());
              } else {
                results.push(void 0);
              }
            }
            return results;
          };
        })(this));
      } else {
        this.vimState.activateReplaceMode();
        return this.typingCompleted = true;
      }
    };

    ReplaceMode.prototype.countChars = function(char, string) {
      return string.split(char).length - 1;
    };

    return ReplaceMode;

  })(Insert);

  InsertAfter = (function(superClass) {
    extend(InsertAfter, superClass);

    function InsertAfter() {
      return InsertAfter.__super__.constructor.apply(this, arguments);
    }

    InsertAfter.prototype.execute = function() {
      if (!this.editor.getLastCursor().isAtEndOfLine()) {
        this.editor.moveRight();
      }
      return InsertAfter.__super__.execute.apply(this, arguments);
    };

    return InsertAfter;

  })(Insert);

  InsertAfterEndOfLine = (function(superClass) {
    extend(InsertAfterEndOfLine, superClass);

    function InsertAfterEndOfLine() {
      return InsertAfterEndOfLine.__super__.constructor.apply(this, arguments);
    }

    InsertAfterEndOfLine.prototype.execute = function() {
      this.editor.moveToEndOfLine();
      return InsertAfterEndOfLine.__super__.execute.apply(this, arguments);
    };

    return InsertAfterEndOfLine;

  })(Insert);

  InsertAtBeginningOfLine = (function(superClass) {
    extend(InsertAtBeginningOfLine, superClass);

    function InsertAtBeginningOfLine() {
      return InsertAtBeginningOfLine.__super__.constructor.apply(this, arguments);
    }

    InsertAtBeginningOfLine.prototype.execute = function() {
      this.editor.moveToBeginningOfLine();
      this.editor.moveToFirstCharacterOfLine();
      return InsertAtBeginningOfLine.__super__.execute.apply(this, arguments);
    };

    return InsertAtBeginningOfLine;

  })(Insert);

  InsertAboveWithNewline = (function(superClass) {
    extend(InsertAboveWithNewline, superClass);

    function InsertAboveWithNewline() {
      return InsertAboveWithNewline.__super__.constructor.apply(this, arguments);
    }

    InsertAboveWithNewline.prototype.execute = function() {
      if (!this.typingCompleted) {
        this.vimState.setInsertionCheckpoint();
      }
      this.editor.insertNewlineAbove();
      this.editor.getLastCursor().skipLeadingWhitespace();
      if (this.typingCompleted) {
        this.typedText = this.typedText.trimLeft();
        return InsertAboveWithNewline.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode();
      return this.typingCompleted = true;
    };

    return InsertAboveWithNewline;

  })(Insert);

  InsertBelowWithNewline = (function(superClass) {
    extend(InsertBelowWithNewline, superClass);

    function InsertBelowWithNewline() {
      return InsertBelowWithNewline.__super__.constructor.apply(this, arguments);
    }

    InsertBelowWithNewline.prototype.execute = function() {
      if (!this.typingCompleted) {
        this.vimState.setInsertionCheckpoint();
      }
      this.editor.insertNewlineBelow();
      this.editor.getLastCursor().skipLeadingWhitespace();
      if (this.typingCompleted) {
        this.typedText = this.typedText.trimLeft();
        return InsertBelowWithNewline.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode();
      return this.typingCompleted = true;
    };

    return InsertBelowWithNewline;

  })(Insert);

  Change = (function(superClass) {
    extend(Change, superClass);

    Change.prototype.standalone = false;

    Change.prototype.register = null;

    function Change(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.register = settings.defaultRegister();
    }

    Change.prototype.execute = function(count) {
      var base, i, j, len, len1, ref1, ref2, selection;
      if (_.contains(this.motion.select(count, {
        excludeWhitespace: true
      }), true)) {
        if (!this.typingCompleted) {
          this.vimState.setInsertionCheckpoint();
        }
        this.setTextRegister(this.register, this.editor.getSelectedText());
        if ((typeof (base = this.motion).isLinewise === "function" ? base.isLinewise() : void 0) && !this.typingCompleted) {
          ref1 = this.editor.getSelections();
          for (i = 0, len = ref1.length; i < len; i++) {
            selection = ref1[i];
            if (selection.getBufferRange().end.row === 0) {
              selection.deleteSelectedText();
            } else {
              selection.insertText("\n", {
                autoIndent: true
              });
            }
            selection.cursor.moveLeft();
          }
        } else {
          ref2 = this.editor.getSelections();
          for (j = 0, len1 = ref2.length; j < len1; j++) {
            selection = ref2[j];
            selection.deleteSelectedText();
          }
        }
        if (this.typingCompleted) {
          return Change.__super__.execute.apply(this, arguments);
        }
        this.vimState.activateInsertMode();
        return this.typingCompleted = true;
      } else {
        return this.vimState.activateNormalMode();
      }
    };

    return Change;

  })(Insert);

  module.exports = {
    Insert: Insert,
    InsertAfter: InsertAfter,
    InsertAfterEndOfLine: InsertAfterEndOfLine,
    InsertAtBeginningOfLine: InsertAtBeginningOfLine,
    InsertAboveWithNewline: InsertAboveWithNewline,
    InsertBelowWithNewline: InsertBelowWithNewline,
    ReplaceMode: ReplaceMode,
    Change: Change
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9vcGVyYXRvcnMvaW5wdXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxvTEFBQTtJQUFBOzs7RUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGtCQUFSOztFQUNWLE1BQXFCLE9BQUEsQ0FBUSxxQkFBUixDQUFyQixFQUFDLHVCQUFELEVBQVc7O0VBQ1gsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFDSixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBTUw7Ozs7Ozs7cUJBQ0osVUFBQSxHQUFZOztxQkFFWixVQUFBLEdBQVksU0FBQTthQUFHLElBQUMsQ0FBQSxVQUFELElBQWUsd0NBQUEsU0FBQTtJQUFsQjs7cUJBRVosY0FBQSxHQUFnQixTQUFDLE9BQUQ7TUFDZCxJQUFHLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLENBQXBCO2VBQ0UsSUFBQyxDQUFBLFNBQUQsR0FBYSxPQUFRLENBQUEsQ0FBQSxDQUFFLENBQUMsUUFEMUI7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLFNBQUQsR0FBYSxHQUhmOztJQURjOztxQkFNaEIsT0FBQSxHQUFTLFNBQUE7QUFDUCxVQUFBO01BQUEsSUFBRyxJQUFDLENBQUEsZUFBSjtRQUNFLElBQUEsQ0FBQSxDQUFjLHdCQUFBLElBQWdCLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxHQUFvQixDQUFsRCxDQUFBO0FBQUEsaUJBQUE7O1FBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQUMsQ0FBQSxTQUFwQixFQUErQjtVQUFBLG9CQUFBLEVBQXNCLElBQXRCO1VBQTRCLFVBQUEsRUFBWSxJQUF4QztTQUEvQjtBQUNBO0FBQUEsYUFBQSxzQ0FBQTs7VUFDRSxJQUFBLENBQXlCLE1BQU0sQ0FBQyxtQkFBUCxDQUFBLENBQXpCO1lBQUEsTUFBTSxD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ZUFBUixDQUFBLENBQTVCO1FBQ0EsaUVBQVUsQ0FBQyxzQkFBUixJQUEwQixDQUFJLElBQUMsQ0FBQSxlQUFsQztBQUNFO0FBQUEsZUFBQSxzQ0FBQTs7WUFDRSxJQUFHLFNBQVMsQ0FBQyxjQUFWLENBQUEsQ0FBMEIsQ0FBQyxHQUFHLENBQUMsR0FBL0IsS0FBc0MsQ0FBekM7Y0FDRSxTQUFTLENBQUMsa0JBQVYsQ0FBQSxFQURGO2FBQUEsTUFBQTtjQUdFLFNBQVMsQ0FBQyxVQUFWLENBQXFCLElBQXJCLEVBQTJCO2dCQUFBLFVBQUEsRUFBWSxJQUFaO2VBQTNCLEVBSEY7O1lBSUEsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFqQixDQUFBO0FBTEYsV0FERjtTQUFBLE1BQUE7QUFRRTtBQUFBLGVBQUEsd0NBQUE7O1lBQ0UsU0FBUyxDQUFDLGtCQUFWLENBQUE7QUFERixXQVJGOztRQVdBLElBQWdCLElBQUMsQ0FBQSxlQUFqQjtBQUFBLGlCQUFPLHFDQUFBLFNBQUEsRUFBUDs7UUFFQSxJQUFDLENBQUEsUUFBUSxDQUFDLGtCQUFWLENBQUE7ZUFDQSxJQUFDLENBQUEsZUFBRCxHQUFtQixLQXBCckI7T0FBQSxNQUFBO2VBc0JFLElBQUMsQ0FBQSxRQUFRLENBQUMsa0JBQVYsQ0FBQSxFQXRCRjs7SUFETzs7OztLQVpVOztFQXNDckIsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFDZixRQUFBLE1BRGU7SUFFZixhQUFBLFdBRmU7SUFHZixzQkFBQSxvQkFIZTtJQUlmLHlCQUFBLHVCQUplO0lBS2Ysd0JBQUEsc0JBTGU7SUFNZix3QkFBQSxzQkFOZTtJQU9mLGFBQUEsV0FQZTtJQVFmLFFBQUEsTUFSZTs7QUE1SWpCIiwic291cmNlc0NvbnRlbnQiOlsiTW90aW9ucyA9IHJlcXVpcmUgJy4uL21vdGlvbnMvaW5kZXgnXG57T3BlcmF0b3IsIERlbGV0ZX0gPSByZXF1aXJlICcuL2dlbmVyYWwtb3BlcmF0b3JzJ1xuXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcbnNldHRpbmdzID0gcmVxdWlyZSAnLi4vc2V0dGluZ3MnXG5cbiMgVGhlIG9wZXJhdGlvbiBmb3IgdGV4dCBlbnRlcmVkIGluIGlucHV0IG1vZGUuIEJyb2FkbHkgc3BlYWtpbmcsIGlucHV0XG4jIG9wZXJhdG9ycyBtYW5hZ2UgYW4gdW5kbyB0cmFuc2FjdGlvbiBhbmQgc2V0IGEgQHR5cGluZ0NvbXBsZXRlZCB2YXJpYWJsZSB3aGVuXG4jIGl0J3MgZG9uZS4gV2hlbiB0aGUgaW5wdXQgb3BlcmF0aW9uIGlzIGNvbXBsZXRlZCwgdGhlIHR5cGluZ0NvbXBsZXRlZCB2YXJpYWJsZVxuIyB0ZWxscyB0aGUgb3BlcmF0aW9uIHRvIHJlcGVhdCBpdHNlbGYgaW5zdGVhZCBvZiBlbnRlciBpbnNlcnQgbW9kZS5cbmNsYXNzIEluc2VydCBleHRlbmRzIE9wZXJhdG9yXG4gIHN0YW5kYWxvbmU6IHRydWVcblxuICBpc0NvbXBsZXRlOiAtPiBAc3RhbmRhbG9uZSBvciBzdXBlclxuXG4gIGNvbmZpcm1DaGFuZ2VzOiAoY2hhbmdlcykgLT5cbiAgICBpZiBjaGFuZ2VzLmxlbmd0aCA+IDBcbiAgICAgIEB0eXBlZFRleHQgPSBjaGFuZ2VzWzBdLm5ld1RleHRcbiAgICBlbHNlXG4gICAgICBAdHlwZWRUZXh0ID0gXCJcIlxuXG4gIGV4ZWN1dGU6IC0+XG4gICAgaWYgQHR5cGluZ0NvbXBsZXRlZFxuICAgICAgcmV0dXJuIHVubGVzcyBAdHlwZWRUZXh0PyBhbmQgQHR5cGVkVGV4dC5sZW5ndGggPiAwXG4gICAgICBAZWRpdG9yLmluc2VydFRleHQoQHR5cGVkVGV4dCwgbm9ybWFsaXplTGluZUVuZGluZ3M6IHRydWUsIGF1dG9JbmRlbnQ6IHRydWUpXG4gICAgICBmb3IgY3Vyc29yIGluIEBlZGl0b3IuZ2V0Q3Vyc29ycygpXG4gICAgICAgIGN1cnNvci5tb3ZlTGVmdCgpIHVubGVzcyBjdXJzb3IuaXNBdEJlZ2lubmluZ09mTGluZSgpXG4gICAgZWxzZVxuICAgICAgQHZpbVN0YXRlLmFjdGl2YXRlSW5zZXJ0TW9kZSgpXG4gICAgICBAdHlwaW5nQ29tcGxldGVkID0gdHJ1ZVxuICAgIHJldHVyblxuXG4gIGlucHV0T3BlcmF0b3I6IC0+IHRydWVcblxuY2xhc3MgUmVwbGFjZU1vZGUgZXh0ZW5kcyBJbnNlcnRcblxuICBleGVjdXRlOiAtPlxuICAgIGlmIEB0eXBpbmdDb21wbGV0ZWRcbiAgICAgIHJldHVybiB1bmxlc3MgQHR5cGVkVGV4dD8gYW5kIEB0eXBlZFRleHQubGVuZ3RoID4gMFxuICAgICAgQGVkaXRvci50cmFuc2FjdCA9PlxuICAgICAgICBAZWRpdG9yLmluc2VydFRleHQoQHR5cGVkVGV4dCwgbm9ybWFsaXplTGluZUVuZGluZ3M6IHRydWUpXG4gICAgICAgIHRvRGVsZXRlID0gQHR5cGVkVGV4dC5sZW5ndGggLSBAY291bnRDaGFycygnXFxuJywgQHR5cGVkVGV4dClcbiAgICAgICAgZm9yIHNlbGVjdGlvbiBpbiBAZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICAgICAgICAgIGNvdW50ID0gdG9EZWxldGVcbiAgICAgICAgICBzZWxlY3Rpb24uZGVsZXRlKCkgd2hpbGUgY291bnQtLSBhbmQgbm90IHNlbGVjdGlvbi5jdXJzb3IuaXNBdEVuZE9mTGluZSgpXG4gICAgICAgIGZvciBjdXJzb3IgaW4gQGVkaXRvci5nZXRDdXJzb3JzKClcbiAgICAgICAgICBjdXJzb3IubW92ZUxlZnQoKSB1bmxlc3MgY3Vyc29yLmlzQXRCZWdpbm5pbmdPZkxpbmUoKVxuICAgIGVsc2VcbiAgICAgIEB2aW1TdGF0ZS5hY3RpdmF0ZVJlcGxhY2VNb2RlKClcbiAgICAgIEB0eXBpbmdDb21wbGV0ZWQgPSB0cnVlXG5cbiAgY291bnRDaGFyczogKGNoYXIsIHN0cmluZykgLT5cbiAgICBzdHJpbmcuc3BsaXQoY2hhcikubGVuZ3RoIC0gMVxuXG5jbGFzcyBJbnNlcnRBZnRlciBleHRlbmRzIEluc2VydFxuICBleGVjdXRlOiAtPlxuICAgIEBlZGl0b3IubW92ZVJpZ2h0KCkgdW5sZXNzIEBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpLmlzQXRFbmRPZkxpbmUoKVxuICAgIHN1cGVyXG5cbmNsYXNzIEluc2VydEFmdGVyRW5kT2ZMaW5lIGV4dGVuZHMgSW5zZXJ0XG4gIGV4ZWN1dGU6IC0+XG4gICAgQGVkaXRvci5tb3ZlVG9FbmRPZkxpbmUoKVxuICAgIHN1cGVyXG5cbmNsYXNzIEluc2VydEF0QmVnaW5uaW5nT2ZMaW5lIGV4dGVuZHMgSW5zZXJ0XG4gIGV4ZWN1dGU6IC0+XG4gICAgQGVkaXRvci5tb3ZlVG9CZWdpbm5pbmdPZkxpbmUoKVxuICAgIEBlZGl0b3IubW92ZVRvRmlyc3RDaGFyYWN0ZXJPZkxpbmUoKVxuICAgIHN1cGVyXG5cbmNsYXNzIEluc2VydEFib3ZlV2l0aE5ld2xpbmUgZXh0ZW5kcyBJbnNlcnRcbiAgZXhlY3V0ZTogLT5cbiAgICBAdmltU3RhdGUuc2V0SW5zZXJ0aW9uQ2hlY2twb2ludCgpIHVubGVzcyBAdHlwaW5nQ29tcGxldGVkXG4gICAgQGVkaXRvci5pbnNlcnROZXdsaW5lQWJvdmUoKVxuICAgIEBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpLnNraXBMZWFkaW5nV2hpdGVzcGFjZSgpXG5cbiAgICBpZiBAdHlwaW5nQ29tcGxldGVkXG4gICAgICAjIFdlJ2xsIGhhdmUgY2FwdHVyZWQgdGhlIGluc2VydGVkIG5ld2xpbmUsIGJ1dCB3ZSB3YW50IHRvIGRvIHRoYXRcbiAgICAgICMgb3ZlciBhZ2FpbiBieSBoYW5kLCBvciBkaWZmZXJpbmcgaW5kZW50YXRpb25zIHdpbGwgYmUgd3JvbmcuXG4gICAgICBAdHlwZWRUZXh0ID0gQHR5cGVkVGV4dC50cmltTGVmdCgpXG4gICAgICByZXR1cm4gc3VwZXJcblxuICAgIEB2aW1TdGF0ZS5hY3RpdmF0ZUluc2VydE1vZGUoKVxuICAgIEB0eXBpbmdDb21wbGV0ZWQgPSB0cnVlXG5cbmNsYXNzIEluc2VydEJlbG93V2l0aE5ld2xpbmUgZXh0ZW5kcyBJbnNlcnRcbiAgZXhlY3V0ZTogLT5cbiAgICBAdmltU3RhdGUuc2V0SW5zZXJ0aW9uQ2hlY2twb2ludCgpIHVubGVzcyBAdHlwaW5nQ29tcGxldGVkXG4gICAgQGVkaXRvci5pbnNlcnROZXdsaW5lQmVsb3coKVxuICAgIEBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpLnNraXBMZWFkaW5nV2hpdGVzcGFjZSgpXG5cbiAgICBpZiBAdHlwaW5nQ29tcGxldGVkXG4gICAgICAjIFdlJ2xsIGhhdmUgY2FwdHVyZWQgdGhlIGluc2VydGVkIG5ld2xpbmUsIGJ1dCB3ZSB3YW50IHRvIGRvIHRoYXRcbiAgICAgICMgb3ZlciBhZ2FpbiBieSBoYW5kLCBvciBkaWZmZXJpbmcgaW5kZW50YXRpb25zIHdpbGwgYmUgd3JvbmcuXG4gICAgICBAdHlwZWRUZXh0ID0gQHR5cGVkVGV4dC50cmltTGVmdCgpXG4gICAgICByZXR1cm4gc3VwZXJcblxuICAgIEB2aW1TdGF0ZS5hY3RpdmF0ZUluc2VydE1vZGUoKVxuICAgIEB0eXBpbmdDb21wbGV0ZWQgPSB0cnVlXG5cbiNcbiMgRGVsZXRlIHRoZSBmb2xsb3dpbmcgbW90aW9uIGFuZCBlbnRlciBpbnNlcnQgbW9kZSB0byByZXBsYWNlIGl0LlxuI1xuY2xhc3MgQ2hhbmdlIGV4dGVuZHMgSW5zZXJ0XG4gIHN0YW5kYWxvbmU6IGZhbHNlXG4gIHJlZ2lzdGVyOiBudWxsXG5cbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBAdmltU3RhdGUpIC0+XG4gICAgQHJlZ2lzdGVyID0gc2V0dGluZ3MuZGVmYXVsdFJlZ2lzdGVyKClcblxuICAjIFB1YmxpYzogQ2hhbmdlcyB0aGUgdGV4dCBzZWxlY3RlZCBieSB0aGUgZ2l2ZW4gbW90aW9uLlxuICAjXG4gICMgY291bnQgLSBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGV4ZWN1dGUuXG4gICNcbiAgIyBSZXR1cm5zIG5vdGhpbmcuXG4gIGV4ZWN1dGU6IChjb3VudCkgLT5cbiAgICBpZiBfLmNvbnRhaW5zKEBtb3Rpb24uc2VsZWN0KGNvdW50LCBleGNsdWRlV2hpdGVzcGFjZTogdHJ1ZSksIHRydWUpXG4gICAgICAjIElmIHdlJ3ZlIHR5cGVkLCB3ZSdyZSBiZWluZyByZXBlYXRlZC4gSWYgd2UncmUgYmVpbmcgcmVwZWF0ZWQsXG4gICAgICAjIHVuZG8gdHJhbnNhY3Rpb25zIGFyZSBhbHJlYWR5IGhhbmRsZWQuXG4gICAgICBAdmltU3RhdGUuc2V0SW5zZXJ0aW9uQ2hlY2twb2ludCgpIHVubGVzcyBAdHlwaW5nQ29tcGxldGVkXG5cbiAgICAgIEBzZXRUZXh0UmVnaXN0ZXIoQHJlZ2lzdGVyLCBAZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpKVxuICAgICAgaWYgQG1vdGlvbi5pc0xpbmV3aXNlPygpIGFuZCBub3QgQHR5cGluZ0NvbXBsZXRlZFxuICAgICAgICBmb3Igc2VsZWN0aW9uIGluIEBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gICAgICAgICAgaWYgc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCkuZW5kLnJvdyBpcyAwXG4gICAgICAgICAgICBzZWxlY3Rpb24uZGVsZXRlU2VsZWN0ZWRUZXh0KClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzZWxlY3Rpb24uaW5zZXJ0VGV4dChcIlxcblwiLCBhdXRvSW5kZW50OiB0cnVlKVxuICAgICAgICAgIHNlbGVjdGlvbi5jdXJzb3IubW92ZUxlZnQoKVxuICAgICAgZWxzZVxuICAgICAgICBmb3Igc2VsZWN0aW9uIGluIEBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gICAgICAgICAgc2VsZWN0aW9uLmRlbGV0ZVNlbGVjdGVkVGV4dCgpXG5cbiAgICAgIHJldHVybiBzdXBlciBpZiBAdHlwaW5nQ29tcGxldGVkXG5cbiAgICAgIEB2aW1TdGF0ZS5hY3RpdmF0ZUluc2VydE1vZGUoKVxuICAgICAgQHR5cGluZ0NvbXBsZXRlZCA9IHRydWVcbiAgICBlbHNlXG4gICAgICBAdmltU3RhdGUuYWN0aXZhdGVOb3JtYWxNb2RlKClcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgSW5zZXJ0LFxuICBJbnNlcnRBZnRlcixcbiAgSW5zZXJ0QWZ0ZXJFbmRPZkxpbmUsXG4gIEluc2VydEF0QmVnaW5uaW5nT2ZMaW5lLFxuICBJbnNlcnRBYm92ZVdpdGhOZXdsaW5lLFxuICBJbnNlcnRCZWxvd1dpdGhOZXdsaW5lLFxuICBSZXBsYWNlTW9kZSxcbiAgQ2hhbmdlXG59XG4iXX0=
