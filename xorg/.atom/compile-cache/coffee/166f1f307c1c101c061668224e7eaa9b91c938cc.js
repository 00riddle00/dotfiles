(function() {
  var FormatText, LineMeta, config, utils;

  config = require("../config");

  utils = require("../utils");

  LineMeta = require("../helpers/line-meta");

  module.exports = FormatText = (function() {
    function FormatText(action) {
      this.action = action;
      this.editor = atom.workspace.getActiveTextEditor();
    }

    FormatText.prototype.trigger = function(e) {
      var fn;
      fn = this.action.replace(/-[a-z]/ig, function(s) {
        return s[1].toUpperCase();
      });
      return this.editor.transact((function(_this) {
        return function() {
          var formattedText, paragraphRange, range, text;
          paragraphRange = _this.editor.getCurrentParagraphBufferRange();
          range = _this.editor.getSelectedBufferRange();
          if (paragraphRange) {
            range = paragraphRange.union(range);
          }
          if (range.start.row === range.end.row) {
            return;
          }
          text = _this.editor.getTextInBufferRange(range);
          if (text.trim() === "") {
            return;
          }
          text = text.split(/\r?\n/);
          formattedText = _this[fn](e, range, text);
          if (formattedText) {
            return _this.editor.setTextInBufferRange(range, formattedText);
          }
        };
      })(this));
    };

    FormatText.prototype.correctOrderListNumbers = function(e, range, lines) {
      var correctedLines, idx, indent, indentStack, j, len, line, lineMeta, orderStack;
      correctedLines = [];
      indentStack = [];
      orderStack = [];
      for (idx = j = 0, len = lines.length; j < len; idx = ++j) {
        line = lines[idx];
        lineMeta = new LineMeta(line);
        if (lineMeta.isList("ol")) {
          indent = lineMeta.indent;
          if (indentStack.length === 0 || indent.length > indentStack[0].length) {
            indentStack.unshift(indent);
            orderStack.unshift(lineMeta.defaultHead);
          } else if (indent.length < indentStack[0].length) {
            while (indentStack.length > 0 && indent.length !== indentStack[0].length) {
              indentStack.shift();
              orderStack.shift();
            }
            if (orderStack.length === 0) {
              indentStack.unshift(indent);
              orderStack.unshift(lineMeta.defaultHead);
            } else {
              orderStack.unshift(LineMeta.incStr(orderStack.shift()));
            }
          } else {
            orderStack.unshift(LineMeta.incStr(orderStack.shift()));
          }
          correctedLines[idx] = "" + indentStack[0] + orderStack[0] + ". " + lineMeta.body;
        } else {
          correctedLines[idx] = line;
        }
      }
      return correctedLines.join("\n");
    };

    FormatText.prototype.formatTable = function(e, range, lines) {
      var j, len, options, ref, ref1, row, rows, table;
      if (lines.some(function(line) {
        return line.trim() !== "" && !utils.isTableRow(line);
      })) {
        return;
      }
      ref = this._parseTable(lines), rows = ref.rows, options = ref.options;
      table = [];
      table.push(utils.createTableRow(rows[0], options).trimRight());
      table.push(utils.createTableSeparator(options));
      ref1 = rows.slice(1);
      for (j = 0, len = ref1.length; j < len; j++) {
        row = ref1[j];
        table.push(utils.createTableRow(row, options).trimRight());
      }
      return table.join("\n");
    };

    FormatText.prototype._parseTable = function(lines) {
      var columnWidth, i, j, k, len, len1, line, options, ref, row, rows, separator;
      rows = [];
      options = {
        numOfColumns: 1,
        extraPipes: config.get("tableExtraPipes"),
        columnWidth: 1,
        columnWidths: [],
        alignment: config.get("tableAlignment"),
        alignments: []
      };
      for (j = 0, len = lines.length; j < len; j++) {
        line = lines[j];
        if (line.trim() === "") {
          continue;
        } else if (utils.isTableSeparator(line)) {
          separator = utils.parseTableSeparator(line);
          options.extraPipes = options.extraPipes || separator.extraPipes;
          options.alignments = separator.alignments;
          options.numOfColumns = Math.max(options.numOfColumns, separator.columns.length);
        } else {
          row = utils.parseTableRow(line);
          rows.push(row.columns);
          options.numOfColumns = Math.max(options.numOfColumns, row.columns.length);
          ref = row.columnWidths;
          for (i = k = 0, len1 = ref.length; k < len1; i = ++k) {
            columnWidth = ref[i];
            options.columnWidths[i] = Math.max(options.columnWidths[i] || 0, columnWidth);
          }
        }
      }
      return {
        rows: rows,
        options: options
      };
    };

    return FormatText;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvY29tbWFuZHMvZm9ybWF0LXRleHQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVI7O0VBQ1QsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSOztFQUNSLFFBQUEsR0FBVyxPQUFBLENBQVEsc0JBQVI7O0VBRVgsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUVTLG9CQUFDLE1BQUQ7TUFDWCxJQUFDLENBQUEsTUFBRCxHQUFVO01BQ1YsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7SUFGQzs7eUJBSWIsT0FBQSxHQUFTLFNBQUMsQ0FBRDtBQUNQLFVBQUE7TUFBQSxFQUFBLEdBQUssSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQWdCLFVBQWhCLEVBQTRCLFNBQUMsQ0FBRDtlQUFPLENBQUUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUFMLENBQUE7TUFBUCxDQUE1QjthQUVMLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFFZixjQUFBO1VBQUEsY0FBQSxHQUFpQixLQUFDLENBQUEsTUFBTSxDQUFDLDhCQUFSLENBQUE7VUFFakIsS0FBQSxHQUFRLEtBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBQTtVQUNSLElBQXVDLGNBQXZDO1lBQUEsS0FBQSxHQUFRLGNBQWMsQ0FBQyxLQUFmLENBQXFCLEtBQXJCLEVBQVI7O1VBQ0EsSUFBVSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQVosS0FBbUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUF2QztBQUFBLG1CQUFBOztVQUVBLElBQUEsR0FBTyxLQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZC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QyxJQUFMLENBQVUsR0FBRyxDQUFDLE9BQWQ7VUFDQSxPQUFPLENBQUMsWUFBUixHQUF1QixJQUFJLENBQUMsR0FBTCxDQUFTLE9BQU8sQ0FBQyxZQUFqQixFQUErQixHQUFHLENBQUMsT0FBTyxDQUFDLE1BQTNDO0FBQ3ZCO0FBQUEsZUFBQSwrQ0FBQTs7WUFDRSxPQUFPLENBQUMsWUFBYSxDQUFBLENBQUEsQ0FBckIsR0FBMEIsSUFBSSxDQUFDLEdBQUwsQ0FBUyxPQUFPLENBQUMsWUFBYSxDQUFBLENBQUEsQ0FBckIsSUFBMkIsQ0FBcEMsRUFBdUMsV0FBdkM7QUFENUIsV0FURzs7QUFIUDthQWVBO1FBQUEsSUFBQSxFQUFNLElBQU47UUFBWSxPQUFBLEVBQVMsT0FBckI7O0lBekJXOzs7OztBQTlFZiIsInNvdXJjZXNDb250ZW50IjpbImNvbmZpZyA9IHJlcXVpcmUgXCIuLi9jb25maWdcIlxudXRpbHMgPSByZXF1aXJlIFwiLi4vdXRpbHNcIlxuTGluZU1ldGEgPSByZXF1aXJlIFwiLi4vaGVscGVycy9saW5lLW1ldGFcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBGb3JtYXRUZXh0XG4gICMgYWN0aW9uOiBjb3JyZWN0LW9yZGVyLWxpc3QtbnVtYmVycywgZm9ybWF0LXRhYmxlXG4gIGNvbnN0cnVjdG9yOiAoYWN0aW9uKSAtPlxuICAgIEBhY3Rpb24gPSBhY3Rpb25cbiAgICBAZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgdHJpZ2dlcjogKGUpIC0+XG4gICAgZm4gPSBAYWN0aW9uLnJlcGxhY2UgLy1bYS16XS9pZywgKHMpIC0+IHNbMV0udG9VcHBlckNhc2UoKVxuXG4gICAgQGVkaXRvci50cmFuc2FjdCA9PlxuICAgICAgIyBjdXJyZW50IHBhcmFncmFwaCByYW5nZSBjb3VsZCBiZSB1bmRlZmluZWQgaWYgdGhlIGN1cnNvciBpcyBhdCBhbiBlbXB0eSBsaW5lXG4gICAgICBwYXJhZ3JhcGhSYW5nZSA9IEBlZGl0b3IuZ2V0Q3VycmVudFBhcmFncmFwaEJ1ZmZlclJhbmdlKClcblxuICAgICAgcmFuZ2UgPSBAZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2UoKVxuICAgICAgcmFuZ2UgPSBwYXJhZ3JhcGhSYW5nZS51bmlvbihyYW5nZSkgaWYgcGFyYWdyYXBoUmFuZ2VcbiAgICAgIHJldHVybiBpZiByYW5nZS5zdGFydC5yb3cgPT0gcmFuZ2UuZW5kLnJvd1xuXG4gICAgICB0ZXh0ID0gQGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSlcbiAgICAgIHJldHVybiBpZiB0ZXh0LnRyaW0oKSA9PSBcIlwiXG5cbiAgICAgIHRleHQgPSB0ZXh0LnNwbGl0KC9cXHI/XFxuLylcbiAgICAgIGZvcm1hdHRlZFRleHQgPSBAW2ZuXShlLCByYW5nZSwgdGV4dClcbiAgICAgIEBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UsIGZvcm1hdHRlZFRleHQpIGlmIGZvcm1hdHRlZFRleHRcblxuICBjb3JyZWN0T3JkZXJMaXN0TnVtYmVyczogKGUsIHJhbmdlLCBsaW5lcykgLT5cbiAgICBjb3JyZWN0ZWRMaW5lcyA9IFtdXG5cbiAgICBpbmRlbnRTdGFjayA9IFtdXG4gICAgb3JkZXJTdGFjayA9IFtdXG4gICAgZm9yIGxpbmUsIGlkeCBpbiBsaW5lc1xuICAgICAgbGluZU1ldGEgPSBuZXcgTGluZU1ldGEobGluZSlcblxuICAgICAgaWYgbGluZU1ldGEuaXNMaXN0KFwib2xcIilcbiAgICAgICAgaW5kZW50ID0gbGluZU1ldGEuaW5kZW50XG5cbiAgICAgICAgaWYgaW5kZW50U3RhY2subGVuZ3RoID09IDAgfHwgaW5kZW50Lmxlbmd0aCA+IGluZGVudFN0YWNrWzBdLmxlbmd0aCAjIGZpcnN0IG9sL3N1Yi1vbCBtYXRjaFxuICAgICAgICAgIGluZGVudFN0YWNrLnVuc2hpZnQoaW5kZW50KVxuICAgICAgICAgIG9yZGVyU3RhY2sudW5zaGlmdChsaW5lTWV0YS5kZWZhdWx0SGVhZClcbiAgICAgICAgZWxzZSBpZiBpbmRlbnQubGVuZ3RoIDwgaW5kZW50U3RhY2tbMF0ubGVuZ3RoICMgZW5kIG9mIGEgc3ViLW9sIG1hdGNoXG4gICAgICAgICAgIyBwb3Agb3V0IHN0YWNrIHVudGlsIHdlIGFyZSBiYWNrIHRvIHRoZSBzYW1lIGluZGVudCBzdGFja1xuICAgICAgICAgIHdoaWxlIGluZGVudFN0YWNrLmxlbmd0aCA+IDAgJiYgaW5kZW50Lmxlbmd0aCAhPSBpbmRlbnRTdGFja1swXS5sZW5ndGhcbiAgICAgICAgICAgIGluZGVudFN0YWNrLnNoaWZ0KClcbiAgICAgICAgICAgIG9yZGVyU3RhY2suc2hpZnQoKVxuXG4gICAgICAgICAgaWYgb3JkZXJTdGFjay5sZW5ndGggPT0gMCAjIGluIGNhc2Ugd2UgYXJlIGJhY2sgdG8gdG9wIGxldmVsLCBJc3N1ZSAjMTg4XG4gICAgICAgICAgICBpbmRlbnRTdGFjay51bnNoaWZ0KGluZGVudClcbiAgICAgICAgICAgIG9yZGVyU3RhY2sudW5zaGlmdChsaW5lTWV0YS5kZWZhdWx0SGVhZClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBvcmRlclN0YWNrLnVuc2hpZnQoTGluZU1ldGEuaW5jU3RyKG9yZGVyU3RhY2suc2hpZnQoKSkpXG4gICAgICAgIGVsc2UgIyBzYW1lIGxldmVsIG9sIG1hdGNoXG4gICAgICAgICAgb3JkZXJTdGFjay51bnNoaWZ0KExpbmVNZXRhLmluY1N0cihvcmRlclN0YWNrLnNoaWZ0KCkpKVxuXG4gICAgICAgIGNvcnJlY3RlZExpbmVzW2lkeF0gPSBcIiN7aW5kZW50U3RhY2tbMF19I3tvcmRlclN0YWNrWzBdfS4gI3tsaW5lTWV0YS5ib2R5fVwiXG4gICAgICBlbHNlXG4gICAgICAgIGNvcnJlY3RlZExpbmVzW2lkeF0gPSBsaW5lXG5cbiAgICBjb3JyZWN0ZWRMaW5lcy5qb2luKFwiXFxuXCIpXG5cbiAgZm9ybWF0VGFibGU6IChlLCByYW5nZSwgbGluZXMpIC0+XG4gICAgcmV0dXJuIGlmIGxpbmVzLnNvbWUgKGxpbmUpIC0+IGxpbmUudHJpbSgpICE9IFwiXCIgJiYgIXV0aWxzLmlzVGFibGVSb3cobGluZSlcblxuICAgIHsgcm93cywgb3B0aW9ucyB9ID0gQF9wYXJzZVRhYmxlKGxpbmVzKVxuXG4gICAgdGFibGUgPSBbXVxuICAgICMgdGFibGUgaGVhZFxuICAgIHRhYmxlLnB1c2godXRpbHMuY3JlYXRlVGFibGVSb3cocm93c1swXSwgb3B0aW9ucykudHJpbVJpZ2h0KCkpXG4gICAgIyB0YWJsZSBzZXBhcmF0b3JcbiAgICB0YWJsZS5wdXNoKHV0aWxzLmNyZWF0ZVRhYmxlU2VwYXJhdG9yKG9wdGlvbnMpKVxuICAgICMgdGFibGUgYm9keVxuICAgIHRhYmxlLnB1c2godXRpbHMuY3JlYXRlVGFibGVSb3cocm93LCBvcHRpb25zKS50cmltUmlnaHQoKSkgZm9yIHJvdyBpbiByb3dzWzEuLl1cbiAgICAjIHRhYmxlIGpvaW4gcm93c1xuICAgIHRhYmxlLmpvaW4oXCJcXG5cIilcblxuICBfcGFyc2VUYWJsZTogKGxpbmVzKSAtPlxuICAgIHJvd3MgPSBbXVxuICAgIG9wdGlvbnMgPVxuICAgICAgbnVtT2ZDb2x1bW5zOiAxXG4gICAgICBleHRyYVBpcGVzOiBjb25maWcuZ2V0KFwidGFibGVFeHRyYVBpcGVzXCIpXG4gICAgICBjb2x1bW5XaWR0aDogMVxuICAgICAgY29sdW1uV2lkdGhzOiBbXVxuICAgICAgYWxpZ25tZW50OiBjb25maWcuZ2V0KFwidGFibGVBbGlnbm1lbnRcIilcbiAgICAgIGFsaWdubWVudHM6IFtdXG5cbiAgICBmb3IgbGluZSBpbiBsaW5lc1xuICAgICAgaWYgbGluZS50cmltKCkgPT0gXCJcIlxuICAgICAgICBjb250aW51ZVxuICAgICAgZWxzZSBpZiB1dGlscy5pc1RhYmxlU2VwYXJhdG9yKGxpbmUpXG4gICAgICAgIHNlcGFyYXRvciA9IHV0aWxzLnBhcnNlVGFibGVTZXBhcmF0b3IobGluZSlcbiAgICAgICAgb3B0aW9ucy5leHRyYVBpcGVzID0gb3B0aW9ucy5leHRyYVBpcGVzIHx8IHNlcGFyYXRvci5leHRyYVBpcGVzXG4gICAgICAgIG9wdGlvbnMuYWxpZ25tZW50cyA9IHNlcGFyYXRvci5hbGlnbm1lbnRzXG4gICAgICAgIG9wdGlvbnMubnVtT2ZDb2x1bW5zID0gTWF0aC5tYXgob3B0aW9ucy5udW1PZkNvbHVtbnMsIHNlcGFyYXRvci5jb2x1bW5zLmxlbmd0aClcbiAgICAgIGVsc2VcbiAgICAgICAgcm93ID0gdXRpbHMucGFyc2VUYWJsZVJvdyhsaW5lKVxuICAgICAgICByb3dzLnB1c2gocm93LmNvbHVtbnMpXG4gICAgICAgIG9wdGlvbnMubnVtT2ZDb2x1bW5zID0gTWF0aC5tYXgob3B0aW9ucy5udW1PZkNvbHVtbnMsIHJvdy5jb2x1bW5zLmxlbmd0aClcbiAgICAgICAgZm9yIGNvbHVtbldpZHRoLCBpIGluIHJvdy5jb2x1bW5XaWR0aHNcbiAgICAgICAgICBvcHRpb25zLmNvbHVtbldpZHRoc1tpXSA9IE1hdGgubWF4KG9wdGlvbnMuY29sdW1uV2lkdGhzW2ldIHx8IDAsIGNvbHVtbldpZHRoKVxuXG4gICAgcm93czogcm93cywgb3B0aW9uczogb3B0aW9uc1xuIl19
