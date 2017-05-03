(function() {
  var $, CompositeDisposable, InsertImageView, TextEditorView, View, config, dialog, fs, lastInsertImageDir, path, ref, remote, templateHelper, utils,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require("atom-space-pen-views"), $ = ref.$, View = ref.View, TextEditorView = ref.TextEditorView;

  path = require("path");

  fs = require("fs-plus");

  remote = require("remote");

  dialog = remote.dialog || remote.require("dialog");

  config = require("../config");

  utils = require("../utils");

  templateHelper = require("../helpers/template-helper");

  lastInsertImageDir = null;

  module.exports = InsertImageView = (function(superClass) {
    extend(InsertImageView, superClass);

    function InsertImageView() {
      return InsertImageView.__super__.constructor.apply(this, arguments);
    }

    InsertImageView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-dialog"
      }, (function(_this) {
        return function() {
          _this.label("Insert Image", {
            "class": "icon icon-device-camera"
          });
          _this.div(function() {
            _this.label("Image Path (src)", {
              "class": "message"
            });
            _this.subview("imageEditor", new TextEditorView({
              mini: true
            }));
            _this.div({
              "class": "dialog-row"
            }, function() {
              _this.button("Choose Local Image", {
                outlet: "openImageButton",
                "class": "btn"
              });
              return _this.label({
                outlet: "message",
                "class": "side-label"
              });
            });
            _this.label("Title (alt)", {
              "class": "message"
            });
            _this.subview("titleEditor", new TextEditorView({
              mini: true
            }));
            _this.div({
              "class": "col-1"
            }, function() {
              _this.label("Width (px)", {
                "class": "message"
              });
              return _this.subview("widthEditor", new TextEditorView({
                mini: true
              }));
            });
            _this.div({
              "class": "col-1"
            }, function() {
              _this.label("Height (px)", {
                "class": "message"
              });
              return _this.subview("heightEditor", new TextEditorView({
                mini: true
              }));
            });
            return _this.div({
              "class": "col-2"
            }, function() {
              _this.label("Alignment", {
                "class": "message"
              });
              return _this.subview("alignEditor", new TextEditorView({
                mini: true
              }));
            });
          });
          _this.div({
            outlet: "copyImagePanel",
            "class": "hidden dialog-row"
          }, function() {
            return _this.label({
              "for": "markdown-writer-copy-image-checkbox"
            }, function() {
              _this.input({
                id: "markdown-writer-copy-image-checkbox"
              }, {
                type: "checkbox",
                outlet: "copyImageCheckbox"
              });
              return _this.span("Copy Image to Site Image Directory", {
                "class": "side-label",
                outlet: "copyImageMessage"
              });
            });
          });
          return _this.div({
            "class": "image-container"
          }, function() {
            return _this.img({
              outlet: 'imagePreview'
            });
          });
        };
      })(this));
    };

    InsertImageView.prototype.initialize = function() {
      utils.setTabIndex([this.imageEditor, this.openImageButton, this.titleEditor, this.widthEditor, this.heightEditor, this.alignEditor, this.copyImageCheckbox]);
      this.imageEditor.on("blur", (function(_this) {
        return function() {
          var file;
          file = _this.imageEditor.getText().trim();
          _this.updateImageSource(file);
          return _this.updateCopyImageDest(file);
        };
      })(this));
      this.titleEditor.on("blur", (function(_this) {
        return function() {
          return _this.updateCopyImageDest(_this.imageEditor.getText().trim());
        };
      })(this));
      this.openImageButton.on("click", (function(_this) {
        return function() {
          return _this.openImageDialog();
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

    InsertImageView.prototype.onConfirm = function() {
      var callback, imgSource;
      imgSource = this.imageEditor.getText().trim();
      if (!imgSource) {
        return;
      }
      callback = (function(_this) {
        return function() {
          _this.editor.transact(function() {
            return _this.insertImageTag();
          });
          return _this.detach();
        };
      })(this);
      if (!this.copyImageCheckbox.hasClass('hidden') && this.copyImageCheckbox.prop("checked")) {
        return this.copyImage(this.resolveImagePath(imgSource), callback);
      } else {
        return callback();
      }
    };

    InsertImageView.prototype.display = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.editor = atom.workspace.getActiveTextEditor();
      this.frontMatter = templateHelper.getEditor(this.editor);
      this.dateTime = templateHelper.getDateTime();
      this.setFieldsFromSelection();
      this.panel.show();
      return this.imageEditor.focus();
    };

    InsertImageView.prototype.detach = function() {
      var ref1;
      if (this.panel.isVisible()) {
        this.panel.hide();
        if ((ref1 = this.previouslyFocusedElement) != null) {
          ref1.focus();
        }
      }
      return InsertImageView.__super__.detach.apply(this, arguments);
    };

    InsertImageView.prototype.detached = function() {
      var ref1;
      if ((ref1 = this.disposables) != null) {
        ref1.dispose();
      }
      return this.disposables = null;
    };

    InsertImageView.prototype.setFieldsFromSelection = function() {
      var img, selection;
      this.range = utils.getTextBufferRange(this.editor, "link");
      selection = this.editor.getTextInRange(this.range);
      if (!selection) {
        return;
      }
      if (utils.isImage(selection)) {
        img = utils.parseImage(selection);
      } else if (utils.isImageTag(selection)) {
        img = utils.parseImageTag(selection);
      } else {
        img = {
          alt: selection
        };
      }
      this.titleEditor.setText(img.alt || "");
      this.widthEditor.setText(img.width || "");
      this.heightEditor.setText(img.height || "");
      this.imageEditor.setText(img.src || "");
      return this.updateImageSource(img.src);
    };

    InsertImageView.prototype.openImageDialog = function() {
      var files;
      files = dialog.showOpenDialog({
        properties: ['openFile'],
        defaultPath: lastInsertImageDir || this.siteLocalDir()
      });
      if (!(files && files.length > 0)) {
        return;
      }
      this.imageEditor.setText(files[0]);
      this.updateImageSource(files[0]);
      if (!utils.isUrl(files[0])) {
        lastInsertImageDir = path.dirname(files[0]);
      }
      return this.titleEditor.focus();
    };

    InsertImageView.prototype.updateImageSource = function(file) {
      if (!file) {
        return;
      }
      this.displayImagePreview(file);
      if (utils.isUrl(file) || this.isInSiteDir(this.resolveImagePath(file))) {
        return this.copyImagePanel.addClass("hidden");
      } else {
        return this.copyImagePanel.removeClass("hidden");
      }
    };

    InsertImageView.prototype.updateCopyImageDest = function(file) {
      var destFile;
      if (!file) {
        return;
      }
      destFile = this.copyImageDestPath(file, this.titleEditor.getText());
      return this.copyImageMessage.text("Copy Image to " + destFile);
    };

    InsertImageView.prototype.displayImagePreview = function(file) {
      if (this.imageOnPreview === file) {
        return;
      }
      if (utils.isImageFile(file)) {
        this.message.text("Opening Image Preview ...");
        this.imagePreview.attr("src", this.resolveImagePath(file));
        this.imagePreview.load((function(_this) {
          return function() {
            _this.message.text("");
            return _this.setImageContext();
          };
        })(this));
        this.imagePreview.error((function(_this) {
          return function() {
            _this.message.text("Error: Failed to Load Image.");
            return _this.imagePreview.attr("src", "");
          };
        })(this));
      } else {
        if (file) {
          this.message.text("Error: Invalid Image File.");
        }
        this.imagePreview.attr("src", "");
        this.widthEditor.setText("");
        this.heightEditor.setText("");
        this.alignEditor.setText("");
      }
      return this.imageOnPreview = file;
    };

    InsertImageView.prototype.setImageContext = function() {
      var naturalHeight, naturalWidth, position, ref1;
      ref1 = this.imagePreview.context, naturalWidth = ref1.naturalWidth, naturalHeight = ref1.naturalHeight;
      this.widthEditor.setText("" + naturalWidth);
      this.heightEditor.setText("" + naturalHeight);
      position = naturalWidth > 300 ? "center" : "right";
      return this.alignEditor.setText(position);
    };

    InsertImageView.prototype.insertImageTag = function() {
      var img, imgSource, text;
      imgSource = this.imageEditor.getText().trim();
      img = {
        rawSrc: imgSource,
        src: this.generateImageSrc(imgSource),
        relativeFileSrc: this.generateRelativeImageSrc(imgSource, this.currentFileDir()),
        relativeSiteSrc: this.generateRelativeImageSrc(imgSource, this.siteLocalDir()),
        alt: this.titleEditor.getText(),
        width: this.widthEditor.getText(),
        height: this.heightEditor.getText(),
        align: this.alignEditor.getText()
      };
      if (img.src) {
        text = templateHelper.create("imageTag", this.frontMatter, this.dateTime, img);
      } else {
        text = img.alt;
      }
      return this.editor.setTextInBufferRange(this.range, text);
    };

    InsertImageView.prototype.copyImage = function(file, callback) {
      var confirmation, destFile, error, performWrite;
      if (utils.isUrl(file) || !fs.existsSync(file)) {
        return callback();
      }
      try {
        destFile = this.copyImageDestPath(file, this.titleEditor.getText());
        performWrite = true;
        if (fs.existsSync(destFile)) {
          confirmation = atom.confirm({
            message: "File already exists!",
            detailedMessage: "Another file already exists at:\n" + destFile + "\nDo you want to overwrite it?",
            buttons: ["No", "Yes"]
          });
          performWrite = confirmation === 1;
        }
        if (performWrite) {
          return fs.copy(file, destFile, (function(_this) {
            return function() {
              _this.imageEditor.setText(destFile);
              return callback();
            };
          })(this));
        }
      } catch (error1) {
        error = error1;
        return atom.confirm({
          message: "[Markdown Writer] Error!",
          detailedMessage: "Copy Image:\n" + error.message,
          buttons: ['OK']
        });
      }
    };

    InsertImageView.prototype.siteLocalDir = function() {
      return utils.getSitePath(config.get("siteLocalDir"));
    };

    InsertImageView.prototype.siteImagesDir = function() {
      return templateHelper.create("siteImagesDir", this.frontMatter, this.dateTime);
    };

    InsertImageView.prototype.currentFileDir = function() {
      return path.dirname(this.editor.getPath() || "");
    };

    InsertImageView.prototype.isInSiteDir = function(file) {
      return file && file.startsWith(this.siteLocalDir());
    };

    InsertImageView.prototype.copyImageDestPath = function(file, title) {
      var extension, filename;
      filename = path.basename(file);
      if (config.get("renameImageOnCopy") && title) {
        extension = path.extname(file);
        title = utils.slugize(title, config.get('slugSeparator'));
        filename = "" + title + extension;
      }
      return path.join(this.siteLocalDir(), this.siteImagesDir(), filename);
    };

    InsertImageView.prototype.resolveImagePath = function(file) {
      var absolutePath, relativePath;
      if (!file) {
        return "";
      }
      if (utils.isUrl(file) || fs.existsSync(file)) {
        return file;
      }
      absolutePath = path.join(this.siteLocalDir(), file);
      if (fs.existsSync(absolutePath)) {
        return absolutePath;
      }
      relativePath = path.join(this.currentFileDir(), file);
      if (fs.existsSync(relativePath)) {
        return relativePath;
      }
      return file;
    };

    InsertImageView.prototype.generateImageSrc = function(file) {
      return utils.normalizeFilePath(this._generateImageSrc(file));
    };

    InsertImageView.prototype._generateImageSrc = function(file) {
      if (!file) {
        return "";
      }
      if (utils.isUrl(file)) {
        return file;
      }
      if (config.get('relativeImagePath')) {
        return path.relative(this.currentFileDir(), file);
      }
      if (this.isInSiteDir(file)) {
        return path.relative(this.siteLocalDir(), file);
      }
      return path.join("/", this.siteImagesDir(), path.basename(file));
    };

    InsertImageView.prototype.generateRelativeImageSrc = function(file, basePath) {
      return utils.normalizeFilePath(this._generateRelativeImageSrc(file, basePath));
    };

    InsertImageView.prototype._generateRelativeImageSrc = function(file, basePath) {
      if (!file) {
        return "";
      }
      if (utils.isUrl(file)) {
        return file;
      }
      return path.relative(basePath || "~", file);
    };

    return InsertImageView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvdmlld3MvaW5zZXJ0LWltYWdlLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwrSUFBQTtJQUFBOzs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLE1BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUQsRUFBSSxlQUFKLEVBQVU7O0VBQ1YsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0VBQ1QsTUFBQSxHQUFTLE1BQU0sQ0FBQyxNQUFQLElBQWlCLE1BQU0sQ0FBQyxPQUFQLENBQWUsUUFBZjs7RUFFMUIsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSOztFQUNULEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUjs7RUFDUixjQUFBLEdBQWlCLE9BQUEsQ0FBUSw0QkFBUjs7RUFFakIsa0JBQUEsR0FBcUI7O0VBRXJCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7SUFDSixlQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyx3Q0FBUDtPQUFMLEVBQXNELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNwRCxLQUFDLENBQUEsS0FBRCxDQUFPLGNBQVAsRUFBdUI7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHlCQUFQO1dBQXZCO1VBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBO1lBQ0gsS0FBQyxDQUFBLEtBQUQsQ0FBTyxrQkFBUCxFQUEyQjtjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sU0FBUDthQUEzQjtZQUNBLEtBQUMsQ0FBQSxPQUFELENBQVMsYUFB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LENBQWMsUUFBQSxJQUFZLEdBQTFCLEVBQStCLElBQS9CO0lBSGtCOzs7O0tBdlBDO0FBZDlCIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbnskLCBWaWV3LCBUZXh0RWRpdG9yVmlld30gPSByZXF1aXJlIFwiYXRvbS1zcGFjZS1wZW4tdmlld3NcIlxucGF0aCA9IHJlcXVpcmUgXCJwYXRoXCJcbmZzID0gcmVxdWlyZSBcImZzLXBsdXNcIlxucmVtb3RlID0gcmVxdWlyZSBcInJlbW90ZVwiXG5kaWFsb2cgPSByZW1vdGUuZGlhbG9nIHx8IHJlbW90ZS5yZXF1aXJlIFwiZGlhbG9nXCJcblxuY29uZmlnID0gcmVxdWlyZSBcIi4uL2NvbmZpZ1wiXG51dGlscyA9IHJlcXVpcmUgXCIuLi91dGlsc1wiXG50ZW1wbGF0ZUhlbHBlciA9IHJlcXVpcmUgXCIuLi9oZWxwZXJzL3RlbXBsYXRlLWhlbHBlclwiXG5cbmxhc3RJbnNlcnRJbWFnZURpciA9IG51bGwgIyByZW1lbWJlciBsYXN0IGluc2VydGVkIGltYWdlIGRpcmVjdG9yeVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBJbnNlcnRJbWFnZVZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgY2xhc3M6IFwibWFya2Rvd24td3JpdGVyIG1hcmtkb3duLXdyaXRlci1kaWFsb2dcIiwgPT5cbiAgICAgIEBsYWJlbCBcIkluc2VydCBJbWFnZVwiLCBjbGFzczogXCJpY29uIGljb24tZGV2aWNlLWNhbWVyYVwiXG4gICAgICBAZGl2ID0+XG4gICAgICAgIEBsYWJlbCBcIkltYWdlIFBhdGggKHNyYylcIiwgY2xhc3M6IFwibWVzc2FnZVwiXG4gICAgICAgIEBzdWJ2aWV3IFwiaW1hZ2VFZGl0b3JcIiwgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUpXG4gICAgICAgIEBkaXYgY2xhc3M6IFwiZGlhbG9nLXJvd1wiLCA9PlxuICAgICAgICAgIEBidXR0b24gXCJDaG9vc2UgTG9jYWwgSW1hZ2VcIiwgb3V0bGV0OiBcIm9wZW5JbWFnZUJ1dHRvblwiLCBjbGFzczogXCJidG5cIlxuICAgICAgICAgIEBsYWJlbCBvdXRsZXQ6IFwibWVzc2FnZVwiLCBjbGFzczogXCJzaWRlLWxhYmVsXCJcbiAgICAgICAgQGxhYmVsIFwiVGl0bGUgKGFsdClcIiwgY2xhc3M6IFwibWVzc2FnZVwiXG4gICAgICAgIEBzdWJ2aWV3IFwidGl0bGVFZGl0b3JcIiwgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUpXG4gICAgICAgIEBkaXYgY2xhc3M6IFwiY29sLTFcIiwgPT5cbiAgICAgICAgICBAbGFiZWwgXCJXaWR0aCAocHgpXCIsIGNsYXNzOiBcIm1lc3NhZ2VcIlxuICAgICAgICAgIEBzdWJ2aWV3IFwid2lkdGhFZGl0b3JcIiwgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUpXG4gICAgICAgIEBkaXYgY2xhc3M6IFwiY29sLTFcIiwgPT5cbiAgICAgICAgICBAbGFiZWwgXCJIZWlnaHQgKHB4KVwiLCBjbGFzczogXCJtZXNzYWdlXCJcbiAgICAgICAgICBAc3VidmlldyBcImhlaWdodEVkaXRvclwiLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSlcbiAgICAgICAgQGRpdiBjbGFzczogXCJjb2wtMlwiLCA9PlxuICAgICAgICAgIEBsYWJlbCBcIkFsaWdubWVudFwiLCBjbGFzczogXCJtZXNzYWdlXCJcbiAgICAgICAgICBAc3VidmlldyBcImFsaWduRWRpdG9yXCIsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlKVxuICAgICAgQGRpdiBvdXRsZXQ6IFwiY29weUltYWdlUGFuZWxcIiwgY2xhc3M6IFwiaGlkZGVuIGRpYWxvZy1yb3dcIiwgPT5cbiAgICAgICAgQGxhYmVsIGZvcjogXCJtYXJrZG93bi13cml0ZXItY29weS1pbWFnZS1jaGVja2JveFwiLCA9PlxuICAgICAgICAgIEBpbnB1dCBpZDogXCJtYXJrZG93bi13cml0ZXItY29weS1pbWFnZS1jaGVja2JveFwiLFxuICAgICAgICAgICAgdHlwZTpcImNoZWNrYm94XCIsIG91dGxldDogXCJjb3B5SW1hZ2VDaGVja2JveFwiXG4gICAgICAgICAgQHNwYW4gXCJDb3B5IEltYWdlIHRvIFNpdGUgSW1hZ2UgRGlyZWN0b3J5XCIsIGNsYXNzOiBcInNpZGUtbGFiZWxcIiwgb3V0bGV0OiBcImNvcHlJbWFnZU1lc3NhZ2VcIlxuICAgICAgQGRpdiBjbGFzczogXCJpbWFnZS1jb250YWluZXJcIiwgPT5cbiAgICAgICAgQGltZyBvdXRsZXQ6ICdpbWFnZVByZXZpZXcnXG5cbiAgaW5pdGlhbGl6ZTogLT5cbiAgICB1dGlscy5zZXRUYWJJbmRleChbQGltYWdlRWRpdG9yLCBAb3BlbkltYWdlQnV0dG9uLCBAdGl0bGVFZGl0b3IsXG4gICAgICBAd2lkdGhFZGl0b3IsIEBoZWlnaHRFZGl0b3IsIEBhbGlnbkVkaXRvciwgQGNvcHlJbWFnZUNoZWNrYm94XSlcblxuICAgIEBpbWFnZUVkaXRvci5vbiBcImJsdXJcIiwgPT5cbiAgICAgIGZpbGUgPSBAaW1hZ2VFZGl0b3IuZ2V0VGV4dCgpLnRyaW0oKVxuICAgICAgQHVwZGF0ZUltYWdlU291cmNlKGZpbGUpXG4gICAgICBAdXBkYXRlQ29weUltYWdlRGVzdChmaWxlKVxuICAgIEB0aXRsZUVkaXRvci5vbiBcImJsdXJcIiwgPT5cbiAgICAgIEB1cGRhdGVDb3B5SW1hZ2VEZXN0KEBpbWFnZUVkaXRvci5nZXRUZXh0KCkudHJpbSgpKVxuICAgIEBvcGVuSW1hZ2VCdXR0b24ub24gXCJjbGlja1wiLCA9PiBAb3BlbkltYWdlRGlhbG9nKClcblxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICBAZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKFxuICAgICAgQGVsZW1lbnQsIHtcbiAgICAgICAgXCJjb3JlOmNvbmZpcm1cIjogPT4gQG9uQ29uZmlybSgpLFxuICAgICAgICBcImNvcmU6Y2FuY2VsXCI6ICA9PiBAZGV0YWNoKClcbiAgICAgIH0pKVxuXG4gIG9uQ29uZmlybTogLT5cbiAgICBpbWdTb3VyY2UgPSBAaW1hZ2VFZGl0b3IuZ2V0VGV4dCgpLnRyaW0oKVxuICAgIHJldHVybiB1bmxlc3MgaW1nU291cmNlXG5cbiAgICBjYWxsYmFjayA9ID0+XG4gICAgICBAZWRpdG9yLnRyYW5zYWN0ID0+IEBpbnNlcnRJbWFnZVRhZygpXG4gICAgICBAZGV0YWNoKClcblxuICAgIGlmICFAY29weUltYWdlQ2hlY2tib3guaGFzQ2xhc3MoJ2hpZGRlbicpICYmIEBjb3B5SW1hZ2VDaGVja2JveC5wcm9wKFwiY2hlY2tlZFwiKVxuICAgICAgQGNvcHlJbWFnZShAcmVzb2x2ZUltYWdlUGF0aChpbWdTb3VyY2UpLCBjYWxsYmFjaylcbiAgICBlbHNlXG4gICAgICBjYWxsYmFjaygpXG5cbiAgZGlzcGxheTogLT5cbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzLCB2aXNpYmxlOiBmYWxzZSlcbiAgICBAcHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gJChkb2N1bWVudC5hY3RpdmVFbGVtZW50KVxuICAgIEBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBAZnJvbnRNYXR0ZXIgPSB0ZW1wbGF0ZUhlbHBlci5nZXRFZGl0b3IoQGVkaXRvcilcbiAgICBAZGF0ZVRpbWUgPSB0ZW1wbGF0ZUhlbHBlci5nZXREYXRlVGltZSgpXG4gICAgQHNldEZpZWxkc0Zyb21TZWxlY3Rpb24oKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAaW1hZ2VFZGl0b3IuZm9jdXMoKVxuXG4gIGRldGFjaDogLT5cbiAgICBpZiBAcGFuZWwuaXNWaXNpYmxlKClcbiAgICAgIEBwYW5lbC5oaWRlKClcbiAgICAgIEBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQ/LmZvY3VzKClcbiAgICBzdXBlclxuXG4gIGRldGFjaGVkOiAtPlxuICAgIEBkaXNwb3NhYmxlcz8uZGlzcG9zZSgpXG4gICAgQGRpc3Bvc2FibGVzID0gbnVsbFxuXG4gIHNldEZpZWxkc0Zyb21TZWxlY3Rpb246IC0+XG4gICAgQHJhbmdlID0gdXRpbHMuZ2V0VGV4dEJ1ZmZlclJhbmdlKEBlZGl0b3IsIFwibGlua1wiKVxuICAgIHNlbGVjdGlvbiA9IEBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoQHJhbmdlKVxuICAgIHJldHVybiB1bmxlc3Mgc2VsZWN0aW9uXG5cbiAgICBpZiB1dGlscy5pc0ltYWdlKHNlbGVjdGlvbilcbiAgICAgIGltZyA9IHV0aWxzLnBhcnNlSW1hZ2Uoc2VsZWN0aW9uKVxuICAgIGVsc2UgaWYgdXRpbHMuaXNJbWFnZVRhZyhzZWxlY3Rpb24pXG4gICAgICBpbWcgPSB1dGlscy5wYXJzZUltYWdlVGFnKHNlbGVjdGlvbilcbiAgICBlbHNlXG4gICAgICBpbWcgPSB7IGFsdDogc2VsZWN0aW9uIH1cblxuICAgIEB0aXRsZUVkaXRvci5zZXRUZXh0KGltZy5hbHQgfHwgXCJcIilcbiAgICBAd2lkdGhFZGl0b3Iuc2V0VGV4dChpbWcud2lkdGggfHwgXCJcIilcbiAgICBAaGVpZ2h0RWRpdG9yLnNldFRleHQoaW1nLmhlaWdodCB8fCBcIlwiKVxuICAgIEBpbWFnZUVkaXRvci5zZXRUZXh0KGltZy5zcmMgfHwgXCJcIilcblxuICAgIEB1cGRhdGVJbWFnZVNvdXJjZShpbWcuc3JjKVxuXG4gIG9wZW5JbWFnZURpYWxvZzogLT5cbiAgICBmaWxlcyA9IGRpYWxvZy5zaG93T3BlbkRpYWxvZ1xuICAgICAgcHJvcGVydGllczogWydvcGVuRmlsZSddXG4gICAgICBkZWZhdWx0UGF0aDogbGFzdEluc2VydEltYWdlRGlyIHx8IEBzaXRlTG9jYWxEaXIoKVxuICAgIHJldHVybiB1bmxlc3MgZmlsZXMgJiYgZmlsZXMubGVuZ3RoID4gMFxuXG4gICAgQGltYWdlRWRpdG9yLnNldFRleHQoZmlsZXNbMF0pXG4gICAgQHVwZGF0ZUltYWdlU291cmNlKGZpbGVzWzBdKVxuXG4gICAgbGFzdEluc2VydEltYWdlRGlyID0gcGF0aC5kaXJuYW1lKGZpbGVzWzBdKSB1bmxlc3MgdXRpbHMuaXNVcmwoZmlsZXNbMF0pXG4gICAgQHRpdGxlRWRpdG9yLmZvY3VzKClcblxuICB1cGRhdGVJbWFnZVNvdXJjZTogKGZpbGUpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBmaWxlXG4gICAgQGRpc3BsYXlJbWFnZVByZXZpZXcoZmlsZSlcblxuICAgIGlmIHV0aWxzLmlzVXJsKGZpbGUpIHx8IEBpc0luU2l0ZURpcihAcmVzb2x2ZUltYWdlUGF0aChmaWxlKSlcbiAgICAgIEBjb3B5SW1hZ2VQYW5lbC5hZGRDbGFzcyhcImhpZGRlblwiKVxuICAgIGVsc2VcbiAgICAgIEBjb3B5SW1hZ2VQYW5lbC5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxuXG4gIHVwZGF0ZUNvcHlJbWFnZURlc3Q6IChmaWxlKSAtPlxuICAgIHJldHVybiB1bmxlc3MgZmlsZVxuICAgIGRlc3RGaWxlID0gQGNvcHlJbWFnZURlc3RQYXRoKGZpbGUsIEB0aXRsZUVkaXRvci5nZXRUZXh0KCkpXG4gICAgQGNvcHlJbWFnZU1lc3NhZ2UudGV4dChcIkNvcHkgSW1hZ2UgdG8gI3tkZXN0RmlsZX1cIilcblxuICBkaXNwbGF5SW1hZ2VQcmV2aWV3OiAoZmlsZSkgLT5cbiAgICByZXR1cm4gaWYgQGltYWdlT25QcmV2aWV3ID09IGZpbGVcblxuICAgIGlmIHV0aWxzLmlzSW1hZ2VGaWxlKGZpbGUpXG4gICAgICBAbWVzc2FnZS50ZXh0KFwiT3BlbmluZyBJbWFnZSBQcmV2aWV3IC4uLlwiKVxuICAgICAgQGltYWdlUHJldmlldy5hdHRyKFwic3JjXCIsIEByZXNvbHZlSW1hZ2VQYXRoKGZpbGUpKVxuICAgICAgQGltYWdlUHJldmlldy5sb2FkID0+XG4gICAgICAgIEBtZXNzYWdlLnRleHQoXCJcIilcbiAgICAgICAgQHNldEltYWdlQ29udGV4dCgpXG4gICAgICBAaW1hZ2VQcmV2aWV3LmVycm9yID0+XG4gICAgICAgIEBtZXNzYWdlLnRleHQoXCJFcnJvcjogRmFpbGVkIHRvIExvYWQgSW1hZ2UuXCIpXG4gICAgICAgIEBpbWFnZVByZXZpZXcuYXR0cihcInNyY1wiLCBcIlwiKVxuICAgIGVsc2VcbiAgICAgIEBtZXNzYWdlLnRleHQoXCJFcnJvcjogSW52YWxpZCBJbWFnZSBGaWxlLlwiKSBpZiBmaWxlXG4gICAgICBAaW1hZ2VQcmV2aWV3LmF0dHIoXCJzcmNcIiwgXCJcIilcbiAgICAgIEB3aWR0aEVkaXRvci5zZXRUZXh0KFwiXCIpXG4gICAgICBAaGVpZ2h0RWRpdG9yLnNldFRleHQoXCJcIilcbiAgICAgIEBhbGlnbkVkaXRvci5zZXRUZXh0KFwiXCIpXG5cbiAgICBAaW1hZ2VPblByZXZpZXcgPSBmaWxlICMgY2FjaGUgcHJldmlldyBpbWFnZSBzcmNcblxuICBzZXRJbWFnZUNvbnRleHQ6IC0+XG4gICAgeyBuYXR1cmFsV2lkdGgsIG5hdHVyYWxIZWlnaHQgfSA9IEBpbWFnZVByZXZpZXcuY29udGV4dFxuICAgIEB3aWR0aEVkaXRvci5zZXRUZXh0KFwiXCIgKyBuYXR1cmFsV2lkdGgpXG4gICAgQGhlaWdodEVkaXRvci5zZXRUZXh0KFwiXCIgKyBuYXR1cmFsSGVpZ2h0KVxuXG4gICAgcG9zaXRpb24gPSBpZiBuYXR1cmFsV2lkdGggPiAzMDAgdGhlbiBcImNlbnRlclwiIGVsc2UgXCJyaWdodFwiXG4gICAgQGFsaWduRWRpdG9yLnNldFRleHQocG9zaXRpb24pXG5cbiAgaW5zZXJ0SW1hZ2VUYWc6IC0+XG4gICAgaW1nU291cmNlID0gQGltYWdlRWRpdG9yLmdldFRleHQoKS50cmltKClcbiAgICBpbWcgPVxuICAgICAgcmF3U3JjOiBpbWdTb3VyY2UsXG4gICAgICBzcmM6IEBnZW5lcmF0ZUltYWdlU3JjKGltZ1NvdXJjZSlcbiAgICAgIHJlbGF0aXZlRmlsZVNyYzogQGdlbmVyYXRlUmVsYXRpdmVJbWFnZVNyYyhpbWdTb3VyY2UsIEBjdXJyZW50RmlsZURpcigpKVxuICAgICAgcmVsYXRpdmVTaXRlU3JjOiBAZ2VuZXJhdGVSZWxhdGl2ZUltYWdlU3JjKGltZ1NvdXJjZSwgQHNpdGVMb2NhbERpcigpKVxuICAgICAgYWx0OiBAdGl0bGVFZGl0b3IuZ2V0VGV4dCgpXG4gICAgICB3aWR0aDogQHdpZHRoRWRpdG9yLmdldFRleHQoKVxuICAgICAgaGVpZ2h0OiBAaGVpZ2h0RWRpdG9yLmdldFRleHQoKVxuICAgICAgYWxpZ246IEBhbGlnbkVkaXRvci5nZXRUZXh0KClcblxuICAgICMgaW5zZXJ0IGltYWdlIHRhZyB3aGVuIGltZy5zcmMgZXhpc3RzLCBvdGhlcndpc2UgY29uc2lkZXIgdGhlIGltYWdlIHdhcyByZW1vdmVkXG4gICAgaWYgaW1nLnNyY1xuICAgICAgdGV4dCA9IHRlbXBsYXRlSGVscGVyLmNyZWF0ZShcImltYWdlVGFnXCIsIEBmcm9udE1hdHRlciwgQGRhdGVUaW1lLCBpbWcpXG4gICAgZWxzZVxuICAgICAgdGV4dCA9IGltZy5hbHRcblxuICAgIEBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UoQHJhbmdlLCB0ZXh0KVxuXG4gIGNvcHlJbWFnZTogKGZpbGUsIGNhbGxiYWNrKSAtPlxuICAgIHJldHVybiBjYWxsYmFjaygpIGlmIHV0aWxzLmlzVXJsKGZpbGUpIHx8ICFmcy5leGlzdHNTeW5jKGZpbGUpXG5cbiAgICB0cnlcbiAgICAgIGRlc3RGaWxlID0gQGNvcHlJbWFnZURlc3RQYXRoKGZpbGUsIEB0aXRsZUVkaXRvci5nZXRUZXh0KCkpXG4gICAgICBwZXJmb3JtV3JpdGUgPSB0cnVlXG5cbiAgICAgIGlmIGZzLmV4aXN0c1N5bmMoZGVzdEZpbGUpXG4gICAgICAgIGNvbmZpcm1hdGlvbiA9IGF0b20uY29uZmlybVxuICAgICAgICAgIG1lc3NhZ2U6IFwiRmlsZSBhbHJlYWR5IGV4aXN0cyFcIlxuICAgICAgICAgIGRldGFpbGVkTWVzc2FnZTogXCJBbm90aGVyIGZpbGUgYWxyZWFkeSBleGlzdHMgYXQ6XFxuI3tkZXN0RmlsZX1cXG5EbyB5b3Ugd2FudCB0byBvdmVyd3JpdGUgaXQ/XCJcbiAgICAgICAgICBidXR0b25zOiBbXCJOb1wiLCBcIlllc1wiXVxuICAgICAgICBwZXJmb3JtV3JpdGUgPSAoY29uZmlybWF0aW9uID09IDEpXG5cbiAgICAgIGlmIHBlcmZvcm1Xcml0ZVxuICAgICAgICBmcy5jb3B5IGZpbGUsIGRlc3RGaWxlLCA9PlxuICAgICAgICAgIEBpbWFnZUVkaXRvci5zZXRUZXh0KGRlc3RGaWxlKVxuICAgICAgICAgIGNhbGxiYWNrKClcbiAgICBjYXRjaCBlcnJvclxuICAgICAgYXRvbS5jb25maXJtXG4gICAgICAgIG1lc3NhZ2U6IFwiW01hcmtkb3duIFdyaXRlcl0gRXJyb3IhXCJcbiAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBcIkNvcHkgSW1hZ2U6XFxuI3tlcnJvci5tZXNzYWdlfVwiXG4gICAgICAgIGJ1dHRvbnM6IFsnT0snXVxuXG4gICMgZ2V0IHVzZXIncyBzaXRlIGxvY2FsIGRpcmVjdG9yeVxuICBzaXRlTG9jYWxEaXI6IC0+IHV0aWxzLmdldFNpdGVQYXRoKGNvbmZpZy5nZXQoXCJzaXRlTG9jYWxEaXJcIikpXG5cbiAgIyBnZXQgdXNlcidzIHNpdGUgaW1hZ2VzIGRpcmVjdG9yeVxuICBzaXRlSW1hZ2VzRGlyOiAtPiB0ZW1wbGF0ZUhlbHBlci5jcmVhdGUoXCJzaXRlSW1hZ2VzRGlyXCIsIEBmcm9udE1hdHRlciwgQGRhdGVUaW1lKVxuXG4gICMgZ2V0IGN1cnJlbnQgb3BlbiBmaWxlIGRpcmVjdG9yeVxuICBjdXJyZW50RmlsZURpcjogLT4gcGF0aC5kaXJuYW1lKEBlZGl0b3IuZ2V0UGF0aCgpIHx8IFwiXCIpXG5cbiAgIyBjaGVjayB0aGUgZmlsZSBpcyBpbiB0aGUgc2l0ZSBkaXJlY3RvcnlcbiAgaXNJblNpdGVEaXI6IChmaWxlKSAtPiBmaWxlICYmIGZpbGUuc3RhcnRzV2l0aChAc2l0ZUxvY2FsRGlyKCkpXG5cbiAgIyBnZXQgY29weSBpbWFnZSBkZXN0aW5hdGlvbiBmaWxlIHBhdGhcbiAgY29weUltYWdlRGVzdFBhdGg6IChmaWxlLCB0aXRsZSkgLT5cbiAgICBmaWxlbmFtZSA9IHBhdGguYmFzZW5hbWUoZmlsZSlcblxuICAgIGlmIGNvbmZpZy5nZXQoXCJyZW5hbWVJbWFnZU9uQ29weVwiKSAmJiB0aXRsZVxuICAgICAgZXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKGZpbGUpXG4gICAgICB0aXRsZSA9IHV0aWxzLnNsdWdpemUodGl0bGUsIGNvbmZpZy5nZXQoJ3NsdWdTZXBhcmF0b3InKSlcbiAgICAgIGZpbGVuYW1lID0gXCIje3RpdGxlfSN7ZXh0ZW5zaW9ufVwiXG5cbiAgICBwYXRoLmpvaW4oQHNpdGVMb2NhbERpcigpLCBAc2l0ZUltYWdlc0RpcigpLCBmaWxlbmFtZSlcblxuICAjIHRyeSB0byByZXNvbHZlIGZpbGUgdG8gYSB2YWxpZCBzcmMgdGhhdCBjb3VsZCBiZSBkaXNwbGF5ZWRcbiAgcmVzb2x2ZUltYWdlUGF0aDogKGZpbGUpIC0+XG4gICAgcmV0dXJuIFwiXCIgdW5sZXNzIGZpbGVcbiAgICByZXR1cm4gZmlsZSBpZiB1dGlscy5pc1VybChmaWxlKSB8fCBmcy5leGlzdHNTeW5jKGZpbGUpXG4gICAgYWJzb2x1dGVQYXRoID0gcGF0aC5qb2luKEBzaXRlTG9jYWxEaXIoKSwgZmlsZSlcbiAgICByZXR1cm4gYWJzb2x1dGVQYXRoIGlmIGZzLmV4aXN0c1N5bmMoYWJzb2x1dGVQYXRoKVxuICAgIHJlbGF0aXZlUGF0aCA9IHBhdGguam9pbihAY3VycmVudEZpbGVEaXIoKSwgZmlsZSlcbiAgICByZXR1cm4gcmVsYXRpdmVQYXRoIGlmIGZzLmV4aXN0c1N5bmMocmVsYXRpdmVQYXRoKVxuICAgIHJldHVybiBmaWxlICMgZmFsbGJhY2sgdG8gbm90IHJlc29sdmVcblxuICAjIGdlbmVyYXRlIGEgc3JjIHRoYXQgaXMgdXNlZCBpbiBtYXJrZG93biBmaWxlIGJhc2VkIG9uIHVzZXIgY29uZmlndXJhdGlvbiBvciBmaWxlIGxvY2F0aW9uXG4gIGdlbmVyYXRlSW1hZ2VTcmM6IChmaWxlKSAtPlxuICAgIHV0aWxzLm5vcm1hbGl6ZUZpbGVQYXRoKEBfZ2VuZXJhdGVJbWFnZVNyYyhmaWxlKSlcblxuICBfZ2VuZXJhdGVJbWFnZVNyYzogKGZpbGUpIC0+XG4gICAgcmV0dXJuIFwiXCIgdW5sZXNzIGZpbGVcbiAgICByZXR1cm4gZmlsZSBpZiB1dGlscy5pc1VybChmaWxlKVxuICAgIHJldHVybiBwYXRoLnJlbGF0aXZlKEBjdXJyZW50RmlsZURpcigpLCBmaWxlKSBpZiBjb25maWcuZ2V0KCdyZWxhdGl2ZUltYWdlUGF0aCcpXG4gICAgcmV0dXJuIHBhdGgucmVsYXRpdmUoQHNpdGVMb2NhbERpcigpLCBmaWxlKSBpZiBAaXNJblNpdGVEaXIoZmlsZSlcbiAgICByZXR1cm4gcGF0aC5qb2luKFwiL1wiLCBAc2l0ZUltYWdlc0RpcigpLCBwYXRoLmJhc2VuYW1lKGZpbGUpKVxuXG4gICMgZ2VuZXJhdGUgYSByZWxhdGl2ZSBzcmMgZnJvbSB0aGUgYmFzZSBwYXRoIG9yIGZyb20gdXNlcidzIGhvbWUgZGlyZWN0b3J5XG4gIGdlbmVyYXRlUmVsYXRpdmVJbWFnZVNyYzogKGZpbGUsIGJhc2VQYXRoKSAtPlxuICAgIHV0aWxzLm5vcm1hbGl6ZUZpbGVQYXRoKEBfZ2VuZXJhdGVSZWxhdGl2ZUltYWdlU3JjKGZpbGUsIGJhc2VQYXRoKSlcblxuICBfZ2VuZXJhdGVSZWxhdGl2ZUltYWdlU3JjOiAoZmlsZSwgYmFzZVBhdGgpIC0+XG4gICAgcmV0dXJuIFwiXCIgdW5sZXNzIGZpbGVcbiAgICByZXR1cm4gZmlsZSBpZiB1dGlscy5pc1VybChmaWxlKVxuICAgIHJldHVybiBwYXRoLnJlbGF0aXZlKGJhc2VQYXRoIHx8IFwiflwiLCBmaWxlKVxuIl19
