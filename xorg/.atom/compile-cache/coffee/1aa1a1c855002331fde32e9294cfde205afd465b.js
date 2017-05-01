(function() {
  var SearchViewModel, ViewModel,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ViewModel = require('./view-model').ViewModel;

  module.exports = SearchViewModel = (function(superClass) {
    extend(SearchViewModel, superClass);

    function SearchViewModel(searchMotion) {
      this.searchMotion = searchMotion;
      this.confirm = bind(this.confirm, this);
      this.decreaseHistorySearch = bind(this.decreaseHistorySearch, this);
      this.increaseHistorySearch = bind(this.increaseHistorySearch, this);
      SearchViewModel.__super__.constructor.call(this, this.searchMotion, {
        "class": 'search'
      });
      this.historyIndex = -1;
      atom.commands.add(this.view.editorElement, 'core:move-up', this.increaseHistorySearch);
      atom.commands.add(this.view.editorElement, 'core:move-down', this.decreaseHistorySearch);
    }

    SearchViewModel.prototype.restoreHistory = function(index) {
      return this.view.editorElement.getModel().setText(this.history(index));
    };

    SearchViewModel.prototype.history = function(index) {
      return this.vimState.getSearchHistoryItem(index);
    };

    SearchViewModel.prototype.increaseHistorySearch = function() {
      if (this.history(this.historyIndex + 1) != null) {
        this.historyIndex += 1;
        return this.restoreHistory(this.historyIndex);
      }
    };

    SearchViewModel.prototype.decreaseHistorySearch = function() {
      if (this.historyIndex <= 0) {
        this.historyIndex = -1;
        return this.view.editorElement.getModel().setText('');
      } else {
        this.historyIndex -= 1;
        return this.restoreHistory(this.historyIndex);
      }
    };

    SearchViewModel.prototype.confirm = function(view) {
      var lastSearch, repeatChar;
      repeatChar = this.searchMotion.initiallyReversed ? '?' : '/';
      if (this.view.value === '' || this.view.value === repeatChar) {
        lastSearch = this.history(0);
        if (lastSearch != null) {
          this.view.value = lastSearch;
        } else {
          this.view.value = '';
          atom.beep();
        }
      }
      SearchViewModel.__super__.confirm.call(this, view);
      return this.vimState.pushSearchHistory(this.view.value);
    };

    SearchViewModel.prototype.update = function(reverse) {
      if (reverse) {
        this.view.classList.add('reverse-search-input');
        return this.view.classList.remove('search-input');
      } else {
        this.view.classList.add('search-input');
        return this.view.classList.remove('reverse-search-input');
      }
    };

    return SearchViewModel;

  })(ViewModel);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi92aWV3LW1vZGVscy9zZWFyY2gtdmlldy1tb2RlbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDBCQUFBO0lBQUE7Ozs7RUFBQyxZQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUVkLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztJQUNTLHlCQUFDLFlBQUQ7TUFBQyxJQUFDLENBQUEsZUFBRDs7OztNQUNaLGlEQUFNLElBQUMsQ0FBQSxZQUFQLEVBQXFCO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxRQUFQO09BQXJCO01BQ0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsQ0FBQztNQUVqQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLElBQUksQ0FBQyxhQUF4QixFQUF1QyxjQUF2QyxFQUF1RCxJQUFDLENBQUEscUJBQXhEO01BQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxJQUFJLENBQUMsYUFBeEIsRUFBdUMsZ0JBQXZDLEVBQXlELElBQUMsQ0FBQSxxQkFBMUQ7SUFMVzs7OEJBT2IsY0FBQSxHQUFnQixTQUFDLEtBQUQ7YUFDZCxJQUFDLENBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFwQixDQUFBLENBQThCLENBQUMsT0FBL0IsQ0FBdUMsSUFBQyxDQUFBLE9BQUQsQ0FBUyxLQUFULENBQXZDO0lBRGM7OzhCQUdoQixPQUFBLEdBQVMsU0FBQyxLQUFEO2FBQ1AsSUFBQyxDQUFBLFFBQVEsQ0FBQyxvQkFBVixDQUErQixLQUEvQjtJQURPOzs4QkFHVCxxQkFBQSxHQUF1QixTQUFBO01BQ3JCLElBQUcsMkNBQUg7UUFDRSxJQUFDLENBQUEsWUFBRCxJQUFpQjtlQUNqQixJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFDLENBQUEsWUFBakIsRUFGRjs7SUFEcUI7OzhCQUt2QixxQkFBQSxHQUF1QixTQUFBO01BQ3JCLElBQUcsSUFBQyxDQUFBLFlBQUQsSUFBaUIsQ0FBcEI7UUFFRSxJQUFDLENBQUEsWUFBRCxHQUFnQixDQUFDO2VBQ2pCLElBQUMsQ0FBQSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQXBCLENBQUEsQ0FBOEIsQ0FBQyxPQUEvQixDQUF1QyxFQUF2QyxFQUhGO09BQUEsTUFBQTtRQUtFLElBQUMsQ0FBQSxZQUFELElBQWlCO2VBQ2pCLElBQUMsQ0FBQSxjQUFELENBQWdCLElBQUMsQ0FBQSxZQUFqQixFQU5GOztJQURxQjs7OEJBU3ZCLE9BQUEsR0FBUyxTQUFDLElBQUQ7QUFDUCxVQUFBO01BQUEsVUFBQSxHQUFnQixJQUFDLENBQUEsWUFBWSxDQUFDLGlCQUFqQixHQUF3QyxHQUF4QyxHQUFpRDtNQUM5RCxJQUFHLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixLQUFlLEVBQWYsSUFBcUIsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLEtBQWUsVUFBdkM7UUFDRSxVQUFBLEdBQWEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxDQUFUO1FBQ2IsSUFBRyxrQkFBSDtVQUNFLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixHQUFjLFdBRGhCO1NBQUEsTUFBQTtVQUdFLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixHQUFjO1VBQ2QsSUFBSSxDQUFDLElBQUwsQ0FBQSxFQUpGO1NBRkY7O01BT0EsNkNBQU0sSUFBTjthQUNBLElBQUMsQ0FBQSxRQUFRLENBQUMsaUJBQVYsQ0FBNEIsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFsQztJQVZPOzs4QkFZVCxNQUFBLEdBQVEsU0FBQyxPQUFEO01BQ04sSUFBRyxPQUFIO1FBQ0UsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBaEIsQ0FBb0Isc0JBQXBCO2VBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBaEIsQ0FBdUIsY0FBdkIsRUFGRjtPQUFBLE1BQUE7UUFJRSxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFoQixDQUFvQixjQUFwQjtlQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQWhCLENBQXVCLHNCQUF2QixFQUxGOztJQURNOzs7O0tBeENvQjtBQUg5QiIsInNvdXJjZXNDb250ZW50IjpbIntWaWV3TW9kZWx9ID0gcmVxdWlyZSAnLi92aWV3LW1vZGVsJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBTZWFyY2hWaWV3TW9kZWwgZXh0ZW5kcyBWaWV3TW9kZWxcbiAgY29uc3RydWN0b3I6IChAc2VhcmNoTW90aW9uKSAtPlxuICAgIHN1cGVyKEBzZWFyY2hNb3Rpb24sIGNsYXNzOiAnc2VhcmNoJylcbiAgICBAaGlzdG9yeUluZGV4ID0gLTFcblxuICAgIGF0b20uY29tbWFuZHMuYWRkKEB2aWV3LmVkaXRvckVsZW1lbnQsICdjb3JlOm1vdmUtdXAnLCBAaW5jcmVhc2VIaXN0b3J5U2VhcmNoKVxuICAgIGF0b20uY29tbWFuZHMuYWRkKEB2aWV3LmVkaXRvckVsZW1lbnQsICdjb3JlOm1vdmUtZG93bicsIEBkZWNyZWFzZUhpc3RvcnlTZWFyY2gpXG5cbiAgcmVzdG9yZUhpc3Rvcnk6IChpbmRleCkgLT5cbiAgICBAdmlldy5lZGl0b3JFbGVtZW50LmdldE1vZGVsKCkuc2V0VGV4dChAaGlzdG9yeShpbmRleCkpXG5cbiAgaGlzdG9yeTogKGluZGV4KSAtPlxuICAgIEB2aW1TdGF0ZS5nZXRTZWFyY2hIaXN0b3J5SXRlbShpbmRleClcblxuICBpbmNyZWFzZUhpc3RvcnlTZWFyY2g6ID0+XG4gICAgaWYgQGhpc3RvcnkoQGhpc3RvcnlJbmRleCArIDEpP1xuICAgICAgQGhpc3RvcnlJbmRleCArPSAxXG4gICAgICBAcmVzdG9yZUhpc3RvcnkoQGhpc3RvcnlJbmRleClcblxuICBkZWNyZWFzZUhpc3RvcnlTZWFyY2g6ID0+XG4gICAgaWYgQGhpc3RvcnlJbmRleCA8PSAwXG4gICAgICAjIGdldCB1cyBiYWNrIHRvIGEgY2xlYW4gc2xhdGVcbiAgICAgIEBoaXN0b3J5SW5kZXggPSAtMVxuICAgICAgQHZpZXcuZWRpdG9yRWxlbWVudC5nZXRNb2RlbCgpLnNldFRleHQoJycpXG4gICAgZWxzZVxuICAgICAgQGhpc3RvcnlJbmRleCAtPSAxXG4gICAgICBAcmVzdG9yZUhpc3RvcnkoQGhpc3RvcnlJbmRleClcblxuICBjb25maXJtOiAodmlldykgPT5cbiAgICByZXBlYXRDaGFyID0gaWYgQHNlYXJjaE1vdGlvbi5pbml0aWFsbHlSZXZlcnNlZCB0aGVuICc/JyBlbHNlICcvJ1xuICAgIGlmIEB2aWV3LnZhbHVlIGlzICcnIG9yIEB2aWV3LnZhbHVlIGlzIHJlcGVhdENoYXJcbiAgICAgIGxhc3RTZWFyY2ggPSBAaGlzdG9yeSgwKVxuICAgICAgaWYgbGFzdFNlYXJjaD9cbiAgICAgICAgQHZpZXcudmFsdWUgPSBsYXN0U2VhcmNoXG4gICAgICBlbHNlXG4gICAgICAgIEB2aWV3LnZhbHVlID0gJydcbiAgICAgICAgYXRvbS5iZWVwKClcbiAgICBzdXBlcih2aWV3KVxuICAgIEB2aW1TdGF0ZS5wdXNoU2VhcmNoSGlzdG9yeShAdmlldy52YWx1ZSlcblxuICB1cGRhdGU6IChyZXZlcnNlKSAtPlxuICAgIGlmIHJldmVyc2VcbiAgICAgIEB2aWV3LmNsYXNzTGlzdC5hZGQoJ3JldmVyc2Utc2VhcmNoLWlucHV0JylcbiAgICAgIEB2aWV3LmNsYXNzTGlzdC5yZW1vdmUoJ3NlYXJjaC1pbnB1dCcpXG4gICAgZWxzZVxuICAgICAgQHZpZXcuY2xhc3NMaXN0LmFkZCgnc2VhcmNoLWlucHV0JylcbiAgICAgIEB2aWV3LmNsYXNzTGlzdC5yZW1vdmUoJ3JldmVyc2Utc2VhcmNoLWlucHV0JylcbiJdfQ==
