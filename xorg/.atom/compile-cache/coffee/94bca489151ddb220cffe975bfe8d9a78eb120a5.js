(function() {
  var AnyBracket, BracketMatchingMotion, CloseBrackets, Input, MotionWithInput, OpenBrackets, Point, Range, RepeatSearch, Search, SearchBase, SearchCurrentWord, SearchViewModel, _, ref, settings,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require('underscore-plus');

  MotionWithInput = require('./general-motions').MotionWithInput;

  SearchViewModel = require('../view-models/search-view-model');

  Input = require('../view-models/view-model').Input;

  ref = require('atom'), Point = ref.Point, Range = ref.Range;

  settings = require('../settings');

  SearchBase = (function(superClass) {
    extend(SearchBase, superClass);

    function SearchBase(editor, vimState, options) {
      this.editor = editor;
      this.vimState = vimState;
      if (options == null) {
        options = {};
      }
      this.reversed = bind(this.reversed, this);
      SearchBase.__super__.constructor.call(this, this.editor, this.vimState);
      this.reverse = this.initiallyReversed = false;
      if (!options.dontUpdateCurrentSearch) {
        this.updateCurrentSearch();
      }
    }

    SearchBase.prototype.reversed = function() {
      this.initiallyReversed = this.reverse = true;
      this.updateCurrentSearch();
      return this;
    };

    SearchBase.prototype.moveCursor = function(cursor, count) {
      var range, ranges;
      if (count == null) {
        count = 1;
      }
      ranges = this.scan(cursor);
      if (ranges.length > 0) {
        range = ranges[(count - 1) % ranges.length];
        return cursor.setBufferPosition(range.start);
      } else {
        return atom.beep();
      }
    };

    SearchBase.prototype.scan = function(cursor) {
      var currentPosition, rangesAfter, rangesBefore, ref1;
      if (this.input.characters === "") {
        return [];
      }
      currentPosition = cursor.getBufferPosition();
      ref1 = [[], []], rangesBefore = ref1[0], rangesAfter = ref1[1];
      this.editor.scan(this.getSearchTerm(this.input.characters), (function(_this) {
        return function(arg) {
          var isBefore, range;
          range = arg.range;
          isBefore = _this.reverse ? range.start.compare(currentPosition) < 0 : range.start.compare(currentPosition) <= 0;
          if (isBefore) {
            return rangesBefore.push(range);
          } else {
            return rangesAfter.push(range);
          }
        };
      })(this));
      if (this.reverse) {
        return rangesAfter.concat(rangesBefore).reverse();
      } else {
        return rangesAfter.concat(rangesBefore);
      }
    };

    SearchBase.prototype.getSearchTerm = function(term) {
      var modFlags, modifiers;
      modifiers = {
        'g': true
      };
      if (!term.match('[A-Z]') && settings.useSmartcaseForSearch()) {
        modifiers['i'] = true;
      }
      if (term.indexOf('\\c') >= 0) {
        term = term.replace('\\c', '');
        modifiers['i'] = true;
      }
      modFlags = Object.keys(modifiers).join('');
      try {
        return new RegExp(term, modFlags);
      } catch (error) {
        return new RegExp(_.escapeRegExp(term), modFlags);
      }
    };

    SearchBase.prototype.updateCurrentSearch = function() {
      this.vimState.globalVimState.currentSearch.reverse = this.reverse;
      return this.vimState.globalVimState.currentSearch.initiallyReversed = this.initiallyReversed;
    };

    SearchBase.prototype.replicateCurrentSearch = function() {
      this.reverse = this.vimState.globalVimState.currentSearch.reverse;
      return this.initiallyReversed = this.vimState.globalVimState.currentSearch.initiallyReversed;
    };

    return SearchBase;

  })(MotionWithInput);

  Search = (function(superClass) {
    extend(Search, superClass);

    function Search(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.reversed = bind(this.reversed, this);
      Search.__super__.constructor.call(this, this.editor, this.vimState);
      this.viewModel = new SearchViewModel(this);
      this.updateViewModel();
    }

    Search.prototype.reversed = function() {
      this.initiallyReversed = this.reverse = true;
      this.updateCurrentSearch();
      this.updateViewModel();
      return this;
    };

    Search.prototype.updateViewModel = function() {
      return this.viewModel.update(this.initiallyReversed);
    };

    return Search;

  })(SearchBase);

  SearchCurrentWord = (function(superClass) {
    extend(SearchCurrentWord, superClass);

    SearchCurrentWord.keywordRegex = null;

    function SearchCurrentWord(editor, vimState) {
      var defaultIsKeyword, searchString, userIsKeyword;
      this.editor = editor;
      this.vimState = vimState;
      SearchCurrentWord.__super__.constructor.call(this, this.editor, this.vimState);
      defaultIsKeyword = "[@a-zA-Z0-9_\-]+";
      userIsKeyword = atom.config.get('vim-mode.iskeyword');
      this.keywordRegex = new RegExp(userIsKeyword || defaultIsKeyword);
      searchString = this.getCurrentWordMatch();
      this.input = new Input(searchString);
      if (searchString !== this.vimState.getSearchHistoryItem()) {
        this.vimState.pushSearchHistory(searchString);
      }
    }

    SearchCurrentWord.prototype.getCurrentWord = function() {
      var cursor, cursorPosition, wordEnd, wordStart;
      cursor = this.editor.getLastCursor();
      wordStart = cursor.getBeginningOfCurrentWordBufferPosition({
        wordRegex: this.keywordRegex,
        allowPrevious: false
      });
      wordEnd = cursor.getEndOfCurrentWordBufferPosition({
        wordRegex: this.keywordRegex,
        allowNext: false
      });
      cursorPosition = cursor.getBufferPosition();
      if (wordEnd.column === cursorPosition.column) {
        wordEnd = cursor.getEndOfCurrentWordBufferPosition({
          wordRegex: this.keywordRegex,
          allowNext: true
        });
        if (wordEnd.row !== cursorPosition.row) {
          return "";
        }
        cursor.setBufferPosition(wordEnd);
        wordStart = cursor.getBeginningOfCurrentWordBufferPosition({
          wordRegex: this.keywordRegex,
          allowPrevious: false
        });
      }
      cursor.setBufferPosition(wordStart);
      return this.editor.getTextInBufferRange([wordStart, wordEnd]);
    };

    SearchCurrentWord.prototype.cursorIsOnEOF = function(cursor) {
      var eofPos, pos;
      pos = cursor.getNextWordBoundaryBufferPosition({
        wordRegex: this.keywordRegex
      });
      eofPos = this.editor.getEofBufferPosition();
      return pos.row === eofPos.row && pos.column === eofPos.column;
    };

    SearchCurrentWord.prototype.getCurrentWordMatch = function() {
      var characters;
      characters = this.getCurrentWord();
      if (characters.length > 0) {
        if (/\W/.test(characters)) {
          return characters + "\\b";
        } else {
          return "\\b" + characters + "\\b";
        }
      } else {
        return characters;
      }
    };

    SearchCurrentWord.prototype.isComplete = function() {
      return true;
    };

    SearchCurrentWord.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      if (this.input.characters.length > 0) {
        return SearchCurrentWord.__super__.execute.call(this, count);
      }
    };

    return SearchCurrentWord;

  })(SearchBase);

  OpenBrackets = ['(', '{', '['];

  CloseBrackets = [')', '}', ']'];

  AnyBracket = new RegExp(OpenBrackets.concat(CloseBrackets).map(_.escapeRegExp).join("|"));

  BracketMatchingMotion = (function(superClass) {
    extend(BracketMatchingMotion, superClass);

    function BracketMatchingMotion() {
      return BracketMatchingMotion.__super__.constructor.apply(this, arguments);
    }

    BracketMatchingMotion.prototype.operatesInclusively = true;

    BracketMatchingMotion.prototype.isComplete = function() {
      return true;
    };

    BracketMatchingMotion.prototype.searchForMatch = function(startPosition, reverse, inCharacter, outCharacter) {
      var character, depth, eofPosition, increment, lineLength, point;
      depth = 0;
      point = startPosition.copy();
      lineLength = this.editor.lineTextForBufferRow(point.row).length;
      eofPosition = this.editor.getEofBufferPosition().translate([0, 1]);
      increment = reverse ? -1 : 1;
      while (true) {
        character = this.characterAt(point);
        if (character === inCharacter) {
          depth++;
        }
        if (character === outCharacter) {
          depth--;
        }
        if (depth === 0) {
          return point;
        }
        point.column += increment;
        if (depth < 0) {
          return null;
        }
        if (point.isEqual([0, -1])) {
          return null;
        }
        if (point.isEqual(eofPosition)) {
          return null;
        }
        if (point.column < 0) {
          point.row--;
          lineLength = this.editor.lineTextForBufferRow(point.row).length;
          point.column = lineLength - 1;
        } else if (point.column >= lineLength) {
          point.row++;
          lineLength = this.editor.lineTextForBufferRow(point.row).length;
          point.column = 0;
        }
      }
    };

    BracketMatchingMotion.prototype.characterAt = function(position) {
      return this.editor.getTextInBufferRange([position, position.translate([0, 1])]);
    };

    BracketMatchingMotion.prototype.getSearchData = function(position) {
      var character, index;
      character = this.characterAt(position);
      if ((index = OpenBrackets.indexOf(character)) >= 0) {
        return [character, CloseBrackets[index], false];
      } else if ((index = CloseBrackets.indexOf(character)) >= 0) {
        return [character, OpenBrackets[index], true];
      } else {
        return [];
      }
    };

    BracketMatchingMotion.prototype.moveCursor = function(cursor) {
      var inCharacter, matchPosition, outCharacter, ref1, ref2, restOfLine, reverse, startPosition;
      startPosition = cursor.getBufferPosition();
      ref1 = this.getSearchData(startPosition), inCharacter = ref1[0], outCharacter = ref1[1], reverse = ref1[2];
      if (inCharacter == null) {
        restOfLine = [startPosition, [startPosition.row, 2e308]];
        this.editor.scanInBufferRange(AnyBracket, restOfLine, function(arg) {
          var range, stop;
          range = arg.range, stop = arg.stop;
          startPosition = range.start;
          return stop();
        });
      }
      ref2 = this.getSearchData(startPosition), inCharacter = ref2[0], outCharacter = ref2[1], reverse = ref2[2];
      if (inCharacter == null) {
        return;
      }
      if (matchPosition = this.searchForMatch(startPosition, reverse, inCharacter, outCharacter)) {
        return cursor.setBufferPosition(matchPosition);
      }
    };

    return BracketMatchingMotion;

  })(SearchBase);

  RepeatSearch = (function(superClass) {
    extend(RepeatSearch, superClass);

    function RepeatSearch(editor, vimState) {
      var ref1;
      this.editor = editor;
      this.vimState = vimState;
      RepeatSearch.__super__.constructor.call(this, this.editor, this.vimState, {
        dontUpdateCurrentSearch: true
      });
      this.input = new Input((ref1 = this.vimState.getSearchHistoryItem(0)) != null ? ref1 : "");
      this.replicateCurrentSearch();
    }

    RepeatSearch.prototype.isComplete = function() {
      return true;
    };

    RepeatSearch.prototype.reversed = function() {
      this.reverse = !this.initiallyReversed;
      return this;
    };

    return RepeatSearch;

  })(SearchBase);

  module.exports = {
    Search: Search,
    SearchCurrentWord: SearchCurrentWord,
    BracketMatchingMotion: BracketMatchingMotion,
    RepeatSearch: RepeatSearch
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9tb3Rpb25zL3NlYXJjaC1tb3Rpb24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw0TEFBQTtJQUFBOzs7O0VBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFDSCxrQkFBbUIsT0FBQSxDQUFRLG1CQUFSOztFQUNwQixlQUFBLEdBQWtCLE9BQUEsQ0FBUSxrQ0FBUjs7RUFDakIsUUFBUyxPQUFBLENBQVEsMkJBQVI7O0VBQ1YsTUFBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxpQkFBRCxFQUFROztFQUNSLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFFTDs7O0lBQ1Msb0JBQUMsTUFBRCxFQUFVLFFBQVYsRUFBcUIsT0FBckI7TUFBQyxJQUFDLENBQUEsU0FBRDtNQUFTLElBQUMsQ0FBQSxXQUFEOztRQUFXLFVBQVU7OztNQUMxQyw0Q0FBTSxJQUFDLENBQUEsTUFBUCxFQUFlLElBQUMsQ0FBQSxRQUFoQjtNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLGlCQUFELEdBQXFCO01BQ2hDLElBQUEsQ0FBOEIsT0FBTyxDQUFDLHVCQUF0QztRQUFBLElBQUMsQ0FBQSxtQkFBRCxDQUFBLEVBQUE7O0lBSFc7O3lCQUtiLFFBQUEsR0FBVSxTQUFBO01BQ1IsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUMsQ0FBQSxPQUFELEdBQVc7TUFDaEMsSUFBQyxDQUFBLG1CQUFELENBQUE7YUFDQTtJQUhROzt5QkFLVixVQUFBLEdBQVksU0FBQyxNQUFELEVBQVMsS0FBVDtBQUNWLFVBQUE7O1FBRG1CLFFBQU07O01BQ3pCLE1BQUEsR0FBUyxJQUFDLENBQUEsSUFBRCxDQUFNLE1BQU47TUFDVCxJQUFHLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLENBQW5CO1FBQ0UsS0FBQSxHQUFRLE1BQU8sQ0FBQSxDQUFDLEtBQUEsR0FBUSxDQUFULENBQUEsR0FBYyxNQUFNLENBQUMsTUFBckI7ZUFDZixNQUFNLENBQUMsaUJBQVAsQ0FBeUIsS0FBSyxDQUFDLEtBQS9CLEVBRkY7T0FBQSxNQUFBO2VBSUUsSUFBSSxDQUFDLElBQUwsQ0FBQSxFQUpGOztJQUZVOzt5QkFRWixJQUFBLEdBQU0sU0FBQyxNQUFEO0FBQ0osVUFBQTtNQUFBLElBQWEsSUFBQyxDQUFBLEtBQUssQ0FBQyxVQUFQLEtBQXFCLEVBQWxDO0FBQUEsZUFBTyxHQUFQOztNQUVBLGVBQUEsR0FBa0IsTUFBTSxDQUFDLGlCQUFQLENBQUE7TUFFbEIsT0FBOEIsQ0FBQyxFQUFELEVBQUssRUFBTCxDQUE5QixFQUFDLHNCQUFELEVBQWU7TUFDZixJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxJQUFDLENBQUEsYUFBRCxDQUFlLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBdEIsQ0FBYixFQUFnRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtBQUM5QyxjQUFBO1VBRGdELFFBQUQ7VUFDL0MsUUFBQSxHQUFjLEtBQUMsQ0FBQSxPQUFKLEdBQ1QsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFaLENBQW9CLGVBQXBCLENBQUEsR0FBdUMsQ0FEOUIsR0FHVCxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQVosQ0FBb0IsZUFBcEIsQ0FBQSxJQUF3QztVQUUxQyxJQUFHLFFBQUg7bUJBQ0UsWUFBWSxDQUFDLElBQWIsQ0FBa0IsS0FBbEIsRUFERjtXQUFBLE1BQUE7bUJBR0UsV0FBVyxDQUFDLElBQVosQ0FBaUIsS0FBakIsRUFIRjs7UUFOOEM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhEO01BV0EsSUFBRyxJQUFDLENBQUEsT0FBSjtlQUNFLFdBQVcsQ0FBQyxNQUFaLENBQW1CLFlBQW5CLENBQWdDLENBQUMsT0FBakMsQ0FBQSxFQURGO09BQUEsTUFBQTtlQUdFLFdBQVcsQ0FBQyxNQUFaLENBQW1CLFlBQW5CLEVBSEY7O0lBakJJOzt5QkFzQk4sYUFBQSxHQUFlLFNBQUMsSUFBRDtBQUNiLFVBQUE7TUFBQSxTQUFBLEdBQVk7UUFBQyxHQUFBLEVBQUssSUFBTjs7TUFFWixJQUFHLENBQUksSUFBSSxDQUFDLEtBQUwsQ0FBVyxPQUFYLENBQUosSUFBNEIsUUFBUSxDQUFDLHFCQUFULENBQUEsQ0FBL0I7UUFDRSxTQUFVLENBQUEsR0FBQSxDQUFWLEdBQWlCLEtBRG5COztNQUdBLElBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxLQUFiLENBQUEsSUFBdUIsQ0FBMUI7UUFDRSxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxLQUFiLEVBQW9CLEVBQXBCO1FBQ1AsU0FBVSxDQUFBLEdBQUEsQ0FBVixHQUFpQixLQUZuQjs7TUFJQSxRQUFBLEdBQVcsTUFBTSxDQUFDLElBQVAsQ0FBWSxTQUFaLENBQXNCLENBQUMsSUFBdkIsQ0FBNEIsRUFBNUI7QUFFWDtlQUNNLElBQUEsTUFBQSxDQUFPLElBQVAsRUFBYSxRQUFiLEVBRE47T0FBQSxhQUFBO2VBR00sSUFBQSxNQUFBLENBQU8sQ0FBQyxDQUFDLFlBQUYsQ0FBZSxJQUFmLENBQVAsRUFBNkIsUUFBN0IsRUFITjs7SUFaYTs7eUJBaUJmLG1CQUFBLEdBQXFCLFNBQUE7TUFDbkIsSUFBQyxDQUFBLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLE9BQXZDLEdBQWlELElBQUMsQ0FBQTthQUNsRCxJQUFDLENBQUEsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsaUJBQXZDLEdBQTJELElBQUMsQ0FBQTtJQUZ6Qzs7eUJBSXJCLHNCQUFBLEdBQXdCLFNBQUE7TUFDdEIsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUM7YUFDbEQsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUMsQ0FBQSxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQztJQUZ0Qzs7OztLQTlERDs7RUFrRW5COzs7SUFDUyxnQkFBQyxNQUFELEVBQVUsUUFBVjtNQUFDLElBQUMsQ0FBQSxTQUFEO01BQVMsSUFBQyxDQUFBLFdBQUQ7O01BQ3JCLHdDQUFNLElBQUMsQ0FBQSxNQUFQLEVBQWUsSUFBQyxDQUFBLFFBQWhCO01BQ0EsSUFBQyxDQUFBLFNBQUQsR0FBaUIsSUFBQSxlQUFBLENBQWdCLElBQWhCO01BQ2pCLElBQUMsQ0FBQSxlQUFELENBQUE7SUFIVzs7cUJBS2IsUUFBQSxHQUFVLFNBQUE7TUFDUixJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBQyxDQUFBLE9BQUQsR0FBVztNQUNoQyxJQUFDLENBQUEsbUJBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxlQUFELENBQUE7YUFDQTtJQUpROztxQkFNVixlQUFBLEdBQWlCLFNBQUE7YUFDZixJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsSUFBQyxDQUFBLGlCQUFuQjtJQURlOzs7O0tBWkU7O0VBZWY7OztJQUNKLGlCQUFDLENBQUEsWUFBRCxHQUFlOztJQUVGLDJCQUFDLE1BQUQsRUFBVSxRQUFWO0FBQ1gsVUFBQTtNQURZLElBQUMsQ0FBQSxTQUFEO01BQVMsSUFBQyxDQUFBLFdBQUQ7TUFDckIsbURBQU0sSUFBQyxDQUFBLE1BQVAsRUFBZSxJQUFDLENBQUEsUUFBaEI7TUFHQSxnQkFBQSxHQUFtQjtNQUNuQixhQUFBLEdBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQkFBaEI7TUFDaEIsSUFBQyxDQUFBLFlBQUQsR0FBb0IsSUFBQSxNQUFBLENBQU8sYUFBQSxJQUFpQixnQkFBeEI7TUFFcEIsWUFBQSxHQUFlLElBQUMsQ0FBQSxtQkFBRCxDQUFBO01BQ2YsSUFBQyxDQUFBLEtBQUQsR0FBYSxJQUFBLEtBQUEsQ0FBTSxZQUFOO01BQ2IsSUFBaUQsWUFBQSxLQUFnQixJQUFDLENBQUEsUUFBUSxDQUFDLG9CQUFWLENBQUEsQ0FBakU7UUFBQSxJQUFDLENBQUEsUUFBUSxDQUFDLGlCQUFWLENBQTRCLFlBQTVCLEVBQUE7O0lBVlc7O2dDQVliLGNBQUEsR0FBZ0IsU0FBQTtBQUNkLFVBQUE7TUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxhQUFSLENBQUE7TUFDVCxTQUFBLEdBQVksTUFBTSxDQUFDLHVDQUFQLENBQStDO1FBQUEsU0FBQSxFQUFXLElBQUMsQ0FBQSxZQUFaO1FBQTBCLGFBQUEsRUFBZSxLQUF6QztPQUEvQztNQUNaLE9BQUEsR0FBWSxNQUFNLENBQUMsaUNBQVAsQ0FBK0M7UUFBQSxTQUFBLEVBQVcsSUFBQyxDQUFBLFlBQVo7UUFBMEIsU0FBQSxFQUFXLEtBQXJDO09BQS9DO01BQ1osY0FBQSxHQUFpQixNQUFNLENBQUMsaUJBQVAsQ0FBQTtNQUVqQixJQUFHLE9BQU8sQ0FBQyxNQUFSLEtBQWtCLGNBQWMsQ0FBQyxNQUFwQztRQUVFLE9BQUEsR0FBVSxNQUFNLENBQUMsaUNBQVAsQ0FBK0M7VUFBQSxTQUFBLEVBQVcsSUFBQyxDQUFBLFlBQVo7VUFBMEIsU0FBQSxFQUFXLElBQXJDO1NBQS9DO1FBQ1YsSUFBYSxPQUFPLENBQUMsR0FBUixLQUFpQixjQUFjLENBQUMsR0FBN0M7QUFBQSxpQkFBTyxHQUFQOztRQUVBLE1BQU0sQ0FBQyxpQkFBUCxDQUF5QixPQUF6QjtRQUNBLFNBQUEsR0FBWSxNQUFNLENBQUMsdUNBQVAsQ0FBK0M7VUFBQSxTQUFBLEVBQVcsSUFBQyxDQUFBLFlBQVo7VUFBMEIsYUFBQSxFQUFlLEtBQXpDO1NBQS9DLEVBTmQ7O01BUUEsTUFBTSxDQUFDLGlCQUFQLENBQXlCLFNBQXpCO2FBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixDQUFDLFNBQUQsRUFBWSxPQUFaLENBQTdCO0lBaEJjOztnQ0FrQmhCLGFBQUEsR0FBZSxTQUFDLE1BQUQ7QUFDYixVQUFBO01BQUEsR0FBQSxHQUFNLE1BQU0sQ0FBQyxpQ0FBUCxDQUF5QztRQUFBLFNBQUEsRUFBVyxJQUFDLENBQUEsWUFBWjtPQUF6QztNQUNOLE1BQUEsR0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQUE7YUFDVCxHQUFHLENBQUMsR0FBSixLQUFXLE1BQU0sQ0FBQyxHQUFsQixJQUEwQixHQUFHLENBQUMsTUFBSixLQUFjLE1BQU0sQ0FBQztJQUhsQzs7Z0NBS2YsbUJBQUEsR0FBcUIsU0FBQTtBQUNuQixVQUFBO01BQUEsVUFBQSxHQUFhLElBQUMsQ0FBQSxjQUFELENBQUE7TUFDYixJQUFHLFVBQVUsQ0FBQyxNQUFYLEdBQW9CLENBQXZCO1FBQ0UsSUFBRyxJQUFJLENBQUMsSUFBTCxDQUFVLFVBQVYsQ0FBSDtpQkFBaUMsVUFBRCxHQUFZLE1BQTVDO1NBQUEsTUFBQTtpQkFBc0QsS0FBQSxHQUFNLFVBQU4sR0FBaUIsTUFBdkU7U0FERjtPQUFBLE1BQUE7ZUFHRSxXQUhGOztJQUZtQjs7Z0NBT3JCLFVBQUEsR0FBWSxTQUFBO2FBQUc7SUFBSDs7Z0NBRVosT0FBQSxHQUFTLFNBQUMsS0FBRDs7UUFBQyxRQUFNOztNQUNkLElBQWdCLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQWxCLEdBQTJCLENBQTNDO2VBQUEsK0NBQU0sS0FBTixFQUFBOztJQURPOzs7O0tBL0NxQjs7RUFrRGhDLFlBQUEsR0FBZSxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWDs7RUFDZixhQUFBLEdBQWdCLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYOztFQUNoQixVQUFBLEdBQWlCLElBQUEsTUFBQSxDQUFPLFlBQVksQ0FBQyxNQUFiLENBQW9CLGFBQXBCLENBQWtDLENBQUMsR0FBbkMsQ0FBdUMsQ0FBQyxDQUFDLFlBQXpDLENBQXNELENBQUMsSUFBdkQsQ0FBNEQsR0FBNUQsQ0FBUDs7RUFFWDs7Ozs7OztvQ0FDSixtQkFBQSxHQUFxQjs7b0NBRXJCLFVBQUEsR0FBWSxTQUFBO2FBQUc7SUFBSDs7b0NBRVosY0FBQSxHQUFnQixTQUFDLGFBQUQsRUFBZ0IsT0FBaEIsRUFBeUIsV0FBekIsRUFBc0MsWUFBdEM7QUFDZCxVQUFBO01BQUEsS0FBQSxHQUFRO01BQ1IsS0FBQSxHQUFRLGFBQWEsQ0FBQyxJQUFkLENBQUE7TUFDUixVQUFBLEdBQWEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixLQUFLLENBQUMsR0FBbkMsQ0FBdUMsQ0FBQztNQUNyRCxXQUFBLEdBQWMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUFBLENBQThCLENBQUMsU0FBL0IsQ0FBeUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF6QztNQUNkLFNBQUEsR0FBZSxPQUFILEdBQWdCLENBQUMsQ0FBakIsR0FBd0I7QUFFcEMsYUFBQSxJQUFBO1FBQ0UsU0FBQSxHQUFZLElBQUMsQ0FBQSxXQUFELENBQWEsS0FBYjtRQUNaLElBQVcsU0FBQSxLQUFhLFdBQXhCO1VBQUEsS0FBQSxHQUFBOztRQUNBLElBQVcsU0FBQSxLQUFhLFlBQXhCO1VBQUEsS0FBQSxHQUFBOztRQUVBLElBQWdCLEtBQUEsS0FBUyxDQUF6QjtBQUFBLGlCQUFPLE1BQVA7O1FBRUEsS0FBSyxDQUFDLE1BQU4sSUFBZ0I7UUFFaEIsSUFBZSxLQUFBLEdBQVEsQ0FBdkI7QUFBQSxpQkFBTyxLQUFQOztRQUNBLElBQWUsS0FBSyxDQUFDLE9BQU4sQ0FBYyxDQUFDLENBQUQsRUFBSSxDQUFDLENBQUwsQ0FBZCxDQUFmO0FBQUEsaUJBQU8sS0FBUDs7UUFDQSxJQUFlLEtBQUssQ0FBQyxPQUFOLENBQWMsV0FBZCxDQUFmO0FBQUEsaUJBQU8sS0FBUDs7UUFFQSxJQUFHLEtBQUssQ0FBQyxNQUFOLEdBQWUsQ0FBbEI7VUFDRSxLQUFLLENBQUMsR0FBTjtVQUNBLFVBQUEsR0FBYSxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLEtBQUssQ0FBQyxHQUFuQyxDQUF1QyxDQUFDO1VBQ3JELEtBQUssQ0FBQyxNQUFOLEdBQWUsVUFBQSxHQUFhLEVBSDlCO1NBQUEsTUFJSyxJQUFHLEtBQUssQ0FBQyxNQUFOLElBQWdCLFVBQW5CO1VBQ0gsS0FBSyxDQUFDLEdBQU47VUFDQSxVQUFBLEdBQWEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixLQUFLLENBQUMsR0FBbkMsQ0FBdUMsQ0FBQztVQUNyRCxLQUFLLENBQUMsTUFBTixHQUFlLEVBSFo7O01BakJQO0lBUGM7O29DQTZCaEIsV0FBQSxHQUFhLFNBQUMsUUFBRDthQUNYLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsQ0FBQyxRQUFELEVBQVcsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFuQixDQUFYLENBQTdCO0lBRFc7O29DQUdiLGFBQUEsR0FBZSxTQUFDLFFBQUQ7QUFDYixVQUFBO01BQUEsU0FBQSxHQUFZLElBQUMsQ0FBQSxXQUFELENBQWEsUUFBYjtNQUNaLElBQUcsQ0FBQyxLQUFBLEdBQVEsWUFBWSxDQUFDLE9BQWIsQ0FBcUIsU0FBckIsQ0FBVCxDQUFBLElBQTZDLENBQWhEO2VBQ0UsQ0FBQyxTQUFELEVBQVksYUFBYyxDQUFBLEtBQUEsQ0FBMUIsRUFBa0MsS0FBbEMsRUFERjtPQUFBLE1BRUssSUFBRyxDQUFDLEtBQUEsR0FBUSxhQUFhLENBQUMsT0FBZCxDQUFzQixTQUF0QixDQUFULENBQUEsSUFBOEMsQ0FBakQ7ZUFDSCxDQUFDLFNBQUQsRUFBWSxZQUFhLENBQUEsS0FBQSxDQUF6QixFQUFpQyxJQUFqQyxFQURHO09BQUEsTUFBQTtlQUdILEdBSEc7O0lBSlE7O29DQVNmLFVBQUEsR0FBWSxTQUFDLE1BQUQ7QUFDVixVQUFBO01BQUEsYUFBQSxHQUFnQixNQUFNLENBQUMsaUJBQVAsQ0FBQTtNQUVoQixPQUF1QyxJQUFDLENBQUEsYUFBRCxDQUFlLGFBQWYsQ0FBdkMsRUFBQyxxQkFBRCxFQUFjLHNCQUFkLEVBQTRCO01BRTVCLElBQU8sbUJBQVA7UUFDRSxVQUFBLEdBQWEsQ0FBQyxhQUFELEVBQWdCLENBQUMsYUFBYSxDQUFDLEdBQWYsRUFBb0IsS0FBcEIsQ0FBaEI7UUFDYixJQUFDLENBQUEsTUFBTSxDQUFDLGlCQUFSLENBQTBCLFVBQTFCLEVBQXNDLFVBQXRDLEVBQWtELFNBQUMsR0FBRDtBQUNoRCxjQUFBO1VBRGtELG1CQUFPO1VBQ3pELGFBQUEsR0FBZ0IsS0FBSyxDQUFDO2lCQUN0QixJQUFBLENBQUE7UUFGZ0QsQ0FBbEQsRUFGRjs7TUFNQSxPQUF1QyxJQUFDLENBQUEsYUFBRCxDQUFlLGFBQWYsQ0FBdkMsRUFBQyxxQkFBRCxFQUFjLHNCQUFkLEVBQTRCO01BRTVCLElBQWMsbUJBQWQ7QUFBQSxlQUFBOztNQUVBLElBQUcsYUFBQSxHQUFnQixJQUFDLENBQUEsY0FBRCxDQUFnQixhQUFoQixFQUErQixPQUEvQixFQUF3QyxXQUF4QyxFQUFxRCxZQUFyRCxDQUFuQjtlQUNFLE1BQU0sQ0FBQyxpQkFBUCxDQUF5QixhQUF6QixFQURGOztJQWZVOzs7O0tBOUNzQjs7RUFnRTlCOzs7SUFDUyxzQkFBQyxNQUFELEVBQVUsUUFBVjtBQUNYLFVBQUE7TUFEWSxJQUFDLENBQUEsU0FBRDtNQUFTLElBQUMsQ0FBQSxXQUFEO01BQ3JCLDhDQUFNLElBQUMsQ0FBQSxNQUFQLEVBQWUsSUFBQyxDQUFBLFFBQWhCLEVBQTBCO1FBQUEsdUJBQUEsRUFBeUIsSUFBekI7T0FBMUI7TUFDQSxJQUFDLENBQUEsS0FBRCxHQUFhLElBQUEsS0FBQSxpRUFBMEMsRUFBMUM7TUFDYixJQUFDLENBQUEsc0JBQUQsQ0FBQTtJQUhXOzsyQkFLYixVQUFBLEdBQVksU0FBQTthQUFHO0lBQUg7OzJCQUVaLFFBQUEsR0FBVSxTQUFBO01BQ1IsSUFBQyxDQUFBLE9BQUQsR0FBVyxDQUFJLElBQUMsQ0FBQTthQUNoQjtJQUZROzs7O0tBUmU7O0VBYTNCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBQUMsUUFBQSxNQUFEO0lBQVMsbUJBQUEsaUJBQVQ7SUFBNEIsdUJBQUEscUJBQTVCO0lBQW1ELGNBQUEsWUFBbkQ7O0FBM05qQiIsInNvdXJjZXNDb250ZW50IjpbIl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG57TW90aW9uV2l0aElucHV0fSA9IHJlcXVpcmUgJy4vZ2VuZXJhbC1tb3Rpb25zJ1xuU2VhcmNoVmlld01vZGVsID0gcmVxdWlyZSAnLi4vdmlldy1tb2RlbHMvc2VhcmNoLXZpZXctbW9kZWwnXG57SW5wdXR9ID0gcmVxdWlyZSAnLi4vdmlldy1tb2RlbHMvdmlldy1tb2RlbCdcbntQb2ludCwgUmFuZ2V9ID0gcmVxdWlyZSAnYXRvbSdcbnNldHRpbmdzID0gcmVxdWlyZSAnLi4vc2V0dGluZ3MnXG5cbmNsYXNzIFNlYXJjaEJhc2UgZXh0ZW5kcyBNb3Rpb25XaXRoSW5wdXRcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBAdmltU3RhdGUsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICBzdXBlcihAZWRpdG9yLCBAdmltU3RhdGUpXG4gICAgQHJldmVyc2UgPSBAaW5pdGlhbGx5UmV2ZXJzZWQgPSBmYWxzZVxuICAgIEB1cGRhdGVDdXJyZW50U2VhcmNoKCkgdW5sZXNzIG9wdGlvbnMuZG9udFVwZGF0ZUN1cnJlbnRTZWFyY2hcblxuICByZXZlcnNlZDogPT5cbiAgICBAaW5pdGlhbGx5UmV2ZXJzZWQgPSBAcmV2ZXJzZSA9IHRydWVcbiAgICBAdXBkYXRlQ3VycmVudFNlYXJjaCgpXG4gICAgdGhpc1xuXG4gIG1vdmVDdXJzb3I6IChjdXJzb3IsIGNvdW50PTEpIC0+XG4gICAgcmFuZ2VzID0gQHNjYW4oY3Vyc29yKVxuICAgIGlmIHJhbmdlcy5sZW5ndGggPiAwXG4gICAgICByYW5nZSA9IHJhbmdlc1soY291bnQgLSAxKSAlIHJhbmdlcy5sZW5ndGhdXG4gICAgICBjdXJzb3Iuc2V0QnVmZmVyUG9zaXRpb24ocmFuZ2Uuc3RhcnQpXG4gICAgZWxzZVxuICAgICAgYXRvbS5iZWVwKClcblxuICBzY2FuOiAoY3Vyc29yKSAtPlxuICAgIHJldHVybiBbXSBpZiBAaW5wdXQuY2hhcmFjdGVycyBpcyBcIlwiXG5cbiAgICBjdXJyZW50UG9zaXRpb24gPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuXG4gICAgW3Jhbmdlc0JlZm9yZSwgcmFuZ2VzQWZ0ZXJdID0gW1tdLCBbXV1cbiAgICBAZWRpdG9yLnNjYW4gQGdldFNlYXJjaFRlcm0oQGlucHV0LmNoYXJhY3RlcnMpLCAoe3JhbmdlfSkgPT5cbiAgICAgIGlzQmVmb3JlID0gaWYgQHJldmVyc2VcbiAgICAgICAgcmFuZ2Uuc3RhcnQuY29tcGFyZShjdXJyZW50UG9zaXRpb24pIDwgMFxuICAgICAgZWxzZVxuICAgICAgICByYW5nZS5zdGFydC5jb21wYXJlKGN1cnJlbnRQb3NpdGlvbikgPD0gMFxuXG4gICAgICBpZiBpc0JlZm9yZVxuICAgICAgICByYW5nZXNCZWZvcmUucHVzaChyYW5nZSlcbiAgICAgIGVsc2VcbiAgICAgICAgcmFuZ2VzQWZ0ZXIucHVzaChyYW5nZSlcblxuICAgIGlmIEByZXZlcnNlXG4gICAgICByYW5nZXNBZnRlci5jb25jYXQocmFuZ2VzQmVmb3JlKS5yZXZlcnNlKClcbiAgICBlbHNlXG4gICAgICByYW5nZXNBZnRlci5jb25jYXQocmFuZ2VzQmVmb3JlKVxuXG4gIGdldFNlYXJjaFRlcm06ICh0ZXJtKSAtPlxuICAgIG1vZGlmaWVycyA9IHsnZyc6IHRydWV9XG5cbiAgICBpZiBub3QgdGVybS5tYXRjaCgnW0EtWl0nKSBhbmQgc2V0dGluZ3MudXNlU21hcnRjYXNlRm9yU2VhcmNoKClcbiAgICAgIG1vZGlmaWVyc1snaSddID0gdHJ1ZVxuXG4gICAgaWYgdGVybS5pbmRleE9mKCdcXFxcYycpID49IDBcbiAgICAgIHRlcm0gPSB0ZXJtLnJlcGxhY2UoJ1xcXFxjJywgJycpXG4gICAgICBtb2RpZmllcnNbJ2knXSA9IHRydWVcblxuICAgIG1vZEZsYWdzID0gT2JqZWN0LmtleXMobW9kaWZpZXJzKS5qb2luKCcnKVxuXG4gICAgdHJ5XG4gICAgICBuZXcgUmVnRXhwKHRlcm0sIG1vZEZsYWdzKVxuICAgIGNhdGNoXG4gICAgICBuZXcgUmVnRXhwKF8uZXNjYXBlUmVnRXhwKHRlcm0pLCBtb2RGbGFncylcblxuICB1cGRhdGVDdXJyZW50U2VhcmNoOiAtPlxuICAgIEB2aW1TdGF0ZS5nbG9iYWxWaW1TdGF0ZS5jdXJyZW50U2VhcmNoLnJldmVyc2UgPSBAcmV2ZXJzZVxuICAgIEB2aW1TdGF0ZS5nbG9iYWxWaW1TdGF0ZS5jdXJyZW50U2VhcmNoLmluaXRpYWxseVJldmVyc2VkID0gQGluaXRpYWxseVJldmVyc2VkXG5cbiAgcmVwbGljYXRlQ3VycmVudFNlYXJjaDogLT5cbiAgICBAcmV2ZXJzZSA9IEB2aW1TdGF0ZS5nbG9iYWxWaW1TdGF0ZS5jdXJyZW50U2VhcmNoLnJldmVyc2VcbiAgICBAaW5pdGlhbGx5UmV2ZXJzZWQgPSBAdmltU3RhdGUuZ2xvYmFsVmltU3RhdGUuY3VycmVudFNlYXJjaC5pbml0aWFsbHlSZXZlcnNlZFxuXG5jbGFzcyBTZWFyY2ggZXh0ZW5kcyBTZWFyY2hCYXNlXG4gIGNvbnN0cnVjdG9yOiAoQGVkaXRvciwgQHZpbVN0YXRlKSAtPlxuICAgIHN1cGVyKEBlZGl0b3IsIEB2aW1TdGF0ZSlcbiAgICBAdmlld01vZGVsID0gbmV3IFNlYXJjaFZpZXdNb2RlbCh0aGlzKVxuICAgIEB1cGRhdGVWaWV3TW9kZWwoKVxuXG4gIHJldmVyc2VkOiA9PlxuICAgIEBpbml0aWFsbHlSZXZlcnNlZCA9IEByZXZlcnNlID0gdHJ1ZVxuICAgIEB1cGRhdGVDdXJyZW50U2VhcmNoKClcbiAgICBAdXBkYXRlVmlld01vZGVsKClcbiAgICB0aGlzXG5cbiAgdXBkYXRlVmlld01vZGVsOiAtPlxuICAgIEB2aWV3TW9kZWwudXBkYXRlKEBpbml0aWFsbHlSZXZlcnNlZClcblxuY2xhc3MgU2VhcmNoQ3VycmVudFdvcmQgZXh0ZW5kcyBTZWFyY2hCYXNlXG4gIEBrZXl3b3JkUmVnZXg6IG51bGxcblxuICBjb25zdHJ1Y3RvcjogKEBlZGl0b3IsIEB2aW1TdGF0ZSkgLT5cbiAgICBzdXBlcihAZWRpdG9yLCBAdmltU3RhdGUpXG5cbiAgICAjIEZJWE1FOiBUaGlzIG11c3QgZGVwZW5kIG9uIHRoZSBjdXJyZW50IGxhbmd1YWdlXG4gICAgZGVmYXVsdElzS2V5d29yZCA9IFwiW0BhLXpBLVowLTlfXFwtXStcIlxuICAgIHVzZXJJc0tleXdvcmQgPSBhdG9tLmNvbmZpZy5nZXQoJ3ZpbS1tb2RlLmlza2V5d29yZCcpXG4gICAgQGtleXdvcmRSZWdleCA9IG5ldyBSZWdFeHAodXNlcklzS2V5d29yZCBvciBkZWZhdWx0SXNLZXl3b3JkKVxuXG4gICAgc2VhcmNoU3RyaW5nID0gQGdldEN1cnJlbnRXb3JkTWF0Y2goKVxuICAgIEBpbnB1dCA9IG5ldyBJbnB1dChzZWFyY2hTdHJpbmcpXG4gICAgQHZpbVN0YXRlLnB1c2hTZWFyY2hIaXN0b3J5KHNlYXJjaFN0cmluZykgdW5sZXNzIHNlYXJjaFN0cmluZyBpcyBAdmltU3RhdGUuZ2V0U2VhcmNoSGlzdG9yeUl0ZW0oKVxuXG4gIGdldEN1cnJlbnRXb3JkOiAtPlxuICAgIGN1cnNvciA9IEBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpXG4gICAgd29yZFN0YXJ0ID0gY3Vyc29yLmdldEJlZ2lubmluZ09mQ3VycmVudFdvcmRCdWZmZXJQb3NpdGlvbih3b3JkUmVnZXg6IEBrZXl3b3JkUmVnZXgsIGFsbG93UHJldmlvdXM6IGZhbHNlKVxuICAgIHdvcmRFbmQgICA9IGN1cnNvci5nZXRFbmRPZkN1cnJlbnRXb3JkQnVmZmVyUG9zaXRpb24gICAgICAod29yZFJlZ2V4OiBAa2V5d29yZFJlZ2V4LCBhbGxvd05leHQ6IGZhbHNlKVxuICAgIGN1cnNvclBvc2l0aW9uID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcblxuICAgIGlmIHdvcmRFbmQuY29sdW1uIGlzIGN1cnNvclBvc2l0aW9uLmNvbHVtblxuICAgICAgIyBlaXRoZXIgd2UgZG9uJ3QgaGF2ZSBhIGN1cnJlbnQgd29yZCwgb3IgaXQgZW5kcyBvbiBjdXJzb3IsIGkuZS4gcHJlY2VkZXMgaXQsIHNvIGxvb2sgZm9yIHRoZSBuZXh0IG9uZVxuICAgICAgd29yZEVuZCA9IGN1cnNvci5nZXRFbmRPZkN1cnJlbnRXb3JkQnVmZmVyUG9zaXRpb24gICAgICAod29yZFJlZ2V4OiBAa2V5d29yZFJlZ2V4LCBhbGxvd05leHQ6IHRydWUpXG4gICAgICByZXR1cm4gXCJcIiBpZiB3b3JkRW5kLnJvdyBpc250IGN1cnNvclBvc2l0aW9uLnJvdyAjIGRvbid0IGxvb2sgYmV5b25kIHRoZSBjdXJyZW50IGxpbmVcblxuICAgICAgY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uIHdvcmRFbmRcbiAgICAgIHdvcmRTdGFydCA9IGN1cnNvci5nZXRCZWdpbm5pbmdPZkN1cnJlbnRXb3JkQnVmZmVyUG9zaXRpb24od29yZFJlZ2V4OiBAa2V5d29yZFJlZ2V4LCBhbGxvd1ByZXZpb3VzOiBmYWxzZSlcblxuICAgIGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbiB3b3JkU3RhcnRcblxuICAgIEBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoW3dvcmRTdGFydCwgd29yZEVuZF0pXG5cbiAgY3Vyc29ySXNPbkVPRjogKGN1cnNvcikgLT5cbiAgICBwb3MgPSBjdXJzb3IuZ2V0TmV4dFdvcmRCb3VuZGFyeUJ1ZmZlclBvc2l0aW9uKHdvcmRSZWdleDogQGtleXdvcmRSZWdleClcbiAgICBlb2ZQb3MgPSBAZWRpdG9yLmdldEVvZkJ1ZmZlclBvc2l0aW9uKClcbiAgICBwb3Mucm93IGlzIGVvZlBvcy5yb3cgYW5kIHBvcy5jb2x1bW4gaXMgZW9mUG9zLmNvbHVtblxuXG4gIGdldEN1cnJlbnRXb3JkTWF0Y2g6IC0+XG4gICAgY2hhcmFjdGVycyA9IEBnZXRDdXJyZW50V29yZCgpXG4gICAgaWYgY2hhcmFjdGVycy5sZW5ndGggPiAwXG4gICAgICBpZiAvXFxXLy50ZXN0KGNoYXJhY3RlcnMpIHRoZW4gXCIje2NoYXJhY3RlcnN9XFxcXGJcIiBlbHNlIFwiXFxcXGIje2NoYXJhY3RlcnN9XFxcXGJcIlxuICAgIGVsc2VcbiAgICAgIGNoYXJhY3RlcnNcblxuICBpc0NvbXBsZXRlOiAtPiB0cnVlXG5cbiAgZXhlY3V0ZTogKGNvdW50PTEpIC0+XG4gICAgc3VwZXIoY291bnQpIGlmIEBpbnB1dC5jaGFyYWN0ZXJzLmxlbmd0aCA+IDBcblxuT3BlbkJyYWNrZXRzID0gWycoJywgJ3snLCAnWyddXG5DbG9zZUJyYWNrZXRzID0gWycpJywgJ30nLCAnXSddXG5BbnlCcmFja2V0ID0gbmV3IFJlZ0V4cChPcGVuQnJhY2tldHMuY29uY2F0KENsb3NlQnJhY2tldHMpLm1hcChfLmVzY2FwZVJlZ0V4cCkuam9pbihcInxcIikpXG5cbmNsYXNzIEJyYWNrZXRNYXRjaGluZ01vdGlvbiBleHRlbmRzIFNlYXJjaEJhc2VcbiAgb3BlcmF0ZXNJbmNsdXNpdmVseTogdHJ1ZVxuXG4gIGlzQ29tcGxldGU6IC0+IHRydWVcblxuICBzZWFyY2hGb3JNYXRjaDogKHN0YXJ0UG9zaXRpb24sIHJldmVyc2UsIGluQ2hhcmFjdGVyLCBvdXRDaGFyYWN0ZXIpIC0+XG4gICAgZGVwdGggPSAwXG4gICAgcG9pbnQgPSBzdGFydFBvc2l0aW9uLmNvcHkoKVxuICAgIGxpbmVMZW5ndGggPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHBvaW50LnJvdykubGVuZ3RoXG4gICAgZW9mUG9zaXRpb24gPSBAZWRpdG9yLmdldEVvZkJ1ZmZlclBvc2l0aW9uKCkudHJhbnNsYXRlKFswLCAxXSlcbiAgICBpbmNyZW1lbnQgPSBpZiByZXZlcnNlIHRoZW4gLTEgZWxzZSAxXG5cbiAgICBsb29wXG4gICAgICBjaGFyYWN0ZXIgPSBAY2hhcmFjdGVyQXQocG9pbnQpXG4gICAgICBkZXB0aCsrIGlmIGNoYXJhY3RlciBpcyBpbkNoYXJhY3RlclxuICAgICAgZGVwdGgtLSBpZiBjaGFyYWN0ZXIgaXMgb3V0Q2hhcmFjdGVyXG5cbiAgICAgIHJldHVybiBwb2ludCBpZiBkZXB0aCBpcyAwXG5cbiAgICAgIHBvaW50LmNvbHVtbiArPSBpbmNyZW1lbnRcblxuICAgICAgcmV0dXJuIG51bGwgaWYgZGVwdGggPCAwXG4gICAgICByZXR1cm4gbnVsbCBpZiBwb2ludC5pc0VxdWFsKFswLCAtMV0pXG4gICAgICByZXR1cm4gbnVsbCBpZiBwb2ludC5pc0VxdWFsKGVvZlBvc2l0aW9uKVxuXG4gICAgICBpZiBwb2ludC5jb2x1bW4gPCAwXG4gICAgICAgIHBvaW50LnJvdy0tXG4gICAgICAgIGxpbmVMZW5ndGggPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHBvaW50LnJvdykubGVuZ3RoXG4gICAgICAgIHBvaW50LmNvbHVtbiA9IGxpbmVMZW5ndGggLSAxXG4gICAgICBlbHNlIGlmIHBvaW50LmNvbHVtbiA+PSBsaW5lTGVuZ3RoXG4gICAgICAgIHBvaW50LnJvdysrXG4gICAgICAgIGxpbmVMZW5ndGggPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHBvaW50LnJvdykubGVuZ3RoXG4gICAgICAgIHBvaW50LmNvbHVtbiA9IDBcblxuICBjaGFyYWN0ZXJBdDogKHBvc2l0aW9uKSAtPlxuICAgIEBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoW3Bvc2l0aW9uLCBwb3NpdGlvbi50cmFuc2xhdGUoWzAsIDFdKV0pXG5cbiAgZ2V0U2VhcmNoRGF0YTogKHBvc2l0aW9uKSAtPlxuICAgIGNoYXJhY3RlciA9IEBjaGFyYWN0ZXJBdChwb3NpdGlvbilcbiAgICBpZiAoaW5kZXggPSBPcGVuQnJhY2tldHMuaW5kZXhPZihjaGFyYWN0ZXIpKSA+PSAwXG4gICAgICBbY2hhcmFjdGVyLCBDbG9zZUJyYWNrZXRzW2luZGV4XSwgZmFsc2VdXG4gICAgZWxzZSBpZiAoaW5kZXggPSBDbG9zZUJyYWNrZXRzLmluZGV4T2YoY2hhcmFjdGVyKSkgPj0gMFxuICAgICAgW2NoYXJhY3RlciwgT3BlbkJyYWNrZXRzW2luZGV4XSwgdHJ1ZV1cbiAgICBlbHNlXG4gICAgICBbXVxuXG4gIG1vdmVDdXJzb3I6IChjdXJzb3IpIC0+XG4gICAgc3RhcnRQb3NpdGlvbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG5cbiAgICBbaW5DaGFyYWN0ZXIsIG91dENoYXJhY3RlciwgcmV2ZXJzZV0gPSBAZ2V0U2VhcmNoRGF0YShzdGFydFBvc2l0aW9uKVxuXG4gICAgdW5sZXNzIGluQ2hhcmFjdGVyP1xuICAgICAgcmVzdE9mTGluZSA9IFtzdGFydFBvc2l0aW9uLCBbc3RhcnRQb3NpdGlvbi5yb3csIEluZmluaXR5XV1cbiAgICAgIEBlZGl0b3Iuc2NhbkluQnVmZmVyUmFuZ2UgQW55QnJhY2tldCwgcmVzdE9mTGluZSwgKHtyYW5nZSwgc3RvcH0pIC0+XG4gICAgICAgIHN0YXJ0UG9zaXRpb24gPSByYW5nZS5zdGFydFxuICAgICAgICBzdG9wKClcblxuICAgIFtpbkNoYXJhY3Rlciwgb3V0Q2hhcmFjdGVyLCByZXZlcnNlXSA9IEBnZXRTZWFyY2hEYXRhKHN0YXJ0UG9zaXRpb24pXG5cbiAgICByZXR1cm4gdW5sZXNzIGluQ2hhcmFjdGVyP1xuXG4gICAgaWYgbWF0Y2hQb3NpdGlvbiA9IEBzZWFyY2hGb3JNYXRjaChzdGFydFBvc2l0aW9uLCByZXZlcnNlLCBpbkNoYXJhY3Rlciwgb3V0Q2hhcmFjdGVyKVxuICAgICAgY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKG1hdGNoUG9zaXRpb24pXG5cbmNsYXNzIFJlcGVhdFNlYXJjaCBleHRlbmRzIFNlYXJjaEJhc2VcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBAdmltU3RhdGUpIC0+XG4gICAgc3VwZXIoQGVkaXRvciwgQHZpbVN0YXRlLCBkb250VXBkYXRlQ3VycmVudFNlYXJjaDogdHJ1ZSlcbiAgICBAaW5wdXQgPSBuZXcgSW5wdXQoQHZpbVN0YXRlLmdldFNlYXJjaEhpc3RvcnlJdGVtKDApID8gXCJcIilcbiAgICBAcmVwbGljYXRlQ3VycmVudFNlYXJjaCgpXG5cbiAgaXNDb21wbGV0ZTogLT4gdHJ1ZVxuXG4gIHJldmVyc2VkOiAtPlxuICAgIEByZXZlcnNlID0gbm90IEBpbml0aWFsbHlSZXZlcnNlZFxuICAgIHRoaXNcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtTZWFyY2gsIFNlYXJjaEN1cnJlbnRXb3JkLCBCcmFja2V0TWF0Y2hpbmdNb3Rpb24sIFJlcGVhdFNlYXJjaH1cbiJdfQ==
