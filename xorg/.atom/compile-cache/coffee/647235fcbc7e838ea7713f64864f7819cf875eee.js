(function() {
  var $, CompositeDisposable, NewFileView, TextEditorView, View, config, fs, path, ref, templateHelper, utils,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require("atom-space-pen-views"), $ = ref.$, View = ref.View, TextEditorView = ref.TextEditorView;

  path = require("path");

  fs = require("fs-plus");

  config = require("../config");

  utils = require("../utils");

  templateHelper = require("../helpers/template-helper");

  module.exports = NewFileView = (function(superClass) {
    extend(NewFileView, superClass);

    function NewFileView() {
      return NewFileView.__super__.constructor.apply(this, arguments);
    }

    NewFileView.fileType = "File";

    NewFileView.pathConfig = "siteFilesDir";

    NewFileView.fileNameConfig = "newFileFileName";

    NewFileView.content = function() {
      return this.div({
        "class": "markdown-writer"
      }, (function(_this) {
        return function() {
          _this.label("Add New " + _this.fileType, {
            "class": "icon icon-file-add"
          });
          _this.div(function() {
            _this.label("Directory", {
              "class": "message"
            });
            _this.subview("pathEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Date", {
              "class": "message"
            });
            _this.subview("dateEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Title", {
              "class": "message"
            });
            return _this.subview("titleEditor", new TextEditorView({
              mini: true
            }));
          });
          _this.p({
            "class": "message",
            outlet: "message"
          });
          return _this.p({
            "class": "error",
            outlet: "error"
          });
        };
      })(this));
    };

    NewFileView.prototype.initialize = function() {
      utils.setTabIndex([this.titleEditor, this.pathEditor, this.dateEditor]);
      this.dateTime = templateHelper.getDateTime();
      this.titleEditor.getModel().onDidChange((function(_this) {
        return function() {
          return _this.updatePath();
        };
      })(this));
      this.pathEditor.getModel().onDidChange((function(_this) {
        return function() {
          return _this.updatePath();
        };
      })(this));
      this.dateEditor.getModel().onDidChange((function(_this) {
        return function() {
          return _this.pathEditor.setText(templateHelper.create(_this.constructor.pathConfig, _this.getDateTime()));
        };
      })(this));
      this.disposables = new CompositeDisposable();
      return this.disposables.add(atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.createFile();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      }));
    };

    NewFileView.prototype.display = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.dateEditor.setText(templateHelper.getFrontMatterDate(this.dateTime));
      this.pathEditor.setText(templateHelper.create(this.constructor.pathConfig, this.dateTime));
      this.panel.show();
      return this.titleEditor.focus();
    };

    NewFileView.prototype.detach = function() {
      var ref1;
      if (this.panel.isVisible()) {
        this.panel.hide();
        if ((ref1 = this.previouslyFocusedElement) != null) {
          ref1.focus();
        }
      }
      return NewFileView.__super__.detach.apply(this, arguments);
    };

    NewFileView.prototype.detached = function() {
      var ref1;
      if ((ref1 = this.disposables) != null) {
        ref1.dispose();
      }
      return this.disposables = null;
    };

    NewFileView.prototype.createFile = function() {
      var error, filePath, frontMatterText;
      try {
        filePath = path.join(this.getFileDir(), this.getFilePath());
        if (fs.existsSync(filePath)) {
          return this.error.text("File " + filePath + " already exists!");
        } else {
          frontMatterText = templateHelper.create("frontMatter", this.getFrontMatter(), this.getDateTime());
          fs.writeFileSync(filePath, frontMatterText);
          atom.workspace.open(filePath);
          return this.detach();
        }
      } catch (error1) {
        error = error1;
        return this.error.text("" + error.message);
      }
    };

    NewFileView.prototype.updatePath = function() {
      return this.message.html("<b>Site Directory:</b> " + (this.getFileDir()) + "<br/>\n<b>Create " + this.constructor.fileType + " At:</b> " + (this.getFilePath()));
    };

    NewFileView.prototype.getLayout = function() {
      return "post";
    };

    NewFileView.prototype.getPublished = function() {
      return this.constructor.fileType === "Post";
    };

    NewFileView.prototype.getTitle = function() {
      return this.titleEditor.getText() || ("New " + this.constructor.fileType);
    };

    NewFileView.prototype.getSlug = function() {
      return utils.slugize(this.getTitle(), config.get('slugSeparator'));
    };

    NewFileView.prototype.getDate = function() {
      return templateHelper.getFrontMatterDate(this.getDateTime());
    };

    NewFileView.prototype.getExtension = function() {
      return config.get("fileExtension");
    };

    NewFileView.prototype.getFileDir = function() {
      return utils.getSitePath(config.get("siteLocalDir"));
    };

    NewFileView.prototype.getFilePath = function() {
      return path.join(this.pathEditor.getText(), this.getFileName());
    };

    NewFileView.prototype.getFileName = function() {
      return templateHelper.create(this.constructor.fileNameConfig, this.getFrontMatter(), this.getDateTime());
    };

    NewFileView.prototype.getDateTime = function() {
      return templateHelper.parseFrontMatterDate(this.dateEditor.getText()) || this.dateTime;
    };

    NewFileView.prototype.getFrontMatter = function() {
      return templateHelper.getFrontMatter(this);
    };

    return NewFileView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvdmlld3MvbmV3LWZpbGUtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHVHQUFBO0lBQUE7OztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsTUFBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBRCxFQUFJLGVBQUosRUFBVTs7RUFDVixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUVMLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUjs7RUFDVCxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVI7O0VBQ1IsY0FBQSxHQUFpQixPQUFBLENBQVEsNEJBQVI7O0VBRWpCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7SUFDSixXQUFDLENBQUEsUUFBRCxHQUFZOztJQUNaLFdBQUMsQ0FBQSxVQUFELEdBQWM7O0lBQ2QsV0FBQyxDQUFBLGNBQUQsR0FBa0I7O0lBRWxCLFdBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGlCQUFQO09BQUwsRUFBK0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQzdCLEtBQUMsQ0FBQSxLQUFELENBQU8sVUFBQSxHQUFXLEtBQUMsQ0FBQSxRQUFuQixFQUErQjtZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sb0JBQVA7V0FBL0I7VUFDQSxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUE7WUFDSCxLQUFDLENBQUEsS0FBRCxDQUFPLFdBQVAsRUFBb0I7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFNBQVA7YUFBcEI7WUFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBMkIsSUFBQSxjQUFB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QUFsQjtJQUFIOzswQkFDWixXQUFBLEdBQWEsU0FBQTthQUFHLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUEsQ0FBVixFQUFpQyxJQUFDLENBQUEsV0FBRCxDQUFBLENBQWpDO0lBQUg7OzBCQUViLFdBQUEsR0FBYSxTQUFBO2FBQUcsY0FBYyxDQUFDLE1BQWYsQ0FBc0IsSUFBQyxDQUFBLFdBQVcsQ0FBQyxjQUFuQyxFQUFtRCxJQUFDLENBQUEsY0FBRCxDQUFBLENBQW5ELEVBQXNFLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FBdEU7SUFBSDs7MEJBQ2IsV0FBQSxHQUFhLFNBQUE7YUFBRyxjQUFjLENBQUMsb0JBQWYsQ0FBb0MsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUEsQ0FBcEMsQ0FBQSxJQUE4RCxJQUFDLENBQUE7SUFBbEU7OzBCQUNiLGNBQUEsR0FBZ0IsU0FBQTthQUFHLGNBQWMsQ0FBQyxjQUFmLENBQThCLElBQTlCO0lBQUg7Ozs7S0F6RlE7QUFWMUIiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xueyQsIFZpZXcsIFRleHRFZGl0b3JWaWV3fSA9IHJlcXVpcmUgXCJhdG9tLXNwYWNlLXBlbi12aWV3c1wiXG5wYXRoID0gcmVxdWlyZSBcInBhdGhcIlxuZnMgPSByZXF1aXJlIFwiZnMtcGx1c1wiXG5cbmNvbmZpZyA9IHJlcXVpcmUgXCIuLi9jb25maWdcIlxudXRpbHMgPSByZXF1aXJlIFwiLi4vdXRpbHNcIlxudGVtcGxhdGVIZWxwZXIgPSByZXF1aXJlIFwiLi4vaGVscGVycy90ZW1wbGF0ZS1oZWxwZXJcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBOZXdGaWxlVmlldyBleHRlbmRzIFZpZXdcbiAgQGZpbGVUeXBlID0gXCJGaWxlXCIgIyBvdmVycmlkZVxuICBAcGF0aENvbmZpZyA9IFwic2l0ZUZpbGVzRGlyXCIgIyBvdmVycmlkZVxuICBAZmlsZU5hbWVDb25maWcgPSBcIm5ld0ZpbGVGaWxlTmFtZVwiICMgb3ZlcnJpZGVcblxuICBAY29udGVudDogLT5cbiAgICBAZGl2IGNsYXNzOiBcIm1hcmtkb3duLXdyaXRlclwiLCA9PlxuICAgICAgQGxhYmVsIFwiQWRkIE5ldyAje0BmaWxlVHlwZX1cIiwgY2xhc3M6IFwiaWNvbiBpY29uLWZpbGUtYWRkXCJcbiAgICAgIEBkaXYgPT5cbiAgICAgICAgQGxhYmVsIFwiRGlyZWN0b3J5XCIsIGNsYXNzOiBcIm1lc3NhZ2VcIlxuICAgICAgICBAc3VidmlldyBcInBhdGhFZGl0b3JcIiwgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUpXG4gICAgICAgIEBsYWJlbCBcIkRhdGVcIiwgY2xhc3M6IFwibWVzc2FnZVwiXG4gICAgICAgIEBzdWJ2aWV3IFwiZGF0ZUVkaXRvclwiLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSlcbiAgICAgICAgQGxhYmVsIFwiVGl0bGVcIiwgY2xhc3M6IFwibWVzc2FnZVwiXG4gICAgICAgIEBzdWJ2aWV3IFwidGl0bGVFZGl0b3JcIiwgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUpXG4gICAgICBAcCBjbGFzczogXCJtZXNzYWdlXCIsIG91dGxldDogXCJtZXNzYWdlXCJcbiAgICAgIEBwIGNsYXNzOiBcImVycm9yXCIsIG91dGxldDogXCJlcnJvclwiXG5cbiAgaW5pdGlhbGl6ZTogLT5cbiAgICB1dGlscy5zZXRUYWJJbmRleChbQHRpdGxlRWRpdG9yLCBAcGF0aEVkaXRvciwgQGRhdGVFZGl0b3JdKVxuXG4gICAgIyBzYXZlIGN1cnJlbnQgZGF0ZSB0aW1lIGFzIGJhc2VcbiAgICBAZGF0ZVRpbWUgPSB0ZW1wbGF0ZUhlbHBlci5nZXREYXRlVGltZSgpXG5cbiAgICBAdGl0bGVFZGl0b3IuZ2V0TW9kZWwoKS5vbkRpZENoYW5nZSA9PiBAdXBkYXRlUGF0aCgpXG4gICAgQHBhdGhFZGl0b3IuZ2V0TW9kZWwoKS5vbkRpZENoYW5nZSA9PiBAdXBkYXRlUGF0aCgpXG4gICAgIyB1cGRhdGUgcGF0aEVkaXRvciB0byByZWZsZWN0IGRhdGUgY2hhbmdlcywgaG93ZXZlciB0aGlzIHdpbGwgb3ZlcndyaXRlIHVzZXIgY2hhbmdlc1xuICAgIEBkYXRlRWRpdG9yLmdldE1vZGVsKCkub25EaWRDaGFuZ2UgPT5cbiAgICAgIEBwYXRoRWRpdG9yLnNldFRleHQodGVtcGxhdGVIZWxwZXIuY3JlYXRlKEBjb25zdHJ1Y3Rvci5wYXRoQ29uZmlnLCBAZ2V0RGF0ZVRpbWUoKSkpXG5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgQGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZChcbiAgICAgIEBlbGVtZW50LCB7XG4gICAgICAgIFwiY29yZTpjb25maXJtXCI6ID0+IEBjcmVhdGVGaWxlKClcbiAgICAgICAgXCJjb3JlOmNhbmNlbFwiOiA9PiBAZGV0YWNoKClcbiAgICAgIH0pKVxuXG4gIGRpc3BsYXk6IC0+XG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcywgdmlzaWJsZTogZmFsc2UpXG4gICAgQHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9ICQoZG9jdW1lbnQuYWN0aXZlRWxlbWVudClcbiAgICBAZGF0ZUVkaXRvci5zZXRUZXh0KHRlbXBsYXRlSGVscGVyLmdldEZyb250TWF0dGVyRGF0ZShAZGF0ZVRpbWUpKVxuICAgIEBwYXRoRWRpdG9yLnNldFRleHQodGVtcGxhdGVIZWxwZXIuY3JlYXRlKEBjb25zdHJ1Y3Rvci5wYXRoQ29uZmlnLCBAZGF0ZVRpbWUpKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAdGl0bGVFZGl0b3IuZm9jdXMoKVxuXG4gIGRldGFjaDogLT5cbiAgICBpZiBAcGFuZWwuaXNWaXNpYmxlKClcbiAgICAgIEBwYW5lbC5oaWRlKClcbiAgICAgIEBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQ/LmZvY3VzKClcbiAgICBzdXBlclxuXG4gIGRldGFjaGVkOiAtPlxuICAgIEBkaXNwb3NhYmxlcz8uZGlzcG9zZSgpXG4gICAgQGRpc3Bvc2FibGVzID0gbnVsbFxuXG4gIGNyZWF0ZUZpbGU6IC0+XG4gICAgdHJ5XG4gICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihAZ2V0RmlsZURpcigpLCBAZ2V0RmlsZVBhdGgoKSlcblxuICAgICAgaWYgZnMuZXhpc3RzU3luYyhmaWxlUGF0aClcbiAgICAgICAgQGVycm9yLnRleHQoXCJGaWxlICN7ZmlsZVBhdGh9IGFscmVhZHkgZXhpc3RzIVwiKVxuICAgICAgZWxzZVxuICAgICAgICBmcm9udE1hdHRlclRleHQgPSB0ZW1wbGF0ZUhlbHBlci5jcmVhdGUoXCJmcm9udE1hdHRlclwiLCBAZ2V0RnJvbnRNYXR0ZXIoKSwgQGdldERhdGVUaW1lKCkpXG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZVBhdGgsIGZyb250TWF0dGVyVGV4dClcbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlUGF0aClcbiAgICAgICAgQGRldGFjaCgpXG4gICAgY2F0Y2ggZXJyb3JcbiAgICAgIEBlcnJvci50ZXh0KFwiI3tlcnJvci5tZXNzYWdlfVwiKVxuXG4gIHVwZGF0ZVBhdGg6IC0+XG4gICAgQG1lc3NhZ2UuaHRtbCBcIlwiXCJcbiAgICA8Yj5TaXRlIERpcmVjdG9yeTo8L2I+ICN7QGdldEZpbGVEaXIoKX08YnIvPlxuICAgIDxiPkNyZWF0ZSAje0Bjb25zdHJ1Y3Rvci5maWxlVHlwZX0gQXQ6PC9iPiAje0BnZXRGaWxlUGF0aCgpfVxuICAgIFwiXCJcIlxuXG4gICMgY29tbW9uIGludGVyZmFjZSBmb3IgRnJvbnRNYXR0ZXJcbiAgZ2V0TGF5b3V0OiAtPiBcInBvc3RcIlxuICBnZXRQdWJsaXNoZWQ6IC0+IEBjb25zdHJ1Y3Rvci5maWxlVHlwZSA9PSBcIlBvc3RcIlxuICBnZXRUaXRsZTogLT4gQHRpdGxlRWRpdG9yLmdldFRleHQoKSB8fCBcIk5ldyAje0Bjb25zdHJ1Y3Rvci5maWxlVHlwZX1cIlxuICBnZXRTbHVnOiAtPiB1dGlscy5zbHVnaXplKEBnZXRUaXRsZSgpLCBjb25maWcuZ2V0KCdzbHVnU2VwYXJhdG9yJykpXG4gIGdldERhdGU6IC0+IHRlbXBsYXRlSGVscGVyLmdldEZyb250TWF0dGVyRGF0ZShAZ2V0RGF0ZVRpbWUoKSlcbiAgZ2V0RXh0ZW5zaW9uOiAtPiBjb25maWcuZ2V0KFwiZmlsZUV4dGVuc2lvblwiKVxuXG4gICMgbmV3IGZpbGUgYW5kIGZyb250IG1hdHRlcnNcbiAgZ2V0RmlsZURpcjogLT4gdXRpbHMuZ2V0U2l0ZVBhdGgoY29uZmlnLmdldChcInNpdGVMb2NhbERpclwiKSlcbiAgZ2V0RmlsZVBhdGg6IC0+IHBhdGguam9pbihAcGF0aEVkaXRvci5nZXRUZXh0KCksIEBnZXRGaWxlTmFtZSgpKVxuXG4gIGdldEZpbGVOYW1lOiAtPiB0ZW1wbGF0ZUhlbHBlci5jcmVhdGUoQGNvbnN0cnVjdG9yLmZpbGVOYW1lQ29uZmlnLCBAZ2V0RnJvbnRNYXR0ZXIoKSwgQGdldERhdGVUaW1lKCkpXG4gIGdldERhdGVUaW1lOiAtPiB0ZW1wbGF0ZUhlbHBlci5wYXJzZUZyb250TWF0dGVyRGF0ZShAZGF0ZUVkaXRvci5nZXRUZXh0KCkpIHx8IEBkYXRlVGltZVxuICBnZXRGcm9udE1hdHRlcjogLT4gdGVtcGxhdGVIZWxwZXIuZ2V0RnJvbnRNYXR0ZXIodGhpcylcbiJdfQ==
