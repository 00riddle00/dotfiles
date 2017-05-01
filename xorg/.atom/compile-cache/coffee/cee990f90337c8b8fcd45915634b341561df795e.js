(function() {
  var $, CSON, CompositeDisposable, InsertLinkView, TextEditorView, View, config, fs, guid, helper, posts, ref, templateHelper, utils,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require("atom-space-pen-views"), $ = ref.$, View = ref.View, TextEditorView = ref.TextEditorView;

  CSON = require("season");

  fs = require("fs-plus");

  guid = require("guid");

  config = require("../config");

  utils = require("../utils");

  helper = require("../helpers/insert-link-helper");

  templateHelper = require("../helpers/template-helper");

  posts = null;

  module.exports = InsertLinkView = (function(superClass) {
    extend(InsertLinkView, superClass);

    function InsertLinkView() {
      return InsertLinkView.__super__.constructor.apply(this, arguments);
    }

    InsertLinkView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-dialog"
      }, (function(_this) {
        return function() {
          _this.label("Insert Link", {
            "class": "icon icon-globe"
          });
          _this.div(function() {
            _this.label("Text to be displayed", {
              "class": "message"
            });
            _this.subview("textEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Web Address", {
              "class": "message"
            });
            _this.subview("urlEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Title", {
              "class": "message"
            });
            return _this.subview("titleEditor", new TextEditorView({
              mini: true
            }));
          });
          _this.div({
            "class": "dialog-row"
          }, function() {
            return _this.label({
              "for": "markdown-writer-save-link-checkbox"
            }, function() {
              _this.input({
                id: "markdown-writer-save-link-checkbox"
              }, {
                type: "checkbox",
                outlet: "saveCheckbox"
              });
              return _this.span("Automatically link to this text next time", {
                "class": "side-label"
              });
            });
          });
          return _this.div({
            outlet: "searchBox"
          }, function() {
            _this.label("Search Posts", {
              "class": "icon icon-search"
            });
            _this.subview("searchEditor", new TextEditorView({
              mini: true
            }));
            return _this.ul({
              "class": "markdown-writer-list",
              outlet: "searchResult"
            });
          });
        };
      })(this));
    };

    InsertLinkView.prototype.initialize = function() {
      utils.setTabIndex([this.textEditor, this.urlEditor, this.titleEditor, this.saveCheckbox, this.searchEditor]);
      this.searchEditor.getModel().onDidChange((function(_this) {
        return function() {
          if (posts) {
            return _this.updateSearch(_this.searchEditor.getText());
          }
        };
      })(this));
      this.searchResult.on("click", "li", (function(_this) {
        return function(e) {
          return _this.useSearchResult(e);
        };
      })(this));
      this.disposables = new CompositeDisposable();
      return this.disposables.add(atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.onConfirm();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      }));
    };

    InsertLinkView.prototype.onConfirm = function() {
      var link;
      link = {
        text: this.textEditor.getText(),
        url: this.urlEditor.getText().trim(),
        title: this.titleEditor.getText().trim()
      };
      this.editor.transact((function(_this) {
        return function() {
          if (link.url) {
            return _this.insertLink(link);
          } else {
            return _this.removeLink(link.text);
          }
        };
      })(this));
      this.updateSavedLinks(link);
      return this.detach();
    };

    InsertLinkView.prototype.display = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.editor = atom.workspace.getActiveTextEditor();
      this.panel.show();
      this.fetchPosts();
      return this.loadSavedLinks((function(_this) {
        return function() {
          _this._normalizeSelectionAndSetLinkFields();
          if (_this.textEditor.getText()) {
            _this.urlEditor.getModel().selectAll();
            return _this.urlEditor.focus();
          } else {
            return _this.textEditor.focus();
          }
        };
      })(this));
    };

    InsertLinkView.prototype.detach = function() {
      var ref1;
      if (this.panel.isVisible()) {
        this.panel.hide();
        if ((ref1 = this.previouslyFocusedElement) != null) {
          ref1.focus();
        }
      }
      return InsertLinkView.__super__.detach.apply(this, arguments);
    };

    InsertLinkView.prototype.detached = function() {
      var ref1;
      if ((ref1 = this.disposables) != null) {
        ref1.dispose();
      }
      return this.disposables = null;
    };

    InsertLinkView.prototype._normalizeSelectionAndSetLinkFields = function() {
      this.range = utils.getTextBufferRange(this.editor, "link");
      this.currLink = this._findLinkInRange();
      this.referenceId = this.currLink.id;
      this.range = this.currLink.linkRange || this.range;
      this.definitionRange = this.currLink.definitionRange;
      this.setLink(this.currLink);
      return this.saveCheckbox.prop("checked", this.isInSavedLink(this.currLink));
    };

    InsertLinkView.prototype._findLinkInRange = function() {
      var link, selection;
      link = utils.findLinkInRange(this.editor, this.range);
      if (link != null) {
        if (!link.id) {
          return link;
        }
        if (link.id && link.linkRange && link.definitionRange) {
          return link;
        }
        link.id = null;
        return link;
      }
      selection = this.editor.getTextInRange(this.range);
      if (this.getSavedLink(selection)) {
        return this.getSavedLink(selection);
      }
      return {
        text: selection,
        url: "",
        title: ""
      };
    };

    InsertLinkView.prototype.updateSearch = function(query) {
      var results;
      if (!(query && posts)) {
        return;
      }
      query = query.trim().toLowerCase();
      results = posts.filter(function(post) {
        return post.title.toLowerCase().indexOf(query) >= 0;
      }).map(function(post) {
        return "<li data-url='" + post.url + "'>" + post.title + "</li>";
      });
      return this.searchResult.empty().append(results.join(""));
    };

    InsertLinkView.prototype.useSearchResult = function(e) {
      if (!this.textEditor.getText()) {
        this.textEditor.setText(e.target.textContent);
      }
      this.titleEditor.setText(e.target.textContent);
      this.urlEditor.setText(e.target.dataset.url);
      return this.titleEditor.focus();
    };

    InsertLinkView.prototype.insertLink = function(link) {
      if (this.definitionRange) {
        return this.updateReferenceLink(link);
      } else if (link.title) {
        return this.insertReferenceLink(link);
      } else {
        return this.insertInlineLink(link);
      }
    };

    InsertLinkView.prototype.insertInlineLink = function(link) {
      var text;
      text = templateHelper.create("linkInlineTag", link);
      return this.editor.setTextInBufferRange(this.range, text);
    };

    InsertLinkView.prototype.updateReferenceLink = function(link) {
      var definitionText, inlineLink, inlineText;
      if (link.title) {
        link = this._referenceLink(link);
        inlineText = templateHelper.create("referenceInlineTag", link);
        definitionText = templateHelper.create("referenceDefinitionTag", link);
        if (definitionText) {
          this.editor.setTextInBufferRange(this.range, inlineText);
          return this.editor.setTextInBufferRange(this.definitionRange, definitionText);
        } else {
          return this.replaceReferenceLink(inlineText);
        }
      } else {
        inlineLink = templateHelper.create("linkInlineTag", link);
        return this.replaceReferenceLink(inlineLink);
      }
    };

    InsertLinkView.prototype.insertReferenceLink = function(link) {
      var definitionText, inlineText;
      link = this._referenceLink(link);
      inlineText = templateHelper.create("referenceInlineTag", link);
      definitionText = templateHelper.create("referenceDefinitionTag", link);
      this.editor.setTextInBufferRange(this.range, inlineText);
      if (definitionText) {
        if (config.get("referenceInsertPosition") === "article") {
          return helper.insertAtEndOfArticle(this.editor, definitionText);
        } else {
          return helper.insertAfterCurrentParagraph(this.editor, definitionText);
        }
      }
    };

    InsertLinkView.prototype._referenceLink = function(link) {
      link['indent'] = " ".repeat(config.get("referenceIndentLength"));
      link['title'] = /^[-\*\!]$/.test(link.title) ? "" : link.title;
      link['label'] = this.referenceId || guid.raw().slice(0, 8);
      return link;
    };

    InsertLinkView.prototype.removeLink = function(text) {
      if (this.referenceId) {
        return this.replaceReferenceLink(text);
      } else {
        return this.editor.setTextInBufferRange(this.range, text);
      }
    };

    InsertLinkView.prototype.replaceReferenceLink = function(text) {
      var position;
      this.editor.setTextInBufferRange(this.range, text);
      position = this.editor.getCursorBufferPosition();
      helper.removeDefinitionRange(this.editor, this.definitionRange);
      return this.editor.setCursorBufferPosition(position);
    };

    InsertLinkView.prototype.setLink = function(link) {
      this.textEditor.setText(link.text);
      this.titleEditor.setText(link.title);
      return this.urlEditor.setText(link.url);
    };

    InsertLinkView.prototype.getSavedLink = function(text) {
      var link, ref1;
      link = (ref1 = this.links) != null ? ref1[text.toLowerCase()] : void 0;
      if (!link) {
        return link;
      }
      if (!link.text) {
        link["text"] = text;
      }
      return link;
    };

    InsertLinkView.prototype.isInSavedLink = function(link) {
      var savedLink;
      savedLink = this.getSavedLink(link.text);
      return !!savedLink && !(["text", "title", "url"].some(function(k) {
        return savedLink[k] !== link[k];
      }));
    };

    InsertLinkView.prototype.updateToLinks = function(link) {
      var inSavedLink, linkUpdated;
      linkUpdated = false;
      inSavedLink = this.isInSavedLink(link);
      if (this.saveCheckbox.prop("checked")) {
        if (!inSavedLink && link.url) {
          this.links[link.text.toLowerCase()] = link;
          linkUpdated = true;
        }
      } else if (inSavedLink) {
        delete this.links[link.text.toLowerCase()];
        linkUpdated = true;
      }
      return linkUpdated;
    };

    InsertLinkView.prototype.updateSavedLinks = function(link) {
      if (this.updateToLinks(link)) {
        return CSON.writeFile(config.get("siteLinkPath"), this.links);
      }
    };

    InsertLinkView.prototype.loadSavedLinks = function(callback) {
      return CSON.readFile(config.get("siteLinkPath"), (function(_this) {
        return function(err, data) {
          _this.links = data || {};
          return callback();
        };
      })(this));
    };

    InsertLinkView.prototype.fetchPosts = function() {
      var error, succeed;
      if (posts) {
        return (posts.length < 1 ? this.searchBox.hide() : void 0);
      }
      succeed = (function(_this) {
        return function(body) {
          posts = body.posts;
          if (posts.length > 0) {
            _this.searchBox.show();
            _this.searchEditor.setText(_this.textEditor.getText());
            return _this.updateSearch(_this.textEditor.getText());
          }
        };
      })(this);
      error = (function(_this) {
        return function(err) {
          return _this.searchBox.hide();
        };
      })(this);
      return utils.getJSON(config.get("urlForPosts"), succeed, error);
    };

    return InsertLinkView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvdmlld3MvaW5zZXJ0LWxpbmstdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLCtIQUFBO0lBQUE7OztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsTUFBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBRCxFQUFJLGVBQUosRUFBVTs7RUFDVixJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVI7O0VBQ1QsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSOztFQUNSLE1BQUEsR0FBUyxPQUFBLENBQVEsK0JBQVI7O0VBQ1QsY0FBQSxHQUFpQixPQUFBLENBQVEsNEJBQVI7O0VBRWpCLEtBQUEsR0FBUTs7RUFFUixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O0lBQ0osY0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sd0NBQVA7T0FBTCxFQUFzRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDcEQsS0FBQyxDQUFBLEtBQUQsQ0FBTyxhQUFQLEVBQXNCO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxpQkFBUDtXQUF0QjtVQUNBLEtBQUMsQ0FBQSxHQUFELENBQUssU0FBQTtZQUNILEtBQUMsQ0FBQSxLQUFELENBQU8sc0JBQVAsRUFBK0I7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFNBQVA7YUFBL0I7WUFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBMkIsSUFBQSxjQUFBLENBQWU7Y0FBQSxJQUFBLEVB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QUMsQ0FBQSxZQUFELENBQWMsS0FBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUEsQ0FBZCxFQUhGOztRQUZRO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtNQU1WLEtBQUEsR0FBUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtpQkFBUyxLQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBQTtRQUFUO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTthQUVSLEtBQUssQ0FBQyxPQUFOLENBQWMsTUFBTSxDQUFDLEdBQVAsQ0FBVyxhQUFYLENBQWQsRUFBeUMsT0FBekMsRUFBa0QsS0FBbEQ7SUFYVTs7OztLQXJOZTtBQWQ3QiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57JCwgVmlldywgVGV4dEVkaXRvclZpZXd9ID0gcmVxdWlyZSBcImF0b20tc3BhY2UtcGVuLXZpZXdzXCJcbkNTT04gPSByZXF1aXJlIFwic2Vhc29uXCJcbmZzID0gcmVxdWlyZSBcImZzLXBsdXNcIlxuZ3VpZCA9IHJlcXVpcmUgXCJndWlkXCJcblxuY29uZmlnID0gcmVxdWlyZSBcIi4uL2NvbmZpZ1wiXG51dGlscyA9IHJlcXVpcmUgXCIuLi91dGlsc1wiXG5oZWxwZXIgPSByZXF1aXJlIFwiLi4vaGVscGVycy9pbnNlcnQtbGluay1oZWxwZXJcIlxudGVtcGxhdGVIZWxwZXIgPSByZXF1aXJlIFwiLi4vaGVscGVycy90ZW1wbGF0ZS1oZWxwZXJcIlxuXG5wb3N0cyA9IG51bGwgIyB0byBjYWNoZSBwb3N0c1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBJbnNlcnRMaW5rVmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiBjbGFzczogXCJtYXJrZG93bi13cml0ZXIgbWFya2Rvd24td3JpdGVyLWRpYWxvZ1wiLCA9PlxuICAgICAgQGxhYmVsIFwiSW5zZXJ0IExpbmtcIiwgY2xhc3M6IFwiaWNvbiBpY29uLWdsb2JlXCJcbiAgICAgIEBkaXYgPT5cbiAgICAgICAgQGxhYmVsIFwiVGV4dCB0byBiZSBkaXNwbGF5ZWRcIiwgY2xhc3M6IFwibWVzc2FnZVwiXG4gICAgICAgIEBzdWJ2aWV3IFwidGV4dEVkaXRvclwiLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSlcbiAgICAgICAgQGxhYmVsIFwiV2ViIEFkZHJlc3NcIiwgY2xhc3M6IFwibWVzc2FnZVwiXG4gICAgICAgIEBzdWJ2aWV3IFwidXJsRWRpdG9yXCIsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlKVxuICAgICAgICBAbGFiZWwgXCJUaXRsZVwiLCBjbGFzczogXCJtZXNzYWdlXCJcbiAgICAgICAgQHN1YnZpZXcgXCJ0aXRsZUVkaXRvclwiLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSlcbiAgICAgIEBkaXYgY2xhc3M6IFwiZGlhbG9nLXJvd1wiLCA9PlxuICAgICAgICBAbGFiZWwgZm9yOiBcIm1hcmtkb3duLXdyaXRlci1zYXZlLWxpbmstY2hlY2tib3hcIiwgPT5cbiAgICAgICAgICBAaW5wdXQgaWQ6IFwibWFya2Rvd24td3JpdGVyLXNhdmUtbGluay1jaGVja2JveFwiLFxuICAgICAgICAgICAgdHlwZTpcImNoZWNrYm94XCIsIG91dGxldDogXCJzYXZlQ2hlY2tib3hcIlxuICAgICAgICAgIEBzcGFuIFwiQXV0b21hdGljYWxseSBsaW5rIHRvIHRoaXMgdGV4dCBuZXh0IHRpbWVcIiwgY2xhc3M6IFwic2lkZS1sYWJlbFwiXG4gICAgICBAZGl2IG91dGxldDogXCJzZWFyY2hCb3hcIiwgPT5cbiAgICAgICAgQGxhYmVsIFwiU2VhcmNoIFBvc3RzXCIsIGNsYXNzOiBcImljb24gaWNvbi1zZWFyY2hcIlxuICAgICAgICBAc3VidmlldyBcInNlYXJjaEVkaXRvclwiLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSlcbiAgICAgICAgQHVsIGNsYXNzOiBcIm1hcmtkb3duLXdyaXRlci1saXN0XCIsIG91dGxldDogXCJzZWFyY2hSZXN1bHRcIlxuXG4gIGluaXRpYWxpemU6IC0+XG4gICAgdXRpbHMuc2V0VGFiSW5kZXgoW0B0ZXh0RWRpdG9yLCBAdXJsRWRpdG9yLCBAdGl0bGVFZGl0b3IsXG4gICAgICBAc2F2ZUNoZWNrYm94LCBAc2VhcmNoRWRpdG9yXSlcblxuICAgIEBzZWFyY2hFZGl0b3IuZ2V0TW9kZWwoKS5vbkRpZENoYW5nZSA9PlxuICAgICAgQHVwZGF0ZVNlYXJjaChAc2VhcmNoRWRpdG9yLmdldFRleHQoKSkgaWYgcG9zdHNcbiAgICBAc2VhcmNoUmVzdWx0Lm9uIFwiY2xpY2tcIiwgXCJsaVwiLCAoZSkgPT4gQHVzZVNlYXJjaFJlc3VsdChlKVxuXG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIEBkaXNwb3NhYmxlcy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoXG4gICAgICBAZWxlbWVudCwge1xuICAgICAgICBcImNvcmU6Y29uZmlybVwiOiA9PiBAb25Db25maXJtKCksXG4gICAgICAgIFwiY29yZTpjYW5jZWxcIjogID0+IEBkZXRhY2goKVxuICAgICAgfSkpXG5cbiAgb25Db25maXJtOiAtPlxuICAgIGxpbmsgPVxuICAgICAgdGV4dDogQHRleHRFZGl0b3IuZ2V0VGV4dCgpXG4gICAgICB1cmw6IEB1cmxFZGl0b3IuZ2V0VGV4dCgpLnRyaW0oKVxuICAgICAgdGl0bGU6IEB0aXRsZUVkaXRvci5nZXRUZXh0KCkudHJpbSgpXG5cbiAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBpZiBsaW5rLnVybCB0aGVuIEBpbnNlcnRMaW5rKGxpbmspIGVsc2UgQHJlbW92ZUxpbmsobGluay50ZXh0KVxuXG4gICAgQHVwZGF0ZVNhdmVkTGlua3MobGluaylcbiAgICBAZGV0YWNoKClcblxuICBkaXNwbGF5OiAtPlxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMsIHZpc2libGU6IGZhbHNlKVxuICAgIEBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSAkKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpXG4gICAgQGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICAjIGZldGNoIHJlbW90ZSBhbmQgbG9jYWwgbGlua3NcbiAgICBAZmV0Y2hQb3N0cygpXG4gICAgQGxvYWRTYXZlZExpbmtzID0+XG4gICAgICBAX25vcm1hbGl6ZVNlbGVjdGlvbkFuZFNldExpbmtGaWVsZHMoKVxuXG4gICAgICBpZiBAdGV4dEVkaXRvci5nZXRUZXh0KClcbiAgICAgICAgQHVybEVkaXRvci5nZXRNb2RlbCgpLnNlbGVjdEFsbCgpXG4gICAgICAgIEB1cmxFZGl0b3IuZm9jdXMoKVxuICAgICAgZWxzZVxuICAgICAgICBAdGV4dEVkaXRvci5mb2N1cygpXG5cbiAgZGV0YWNoOiAtPlxuICAgIGlmIEBwYW5lbC5pc1Zpc2libGUoKVxuICAgICAgQHBhbmVsLmhpZGUoKVxuICAgICAgQHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudD8uZm9jdXMoKVxuICAgIHN1cGVyXG5cbiAgZGV0YWNoZWQ6IC0+XG4gICAgQGRpc3Bvc2FibGVzPy5kaXNwb3NlKClcbiAgICBAZGlzcG9zYWJsZXMgPSBudWxsXG5cbiAgX25vcm1hbGl6ZVNlbGVjdGlvbkFuZFNldExpbmtGaWVsZHM6IC0+XG4gICAgQHJhbmdlID0gdXRpbHMuZ2V0VGV4dEJ1ZmZlclJhbmdlKEBlZGl0b3IsIFwibGlua1wiKVxuICAgIEBjdXJyTGluayA9IEBfZmluZExpbmtJblJhbmdlKClcblxuICAgIEByZWZlcmVuY2VJZCA9IEBjdXJyTGluay5pZFxuICAgIEByYW5nZSA9IEBjdXJyTGluay5saW5rUmFuZ2UgfHwgQHJhbmdlXG4gICAgQGRlZmluaXRpb25SYW5nZSA9IEBjdXJyTGluay5kZWZpbml0aW9uUmFuZ2VcblxuICAgIEBzZXRMaW5rKEBjdXJyTGluaylcbiAgICBAc2F2ZUNoZWNrYm94LnByb3AoXCJjaGVja2VkXCIsIEBpc0luU2F2ZWRMaW5rKEBjdXJyTGluaykpXG5cbiAgX2ZpbmRMaW5rSW5SYW5nZTogLT5cbiAgICBsaW5rID0gdXRpbHMuZmluZExpbmtJblJhbmdlKEBlZGl0b3IsIEByYW5nZSlcbiAgICBpZiBsaW5rP1xuICAgICAgcmV0dXJuIGxpbmsgdW5sZXNzIGxpbmsuaWRcbiAgICAgICMgQ2hlY2sgaXMgbGluayBpdCBhbiBvcnBoYW4gcmVmZXJlbmNlIGxpbmtcbiAgICAgIHJldHVybiBsaW5rIGlmIGxpbmsuaWQgJiYgbGluay5saW5rUmFuZ2UgJiYgbGluay5kZWZpbml0aW9uUmFuZ2VcbiAgICAgICMgIFJlbW92ZSBsaW5rLmlkIGlmIGl0IGlzIG9ycGhhblxuICAgICAgbGluay5pZCA9IG51bGxcbiAgICAgIHJldHVybiBsaW5rXG4gICAgIyBGaW5kIHNlbGVjdGlvbiBpbiBzYXZlZCBsaW5rcywgYW5kIGF1dG8tcG9wdWxhdGUgaXRcbiAgICBzZWxlY3Rpb24gPSBAZWRpdG9yLmdldFRleHRJblJhbmdlKEByYW5nZSlcbiAgICByZXR1cm4gQGdldFNhdmVkTGluayhzZWxlY3Rpb24pIGlmIEBnZXRTYXZlZExpbmsoc2VsZWN0aW9uKVxuICAgICMgRGVmYXVsdCBmYWxsYmFja1xuICAgIHRleHQ6IHNlbGVjdGlvbiwgdXJsOiBcIlwiLCB0aXRsZTogXCJcIlxuXG4gIHVwZGF0ZVNlYXJjaDogKHF1ZXJ5KSAtPlxuICAgIHJldHVybiB1bmxlc3MgcXVlcnkgJiYgcG9zdHNcbiAgICBxdWVyeSA9IHF1ZXJ5LnRyaW0oKS50b0xvd2VyQ2FzZSgpXG4gICAgcmVzdWx0cyA9IHBvc3RzXG4gICAgICAuZmlsdGVyKChwb3N0KSAtPiBwb3N0LnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihxdWVyeSkgPj0gMClcbiAgICAgIC5tYXAoKHBvc3QpIC0+IFwiPGxpIGRhdGEtdXJsPScje3Bvc3QudXJsfSc+I3twb3N0LnRpdGxlfTwvbGk+XCIpXG4gICAgQHNlYXJjaFJlc3VsdC5lbXB0eSgpLmFwcGVuZChyZXN1bHRzLmpvaW4oXCJcIikpXG5cbiAgdXNlU2VhcmNoUmVzdWx0OiAoZSkgLT5cbiAgICBAdGV4dEVkaXRvci5zZXRUZXh0KGUudGFyZ2V0LnRleHRDb250ZW50KSB1bmxlc3MgQHRleHRFZGl0b3IuZ2V0VGV4dCgpXG4gICAgQHRpdGxlRWRpdG9yLnNldFRleHQoZS50YXJnZXQudGV4dENvbnRlbnQpXG4gICAgQHVybEVkaXRvci5zZXRUZXh0KGUudGFyZ2V0LmRhdGFzZXQudXJsKVxuICAgIEB0aXRsZUVkaXRvci5mb2N1cygpXG5cbiAgaW5zZXJ0TGluazogKGxpbmspIC0+XG4gICAgaWYgQGRlZmluaXRpb25SYW5nZVxuICAgICAgQHVwZGF0ZVJlZmVyZW5jZUxpbmsobGluaylcbiAgICBlbHNlIGlmIGxpbmsudGl0bGVcbiAgICAgIEBpbnNlcnRSZWZlcmVuY2VMaW5rKGxpbmspXG4gICAgZWxzZVxuICAgICAgQGluc2VydElubGluZUxpbmsobGluaylcblxuICBpbnNlcnRJbmxpbmVMaW5rOiAobGluaykgLT5cbiAgICB0ZXh0ID0gdGVtcGxhdGVIZWxwZXIuY3JlYXRlKFwibGlua0lubGluZVRhZ1wiLCBsaW5rKVxuICAgIEBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UoQHJhbmdlLCB0ZXh0KVxuXG4gIHVwZGF0ZVJlZmVyZW5jZUxpbms6IChsaW5rKSAtPlxuICAgIGlmIGxpbmsudGl0bGUgIyB1cGRhdGUgdGhlIHJlZmVyZW5jZSBsaW5rXG4gICAgICBsaW5rID0gQF9yZWZlcmVuY2VMaW5rKGxpbmspXG4gICAgICBpbmxpbmVUZXh0ID0gdGVtcGxhdGVIZWxwZXIuY3JlYXRlKFwicmVmZXJlbmNlSW5saW5lVGFnXCIsIGxpbmspXG4gICAgICBkZWZpbml0aW9uVGV4dCA9IHRlbXBsYXRlSGVscGVyLmNyZWF0ZShcInJlZmVyZW5jZURlZmluaXRpb25UYWdcIiwgbGluaylcblxuICAgICAgaWYgZGVmaW5pdGlvblRleHRcbiAgICAgICAgQGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShAcmFuZ2UsIGlubGluZVRleHQpXG4gICAgICAgIEBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UoQGRlZmluaXRpb25SYW5nZSwgZGVmaW5pdGlvblRleHQpXG4gICAgICBlbHNlXG4gICAgICAgIEByZXBsYWNlUmVmZXJlbmNlTGluayhpbmxpbmVUZXh0KVxuICAgIGVsc2UgIyByZXBsYWNlIGJ5IHRvIGlubGluZSBsaW5rXG4gICAgICBpbmxpbmVMaW5rID0gdGVtcGxhdGVIZWxwZXIuY3JlYXRlKFwibGlua0lubGluZVRhZ1wiLCBsaW5rKVxuICAgICAgQHJlcGxhY2VSZWZlcmVuY2VMaW5rKGlubGluZUxpbmspXG5cbiAgaW5zZXJ0UmVmZXJlbmNlTGluazogKGxpbmspIC0+XG4gICAgbGluayA9IEBfcmVmZXJlbmNlTGluayhsaW5rKVxuICAgIGlubGluZVRleHQgPSB0ZW1wbGF0ZUhlbHBlci5jcmVhdGUoXCJyZWZlcmVuY2VJbmxpbmVUYWdcIiwgbGluaylcbiAgICBkZWZpbml0aW9uVGV4dCA9IHRlbXBsYXRlSGVscGVyLmNyZWF0ZShcInJlZmVyZW5jZURlZmluaXRpb25UYWdcIiwgbGluaylcblxuICAgIEBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UoQHJhbmdlLCBpbmxpbmVUZXh0KVxuICAgIGlmIGRlZmluaXRpb25UZXh0ICMgaW5zZXJ0IG9ubHkgaWYgZGVmaW5pdGlvblRleHQgZXhpc3RzXG4gICAgICBpZiBjb25maWcuZ2V0KFwicmVmZXJlbmNlSW5zZXJ0UG9zaXRpb25cIikgPT0gXCJhcnRpY2xlXCJcbiAgICAgICAgaGVscGVyLmluc2VydEF0RW5kT2ZBcnRpY2xlKEBlZGl0b3IsIGRlZmluaXRpb25UZXh0KVxuICAgICAgZWxzZVxuICAgICAgICBoZWxwZXIuaW5zZXJ0QWZ0ZXJDdXJyZW50UGFyYWdyYXBoKEBlZGl0b3IsIGRlZmluaXRpb25UZXh0KVxuXG4gIF9yZWZlcmVuY2VMaW5rOiAobGluaykgLT5cbiAgICBsaW5rWydpbmRlbnQnXSA9IFwiIFwiLnJlcGVhdChjb25maWcuZ2V0KFwicmVmZXJlbmNlSW5kZW50TGVuZ3RoXCIpKVxuICAgIGxpbmtbJ3RpdGxlJ10gPSBpZiAvXlstXFwqXFwhXSQvLnRlc3QobGluay50aXRsZSkgdGhlbiBcIlwiIGVsc2UgbGluay50aXRsZVxuICAgIGxpbmtbJ2xhYmVsJ10gPSBAcmVmZXJlbmNlSWQgfHwgZ3VpZC5yYXcoKVswLi43XVxuICAgIGxpbmtcblxuICByZW1vdmVMaW5rOiAodGV4dCkgLT5cbiAgICBpZiBAcmVmZXJlbmNlSWRcbiAgICAgIEByZXBsYWNlUmVmZXJlbmNlTGluayh0ZXh0KSAjIHJlcGxhY2Ugd2l0aCByYXcgdGV4dFxuICAgIGVsc2VcbiAgICAgIEBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UoQHJhbmdlLCB0ZXh0KVxuXG4gIHJlcGxhY2VSZWZlcmVuY2VMaW5rOiAodGV4dCkgLT5cbiAgICBAZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKEByYW5nZSwgdGV4dClcblxuICAgIHBvc2l0aW9uID0gQGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG4gICAgaGVscGVyLnJlbW92ZURlZmluaXRpb25SYW5nZShAZWRpdG9yLCBAZGVmaW5pdGlvblJhbmdlKVxuICAgIEBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24ocG9zaXRpb24pXG5cbiAgc2V0TGluazogKGxpbmspIC0+XG4gICAgQHRleHRFZGl0b3Iuc2V0VGV4dChsaW5rLnRleHQpXG4gICAgQHRpdGxlRWRpdG9yLnNldFRleHQobGluay50aXRsZSlcbiAgICBAdXJsRWRpdG9yLnNldFRleHQobGluay51cmwpXG5cbiAgZ2V0U2F2ZWRMaW5rOiAodGV4dCkgLT5cbiAgICBsaW5rID0gQGxpbmtzP1t0ZXh0LnRvTG93ZXJDYXNlKCldXG4gICAgcmV0dXJuIGxpbmsgdW5sZXNzIGxpbmtcblxuICAgIGxpbmtbXCJ0ZXh0XCJdID0gdGV4dCB1bmxlc3MgbGluay50ZXh0XG4gICAgcmV0dXJuIGxpbmtcblxuICBpc0luU2F2ZWRMaW5rOiAobGluaykgLT5cbiAgICBzYXZlZExpbmsgPSBAZ2V0U2F2ZWRMaW5rKGxpbmsudGV4dClcbiAgICAhIXNhdmVkTGluayAmJiAhKFtcInRleHRcIiwgXCJ0aXRsZVwiLCBcInVybFwiXS5zb21lIChrKSAtPiBzYXZlZExpbmtba10gIT0gbGlua1trXSlcblxuICB1cGRhdGVUb0xpbmtzOiAobGluaykgLT5cbiAgICBsaW5rVXBkYXRlZCA9IGZhbHNlXG4gICAgaW5TYXZlZExpbmsgPSBAaXNJblNhdmVkTGluayhsaW5rKVxuXG4gICAgaWYgQHNhdmVDaGVja2JveC5wcm9wKFwiY2hlY2tlZFwiKVxuICAgICAgaWYgIWluU2F2ZWRMaW5rICYmIGxpbmsudXJsXG4gICAgICAgIEBsaW5rc1tsaW5rLnRleHQudG9Mb3dlckNhc2UoKV0gPSBsaW5rXG4gICAgICAgIGxpbmtVcGRhdGVkID0gdHJ1ZVxuICAgIGVsc2UgaWYgaW5TYXZlZExpbmtcbiAgICAgIGRlbGV0ZSBAbGlua3NbbGluay50ZXh0LnRvTG93ZXJDYXNlKCldXG4gICAgICBsaW5rVXBkYXRlZCA9IHRydWVcblxuICAgIHJldHVybiBsaW5rVXBkYXRlZFxuXG4gICMgc2F2ZSB0aGUgbmV3IGxpbmsgdG8gQ1NPTiBmaWxlIGlmIHRoZSBsaW5rIGhhcyB1cGRhdGVkIEBsaW5rc1xuICB1cGRhdGVTYXZlZExpbmtzOiAobGluaykgLT5cbiAgICBDU09OLndyaXRlRmlsZShjb25maWcuZ2V0KFwic2l0ZUxpbmtQYXRoXCIpLCBAbGlua3MpIGlmIEB1cGRhdGVUb0xpbmtzKGxpbmspXG5cbiAgIyBsb2FkIHNhdmVkIGxpbmtzIGZyb20gQ1NPTiBmaWxlc1xuICBsb2FkU2F2ZWRMaW5rczogKGNhbGxiYWNrKSAtPlxuICAgIENTT04ucmVhZEZpbGUgY29uZmlnLmdldChcInNpdGVMaW5rUGF0aFwiKSwgKGVyciwgZGF0YSkgPT5cbiAgICAgIEBsaW5rcyA9IGRhdGEgfHwge31cbiAgICAgIGNhbGxiYWNrKClcblxuICAjIGZldGNoIHJlbW90ZSBwb3N0cyBpbiBKU09OIGZvcm1hdFxuICBmZXRjaFBvc3RzOiAtPlxuICAgIHJldHVybiAoQHNlYXJjaEJveC5oaWRlKCkgaWYgcG9zdHMubGVuZ3RoIDwgMSkgaWYgcG9zdHNcblxuICAgIHN1Y2NlZWQgPSAoYm9keSkgPT5cbiAgICAgIHBvc3RzID0gYm9keS5wb3N0c1xuICAgICAgaWYgcG9zdHMubGVuZ3RoID4gMFxuICAgICAgICBAc2VhcmNoQm94LnNob3coKVxuICAgICAgICBAc2VhcmNoRWRpdG9yLnNldFRleHQoQHRleHRFZGl0b3IuZ2V0VGV4dCgpKVxuICAgICAgICBAdXBkYXRlU2VhcmNoKEB0ZXh0RWRpdG9yLmdldFRleHQoKSlcbiAgICBlcnJvciA9IChlcnIpID0+IEBzZWFyY2hCb3guaGlkZSgpXG5cbiAgICB1dGlscy5nZXRKU09OKGNvbmZpZy5nZXQoXCJ1cmxGb3JQb3N0c1wiKSwgc3VjY2VlZCwgZXJyb3IpXG4iXX0=
