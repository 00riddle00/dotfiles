(function() {
  var InsertLinkView;

  InsertLinkView = require("../../lib/views/insert-link-view");

  describe("InsertLinkView", function() {
    var editor, insertLinkView, ref;
    ref = [], editor = ref[0], insertLinkView = ref[1];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
      return runs(function() {
        insertLinkView = new InsertLinkView({});
        return editor = atom.workspace.getActiveTextEditor();
      });
    });
    describe(".insertLink", function() {
      it("insert inline link", function() {
        var link;
        insertLinkView.editor = {
          setTextInBufferRange: function() {
            return {};
          }
        };
        spyOn(insertLinkView.editor, "setTextInBufferRange");
        link = {
          text: "text",
          url: "http://"
        };
        insertLinkView.insertLink(link);
        return expect(insertLinkView.editor.setTextInBufferRange).toHaveBeenCalledWith(void 0, "[text](http://)");
      });
      it("insert reference link", function() {
        var link;
        spyOn(insertLinkView, "insertReferenceLink");
        link = {
          text: "text",
          title: "this is title",
          url: "http://"
        };
        insertLinkView.insertLink(link);
        return expect(insertLinkView.insertReferenceLink).toHaveBeenCalledWith(link);
      });
      return it("update reference link", function() {
        var link;
        insertLinkView.definitionRange = {};
        spyOn(insertLinkView, "updateReferenceLink");
        link = {
          text: "text",
          title: "this is title",
          url: "http://"
        };
        insertLinkView.insertLink(link);
        return expect(insertLinkView.updateReferenceLink).toHaveBeenCalledWith(link);
      });
    });
    describe(".updateReferenceLink", function() {
      beforeEach(function() {
        return atom.config.set("markdown-writer.referenceIndentLength", 2);
      });
      it("update reference and definition", function() {
        var link;
        insertLinkView.referenceId = "ABC123";
        insertLinkView.range = "Range";
        insertLinkView.definitionRange = "DRange";
        insertLinkView.editor = {
          setTextInBufferRange: function() {
            return {};
          }
        };
        spyOn(insertLinkView.editor, "setTextInBufferRange");
        link = {
          text: "text",
          title: "this is title",
          url: "http://"
        };
        insertLinkView.updateReferenceLink(link);
        expect(insertLinkView.editor.setTextInBufferRange.calls.length).toEqual(2);
        expect(insertLinkView.editor.setTextInBufferRange.calls[0].args).toEqual(["Range", "[text][ABC123]"]);
        return expect(insertLinkView.editor.setTextInBufferRange.calls[1].args).toEqual(["DRange", '  [ABC123]: http:// "this is title"']);
      });
      return it("update reference only if definition template is empty", function() {
        var link;
        atom.config.set("markdown-writer.referenceDefinitionTag", "");
        insertLinkView.referenceId = "ABC123";
        insertLinkView.range = "Range";
        insertLinkView.definitionRange = "DRange";
        insertLinkView.replaceReferenceLink = {};
        spyOn(insertLinkView, "replaceReferenceLink");
        link = {
          text: "text",
          title: "this is title",
          url: "http://"
        };
        insertLinkView.updateReferenceLink(link);
        return expect(insertLinkView.replaceReferenceLink).toHaveBeenCalledWith("[text][ABC123]");
      });
    });
    describe(".setLink", function() {
      return it("sets all the editors", function() {
        var link;
        link = {
          text: "text",
          title: "this is title",
          url: "http://"
        };
        insertLinkView.setLink(link);
        expect(insertLinkView.textEditor.getText()).toBe(link.text);
        expect(insertLinkView.titleEditor.getText()).toBe(link.title);
        return expect(insertLinkView.urlEditor.getText()).toBe(link.url);
      });
    });
    describe(".getSavedLink", function() {
      beforeEach(function() {
        return insertLinkView.links = {
          "oldstyle": {
            "title": "this is title",
            "url": "http://"
          },
          "newstyle": {
            "text": "NewStyle",
            "title": "this is title",
            "url": "http://"
          }
        };
      });
      it("return undefined if text does not exists", function() {
        return expect(insertLinkView.getSavedLink("notExists")).toEqual(void 0);
      });
      return it("return the link with text, title, url", function() {
        expect(insertLinkView.getSavedLink("oldStyle")).toEqual({
          "text": "oldStyle",
          "title": "this is title",
          "url": "http://"
        });
        return expect(insertLinkView.getSavedLink("newStyle")).toEqual({
          "text": "NewStyle",
          "title": "this is title",
          "url": "http://"
        });
      });
    });
    describe(".isInSavedLink", function() {
      beforeEach(function() {
        return insertLinkView.links = {
          "oldstyle": {
            "title": "this is title",
            "url": "http://"
          },
          "newstyle": {
            "text": "NewStyle",
            "title": "this is title",
            "url": "http://"
          }
        };
      });
      it("return false if the text does not exists", function() {
        return expect(insertLinkView.isInSavedLink({
          text: "notExists"
        })).toBe(false);
      });
      it("return false if the url does not match", function() {
        var link;
        link = {
          text: "oldStyle",
          title: "this is title",
          url: "anything"
        };
        return expect(insertLinkView.isInSavedLink(link)).toBe(false);
      });
      return it("return true", function() {
        var link;
        link = {
          text: "NewStyle",
          title: "this is title",
          url: "http://"
        };
        return expect(insertLinkView.isInSavedLink(link)).toBe(true);
      });
    });
    describe(".updateToLinks", function() {
      beforeEach(function() {
        return insertLinkView.links = {
          "oldstyle": {
            "title": "this is title",
            "url": "http://"
          },
          "newstyle": {
            "text": "NewStyle",
            "title": "this is title",
            "url": "http://"
          }
        };
      });
      it("saves the new link if it does not exists before and checkbox checked", function() {
        var link;
        insertLinkView.saveCheckbox.prop("checked", true);
        link = {
          text: "New Link",
          title: "this is title",
          url: "http://new.link"
        };
        expect(insertLinkView.updateToLinks(link)).toBe(true);
        return expect(insertLinkView.links["new link"]).toEqual(link);
      });
      it("does not save the new link if checkbox is unchecked", function() {
        var link;
        insertLinkView.saveCheckbox.prop("checked", false);
        link = {
          text: "New Link",
          title: "this is title",
          url: "http://new.link"
        };
        return expect(insertLinkView.updateToLinks(link)).toBe(false);
      });
      it("saves the link if it is modified and checkbox checked", function() {
        var link;
        insertLinkView.saveCheckbox.prop("checked", true);
        link = {
          text: "NewStyle",
          title: "this is new title",
          url: "http://"
        };
        expect(insertLinkView.updateToLinks(link)).toBe(true);
        return expect(insertLinkView.links["newstyle"]).toEqual(link);
      });
      it("does not saves the link if it is not modified and checkbox checked", function() {
        var link;
        insertLinkView.saveCheckbox.prop("checked", true);
        link = {
          text: "NewStyle",
          title: "this is title",
          url: "http://"
        };
        return expect(insertLinkView.updateToLinks(link)).toBe(false);
      });
      return it("removes the existed link if checkbox is unchecked", function() {
        var link;
        insertLinkView.saveCheckbox.prop("checked", false);
        link = {
          text: "NewStyle",
          title: "this is title",
          url: "http://"
        };
        expect(insertLinkView.updateToLinks(link)).toBe(true);
        return expect(insertLinkView.links["newstyle"]).toBe(void 0);
      });
    });
    return describe("integration", function() {
      beforeEach(function() {
        atom.config.set("markdown-writer.referenceIndentLength", 2);
        insertLinkView.fetchPosts = function() {
          return {};
        };
        insertLinkView.loadSavedLinks = function(cb) {
          return cb();
        };
        return insertLinkView._referenceLink = function(link) {
          link['indent'] = "  ";
          link['title'] = /^[-\*\!]$/.test(link.title) ? "" : link.title;
          link['label'] = insertLinkView.referenceId || 'GENERATED';
          return link;
        };
      });
      it("insert new link", function() {
        insertLinkView.display();
        insertLinkView.textEditor.setText("text");
        insertLinkView.urlEditor.setText("url");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("[text](url)");
      });
      it("insert new link with text", function() {
        editor.setText("text");
        insertLinkView.display();
        insertLinkView.urlEditor.setText("url");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("[text](url)");
      });
      it("insert new reference link", function() {
        insertLinkView.display();
        insertLinkView.textEditor.setText("text");
        insertLinkView.titleEditor.setText("title");
        insertLinkView.urlEditor.setText("url");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("[text][GENERATED]\n\n  [GENERATED]: url \"title\"");
      });
      it("insert new reference link with text", function() {
        editor.setText("text");
        insertLinkView.display();
        insertLinkView.titleEditor.setText("*");
        insertLinkView.urlEditor.setText("url");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("[text][GENERATED]\n\n  [GENERATED]: url \"\"");
      });
      it("insert reference link without definition", function() {
        atom.config.set("markdown-writer.referenceInlineTag", "<a title='{title}' href='{url}' target='_blank'>{text}</a>");
        atom.config.set("markdown-writer.referenceDefinitionTag", "");
        insertLinkView.display();
        insertLinkView.textEditor.setText("text");
        insertLinkView.titleEditor.setText("title");
        insertLinkView.urlEditor.setText("url");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("<a title='title' href='url' target='_blank'>text</a>");
      });
      it("update inline link", function() {
        editor.setText("[text](url)");
        editor.selectAll();
        insertLinkView.display();
        expect(insertLinkView.textEditor.getText()).toEqual("text");
        expect(insertLinkView.urlEditor.getText()).toEqual("url");
        insertLinkView.textEditor.setText("new text");
        insertLinkView.urlEditor.setText("new url");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("[new text](new url)");
      });
      it("update inline link to reference link", function() {
        editor.setText("[text](url)");
        editor.setCursorBufferPosition([0, 0]);
        editor.selectToEndOfLine();
        insertLinkView.display();
        expect(insertLinkView.textEditor.getText()).toEqual("text");
        expect(insertLinkView.urlEditor.getText()).toEqual("url");
        insertLinkView.textEditor.setText("new text");
        insertLinkView.titleEditor.setText("title");
        insertLinkView.urlEditor.setText("new url");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("[new text][GENERATED]\n\n  [GENERATED]: new url \"title\"");
      });
      it("update reference link to inline link", function() {
        editor.setText("[text][ABC123]\n\n[ABC123]: url \"title\"");
        editor.setCursorBufferPosition([0, 0]);
        editor.selectToEndOfLine();
        insertLinkView.display();
        expect(insertLinkView.textEditor.getText()).toEqual("text");
        expect(insertLinkView.titleEditor.getText()).toEqual("title");
        expect(insertLinkView.urlEditor.getText()).toEqual("url");
        insertLinkView.textEditor.setText("new text");
        insertLinkView.titleEditor.setText("");
        insertLinkView.urlEditor.setText("new url");
        insertLinkView.onConfirm();
        return expect(editor.getText().trim()).toBe("[new text](new url)");
      });
      it("update reference link to config reference link", function() {
        atom.config.set("markdown-writer.referenceInlineTag", "<a title='{title}' href='{url}' target='_blank'>{text}</a>");
        atom.config.set("markdown-writer.referenceDefinitionTag", "");
        editor.setText("[text][ABC123]\n\n[ABC123]: url \"title\"");
        editor.setCursorBufferPosition([0, 0]);
        editor.selectToEndOfLine();
        insertLinkView.display();
        expect(insertLinkView.textEditor.getText()).toEqual("text");
        expect(insertLinkView.titleEditor.getText()).toEqual("title");
        expect(insertLinkView.urlEditor.getText()).toEqual("url");
        insertLinkView.textEditor.setText("new text");
        insertLinkView.titleEditor.setText("new title");
        insertLinkView.urlEditor.setText("new url");
        insertLinkView.onConfirm();
        return expect(editor.getText().trim()).toBe("<a title='new title' href='new url' target='_blank'>new text</a>");
      });
      it("remove inline link", function() {
        editor.setText("[text](url)");
        editor.setCursorBufferPosition([0, 0]);
        editor.selectToEndOfLine();
        insertLinkView.display();
        expect(insertLinkView.textEditor.getText()).toEqual("text");
        expect(insertLinkView.urlEditor.getText()).toEqual("url");
        insertLinkView.urlEditor.setText("");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("text");
      });
      return it("remove reference link", function() {
        editor.setText("[text][ABC123]\n\n[ABC123]: url \"title\"");
        editor.setCursorBufferPosition([0, 0]);
        editor.selectToEndOfLine();
        insertLinkView.display();
        expect(insertLinkView.textEditor.getText()).toEqual("text");
        expect(insertLinkView.titleEditor.getText()).toEqual("title");
        expect(insertLinkView.urlEditor.getText()).toEqual("url");
        insertLinkView.urlEditor.setText("");
        insertLinkView.onConfirm();
        return expect(editor.getText().trim()).toBe("text");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9zcGVjL3ZpZXdzL2luc2VydC1saW5rLXZpZXctc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLGtDQUFSOztFQUVqQixRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQTtBQUN6QixRQUFBO0lBQUEsTUFBMkIsRUFBM0IsRUFBQyxlQUFELEVBQVM7SUFFVCxVQUFBLENBQVcsU0FBQTtNQUNULGVBQUEsQ0FBZ0IsU0FBQTtlQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixnQkFBcEI7TUFBSCxDQUFoQjthQUNBLElBQUEsQ0FBSyxTQUFBO1FBQ0gsY0FBQSxHQUFxQixJQUFBLGNBQUEsQ0FBZSxFQUFmO2VBQ3JCLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFGTixDQUFMO0lBRlMsQ0FBWDtJQU1BLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUE7TUFDdEIsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUE7QUFDdkIsWUFBQTtRQUFBLGNBQWMsQ0FBQyxNQUFmLEdBQXdCO1VBQUUsb0JBQUEsRUFBc0IsU0FBQTttQkFBRztVQUFILENBQXhCOztRQUN4QixLQUFBLENBQU0sY0FBYyxDQUFDLE1BQXJCLEVBQTZCLHNCQUE3QjtRQUVBLElBQUEsR0FBTztVQUFBLElBQUEsRUFBTSxNQUFOO1VBQWMsR0FBQSxFQUFLLFNBQW5COztRQUNQLGNBQWMsQ0FBQyxVQUFmLENBQTBCLElBQTFCO2VBRUEsTUFBQSxDQUFPLGNBQWMsQ0FBQyxNQUFNLENBQUMsb0JBQTdCLENBQWtELENBQUMsb0JBQW5ELENBQXdFLE1BQXhFLEVBQW1GLGlCQUFuRjtNQVB1QixDQUF6QjtNQVNBLEVBQUEsQ0FBRyx1QkFBSCxFQUE0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QU8sY0FBYyxDQUFDLFNBQVMsQ0FBQyxPQUF6QixDQUFBLENBQVAsQ0FBMEMsQ0FBQyxPQUEzQyxDQUFtRCxLQUFuRDtRQUVBLGNBQWMsQ0FBQyxTQUFTLENBQUMsT0FBekIsQ0FBaUMsRUFBakM7UUFDQSxjQUFjLENBQUMsU0FBZixDQUFBO2VBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxJQUFqQixDQUFBLENBQVAsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxNQUFyQztNQWpCMEIsQ0FBNUI7SUFyS3NCLENBQXhCO0VBMUp5QixDQUEzQjtBQUZBIiwic291cmNlc0NvbnRlbnQiOlsiSW5zZXJ0TGlua1ZpZXcgPSByZXF1aXJlIFwiLi4vLi4vbGliL3ZpZXdzL2luc2VydC1saW5rLXZpZXdcIlxuXG5kZXNjcmliZSBcIkluc2VydExpbmtWaWV3XCIsIC0+XG4gIFtlZGl0b3IsIGluc2VydExpbmtWaWV3XSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKFwiZW1wdHkubWFya2Rvd25cIilcbiAgICBydW5zIC0+XG4gICAgICBpbnNlcnRMaW5rVmlldyA9IG5ldyBJbnNlcnRMaW5rVmlldyh7fSlcbiAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gIGRlc2NyaWJlIFwiLmluc2VydExpbmtcIiwgLT5cbiAgICBpdCBcImluc2VydCBpbmxpbmUgbGlua1wiLCAtPlxuICAgICAgaW5zZXJ0TGlua1ZpZXcuZWRpdG9yID0geyBzZXRUZXh0SW5CdWZmZXJSYW5nZTogLT4ge30gfVxuICAgICAgc3B5T24oaW5zZXJ0TGlua1ZpZXcuZWRpdG9yLCBcInNldFRleHRJbkJ1ZmZlclJhbmdlXCIpXG5cbiAgICAgIGxpbmsgPSB0ZXh0OiBcInRleHRcIiwgdXJsOiBcImh0dHA6Ly9cIlxuICAgICAgaW5zZXJ0TGlua1ZpZXcuaW5zZXJ0TGluayhsaW5rKVxuXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcuZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh1bmRlZmluZWQsIFwiW3RleHRdKGh0dHA6Ly8pXCIpXG5cbiAgICBpdCBcImluc2VydCByZWZlcmVuY2UgbGlua1wiLCAtPlxuICAgICAgc3B5T24oaW5zZXJ0TGlua1ZpZXcsIFwiaW5zZXJ0UmVmZXJlbmNlTGlua1wiKVxuXG4gICAgICBsaW5rID0gdGV4dDogXCJ0ZXh0XCIsIHRpdGxlOiBcInRoaXMgaXMgdGl0bGVcIiwgdXJsOiBcImh0dHA6Ly9cIlxuICAgICAgaW5zZXJ0TGlua1ZpZXcuaW5zZXJ0TGluayhsaW5rKVxuXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcuaW5zZXJ0UmVmZXJlbmNlTGluaykudG9IYXZlQmVlbkNhbGxlZFdpdGgobGluaylcblxuICAgIGl0IFwidXBkYXRlIHJlZmVyZW5jZSBsaW5rXCIsIC0+XG4gICAgICBpbnNlcnRMaW5rVmlldy5kZWZpbml0aW9uUmFuZ2UgPSB7fVxuICAgICAgc3B5T24oaW5zZXJ0TGlua1ZpZXcsIFwidXBkYXRlUmVmZXJlbmNlTGlua1wiKVxuXG4gICAgICBsaW5rID0gdGV4dDogXCJ0ZXh0XCIsIHRpdGxlOiBcInRoaXMgaXMgdGl0bGVcIiwgdXJsOiBcImh0dHA6Ly9cIlxuICAgICAgaW5zZXJ0TGlua1ZpZXcuaW5zZXJ0TGluayhsaW5rKVxuXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcudXBkYXRlUmVmZXJlbmNlTGluaykudG9IYXZlQmVlbkNhbGxlZFdpdGgobGluaylcblxuICBkZXNjcmliZSBcIi51cGRhdGVSZWZlcmVuY2VMaW5rXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0KFwibWFya2Rvd24td3JpdGVyLnJlZmVyZW5jZUluZGVudExlbmd0aFwiLCAyKVxuXG4gICAgaXQgXCJ1cGRhdGUgcmVmZXJlbmNlIGFuZCBkZWZpbml0aW9uXCIsIC0+XG4gICAgICBpbnNlcnRMaW5rVmlldy5yZWZlcmVuY2VJZCA9IFwiQUJDMTIzXCJcbiAgICAgIGluc2VydExpbmtWaWV3LnJhbmdlID0gXCJSYW5nZVwiXG4gICAgICBpbnNlcnRMaW5rVmlldy5kZWZpbml0aW9uUmFuZ2UgPSBcIkRSYW5nZVwiXG5cbiAgICAgIGluc2VydExpbmtWaWV3LmVkaXRvciA9IHsgc2V0VGV4dEluQnVmZmVyUmFuZ2U6IC0+IHt9IH1cbiAgICAgIHNweU9uKGluc2VydExpbmtWaWV3LmVkaXRvciwgXCJzZXRUZXh0SW5CdWZmZXJSYW5nZVwiKVxuXG4gICAgICBsaW5rID0gdGV4dDogXCJ0ZXh0XCIsIHRpdGxlOiBcInRoaXMgaXMgdGl0bGVcIiwgdXJsOiBcImh0dHA6Ly9cIlxuICAgICAgaW5zZXJ0TGlua1ZpZXcudXBkYXRlUmVmZXJlbmNlTGluayhsaW5rKVxuXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcuZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlLmNhbGxzLmxlbmd0aCkudG9FcXVhbCgyKVxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LmVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZS5jYWxsc1swXS5hcmdzKS50b0VxdWFsKFxuICAgICAgICBbXCJSYW5nZVwiLCBcIlt0ZXh0XVtBQkMxMjNdXCJdKVxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LmVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZS5jYWxsc1sxXS5hcmdzKS50b0VxdWFsKFxuICAgICAgICBbXCJEUmFuZ2VcIiwgJyAgW0FCQzEyM106IGh0dHA6Ly8gXCJ0aGlzIGlzIHRpdGxlXCInXSlcblxuICAgIGl0IFwidXBkYXRlIHJlZmVyZW5jZSBvbmx5IGlmIGRlZmluaXRpb24gdGVtcGxhdGUgaXMgZW1wdHlcIiwgLT5cbiAgICAgIGF0b20uY29uZmlnLnNldChcIm1hcmtkb3duLXdyaXRlci5yZWZlcmVuY2VEZWZpbml0aW9uVGFnXCIsIFwiXCIpXG5cbiAgICAgIGluc2VydExpbmtWaWV3LnJlZmVyZW5jZUlkID0gXCJBQkMxMjNcIlxuICAgICAgaW5zZXJ0TGlua1ZpZXcucmFuZ2UgPSBcIlJhbmdlXCJcbiAgICAgIGluc2VydExpbmtWaWV3LmRlZmluaXRpb25SYW5nZSA9IFwiRFJhbmdlXCJcblxuICAgICAgaW5zZXJ0TGlua1ZpZXcucmVwbGFjZVJlZmVyZW5jZUxpbmsgPSB7fVxuICAgICAgc3B5T24oaW5zZXJ0TGlua1ZpZXcsIFwicmVwbGFjZVJlZmVyZW5jZUxpbmtcIilcblxuICAgICAgbGluayA9IHRleHQ6IFwidGV4dFwiLCB0aXRsZTogXCJ0aGlzIGlzIHRpdGxlXCIsIHVybDogXCJodHRwOi8vXCJcbiAgICAgIGluc2VydExpbmtWaWV3LnVwZGF0ZVJlZmVyZW5jZUxpbmsobGluaylcblxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LnJlcGxhY2VSZWZlcmVuY2VMaW5rKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcIlt0ZXh0XVtBQkMxMjNdXCIpXG5cbiAgZGVzY3JpYmUgXCIuc2V0TGlua1wiLCAtPlxuICAgIGl0IFwic2V0cyBhbGwgdGhlIGVkaXRvcnNcIiwgLT5cbiAgICAgIGxpbmsgPSB0ZXh0OiBcInRleHRcIiwgdGl0bGU6IFwidGhpcyBpcyB0aXRsZVwiLCB1cmw6IFwiaHR0cDovL1wiXG5cbiAgICAgIGluc2VydExpbmtWaWV3LnNldExpbmsobGluaylcblxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LnRleHRFZGl0b3IuZ2V0VGV4dCgpKS50b0JlKGxpbmsudGV4dClcbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy50aXRsZUVkaXRvci5nZXRUZXh0KCkpLnRvQmUobGluay50aXRsZSlcbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy51cmxFZGl0b3IuZ2V0VGV4dCgpKS50b0JlKGxpbmsudXJsKVxuXG4gIGRlc2NyaWJlIFwiLmdldFNhdmVkTGlua1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGluc2VydExpbmtWaWV3LmxpbmtzID1cbiAgICAgICAgXCJvbGRzdHlsZVwiOiB7XCJ0aXRsZVwiOiBcInRoaXMgaXMgdGl0bGVcIiwgXCJ1cmxcIjogXCJodHRwOi8vXCJ9XG4gICAgICAgIFwibmV3c3R5bGVcIjoge1widGV4dFwiOiBcIk5ld1N0eWxlXCIsIFwidGl0bGVcIjogXCJ0aGlzIGlzIHRpdGxlXCIsIFwidXJsXCI6IFwiaHR0cDovL1wifVxuXG4gICAgaXQgXCJyZXR1cm4gdW5kZWZpbmVkIGlmIHRleHQgZG9lcyBub3QgZXhpc3RzXCIsIC0+XG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcuZ2V0U2F2ZWRMaW5rKFwibm90RXhpc3RzXCIpKS50b0VxdWFsKHVuZGVmaW5lZClcblxuICAgIGl0IFwicmV0dXJuIHRoZSBsaW5rIHdpdGggdGV4dCwgdGl0bGUsIHVybFwiLCAtPlxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LmdldFNhdmVkTGluayhcIm9sZFN0eWxlXCIpKS50b0VxdWFsKHtcbiAgICAgICAgXCJ0ZXh0XCI6IFwib2xkU3R5bGVcIiwgXCJ0aXRsZVwiOiBcInRoaXMgaXMgdGl0bGVcIiwgXCJ1cmxcIjogXCJodHRwOi8vXCJ9KVxuXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcuZ2V0U2F2ZWRMaW5rKFwibmV3U3R5bGVcIikpLnRvRXF1YWwoe1xuICAgICAgICBcInRleHRcIjogXCJOZXdTdHlsZVwiLCBcInRpdGxlXCI6IFwidGhpcyBpcyB0aXRsZVwiLCBcInVybFwiOiBcImh0dHA6Ly9cIn0pXG5cbiAgZGVzY3JpYmUgXCIuaXNJblNhdmVkTGlua1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGluc2VydExpbmtWaWV3LmxpbmtzID1cbiAgICAgICAgXCJvbGRzdHlsZVwiOiB7XCJ0aXRsZVwiOiBcInRoaXMgaXMgdGl0bGVcIiwgXCJ1cmxcIjogXCJodHRwOi8vXCJ9XG4gICAgICAgIFwibmV3c3R5bGVcIjoge1widGV4dFwiOiBcIk5ld1N0eWxlXCIsIFwidGl0bGVcIjogXCJ0aGlzIGlzIHRpdGxlXCIsIFwidXJsXCI6IFwiaHR0cDovL1wifVxuXG4gICAgaXQgXCJyZXR1cm4gZmFsc2UgaWYgdGhlIHRleHQgZG9lcyBub3QgZXhpc3RzXCIsIC0+XG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcuaXNJblNhdmVkTGluayh0ZXh0OiBcIm5vdEV4aXN0c1wiKSkudG9CZShmYWxzZSlcblxuICAgIGl0IFwicmV0dXJuIGZhbHNlIGlmIHRoZSB1cmwgZG9lcyBub3QgbWF0Y2hcIiwgLT5cbiAgICAgIGxpbmsgPSB0ZXh0OiBcIm9sZFN0eWxlXCIsIHRpdGxlOiBcInRoaXMgaXMgdGl0bGVcIiwgdXJsOiBcImFueXRoaW5nXCJcbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy5pc0luU2F2ZWRMaW5rKGxpbmspKS50b0JlKGZhbHNlKVxuXG4gICAgaXQgXCJyZXR1cm4gdHJ1ZVwiLCAtPlxuICAgICAgbGluayA9IHRleHQ6IFwiTmV3U3R5bGVcIiwgdGl0bGU6IFwidGhpcyBpcyB0aXRsZVwiLCB1cmw6IFwiaHR0cDovL1wiXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcuaXNJblNhdmVkTGluayhsaW5rKSkudG9CZSh0cnVlKVxuXG4gIGRlc2NyaWJlIFwiLnVwZGF0ZVRvTGlua3NcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBpbnNlcnRMaW5rVmlldy5saW5rcyA9XG4gICAgICAgIFwib2xkc3R5bGVcIjoge1widGl0bGVcIjogXCJ0aGlzIGlzIHRpdGxlXCIsIFwidXJsXCI6IFwiaHR0cDovL1wifVxuICAgICAgICBcIm5ld3N0eWxlXCI6IHtcInRleHRcIjogXCJOZXdTdHlsZVwiLCBcInRpdGxlXCI6IFwidGhpcyBpcyB0aXRsZVwiLCBcInVybFwiOiBcImh0dHA6Ly9cIn1cblxuICAgIGl0IFwic2F2ZXMgdGhlIG5ldyBsaW5rIGlmIGl0IGRvZXMgbm90IGV4aXN0cyBiZWZvcmUgYW5kIGNoZWNrYm94IGNoZWNrZWRcIiwgLT5cbiAgICAgIGluc2VydExpbmtWaWV3LnNhdmVDaGVja2JveC5wcm9wKFwiY2hlY2tlZFwiLCB0cnVlKVxuXG4gICAgICBsaW5rID0gdGV4dDogXCJOZXcgTGlua1wiLCB0aXRsZTogXCJ0aGlzIGlzIHRpdGxlXCIsIHVybDogXCJodHRwOi8vbmV3LmxpbmtcIlxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LnVwZGF0ZVRvTGlua3MobGluaykpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy5saW5rc1tcIm5ldyBsaW5rXCJdKS50b0VxdWFsKGxpbmspXG5cbiAgICBpdCBcImRvZXMgbm90IHNhdmUgdGhlIG5ldyBsaW5rIGlmIGNoZWNrYm94IGlzIHVuY2hlY2tlZFwiLCAtPlxuICAgICAgaW5zZXJ0TGlua1ZpZXcuc2F2ZUNoZWNrYm94LnByb3AoXCJjaGVja2VkXCIsIGZhbHNlKVxuXG4gICAgICBsaW5rID0gdGV4dDogXCJOZXcgTGlua1wiLCB0aXRsZTogXCJ0aGlzIGlzIHRpdGxlXCIsIHVybDogXCJodHRwOi8vbmV3LmxpbmtcIlxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LnVwZGF0ZVRvTGlua3MobGluaykpLnRvQmUoZmFsc2UpXG5cbiAgICBpdCBcInNhdmVzIHRoZSBsaW5rIGlmIGl0IGlzIG1vZGlmaWVkIGFuZCBjaGVja2JveCBjaGVja2VkXCIsIC0+XG4gICAgICBpbnNlcnRMaW5rVmlldy5zYXZlQ2hlY2tib3gucHJvcChcImNoZWNrZWRcIiwgdHJ1ZSlcblxuICAgICAgbGluayA9IHRleHQ6IFwiTmV3U3R5bGVcIiwgdGl0bGU6IFwidGhpcyBpcyBuZXcgdGl0bGVcIiwgdXJsOiBcImh0dHA6Ly9cIlxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LnVwZGF0ZVRvTGlua3MobGluaykpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy5saW5rc1tcIm5ld3N0eWxlXCJdKS50b0VxdWFsKGxpbmspXG5cbiAgICBpdCBcImRvZXMgbm90IHNhdmVzIHRoZSBsaW5rIGlmIGl0IGlzIG5vdCBtb2RpZmllZCBhbmQgY2hlY2tib3ggY2hlY2tlZFwiLCAtPlxuICAgICAgaW5zZXJ0TGlua1ZpZXcuc2F2ZUNoZWNrYm94LnByb3AoXCJjaGVja2VkXCIsIHRydWUpXG5cbiAgICAgIGxpbmsgPSB0ZXh0OiBcIk5ld1N0eWxlXCIsIHRpdGxlOiBcInRoaXMgaXMgdGl0bGVcIiwgdXJsOiBcImh0dHA6Ly9cIlxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LnVwZGF0ZVRvTGlua3MobGluaykpLnRvQmUoZmFsc2UpXG5cbiAgICBpdCBcInJlbW92ZXMgdGhlIGV4aXN0ZWQgbGluayBpZiBjaGVja2JveCBpcyB1bmNoZWNrZWRcIiwgLT5cbiAgICAgIGluc2VydExpbmtWaWV3LnNhdmVDaGVja2JveC5wcm9wKFwiY2hlY2tlZFwiLCBmYWxzZSlcblxuICAgICAgbGluayA9IHRleHQ6IFwiTmV3U3R5bGVcIiwgdGl0bGU6IFwidGhpcyBpcyB0aXRsZVwiLCB1cmw6IFwiaHR0cDovL1wiXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcudXBkYXRlVG9MaW5rcyhsaW5rKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LmxpbmtzW1wibmV3c3R5bGVcIl0pLnRvQmUodW5kZWZpbmVkKVxuXG4gIGRlc2NyaWJlIFwiaW50ZWdyYXRpb25cIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJtYXJrZG93bi13cml0ZXIucmVmZXJlbmNlSW5kZW50TGVuZ3RoXCIsIDIpXG5cbiAgICAgICMgc3R1YnNcbiAgICAgIGluc2VydExpbmtWaWV3LmZldGNoUG9zdHMgPSAtPiB7fVxuICAgICAgaW5zZXJ0TGlua1ZpZXcubG9hZFNhdmVkTGlua3MgPSAoY2IpIC0+IGNiKClcbiAgICAgIGluc2VydExpbmtWaWV3Ll9yZWZlcmVuY2VMaW5rID0gKGxpbmspIC0+XG4gICAgICAgIGxpbmtbJ2luZGVudCddID0gXCIgIFwiXG4gICAgICAgIGxpbmtbJ3RpdGxlJ10gPSBpZiAvXlstXFwqXFwhXSQvLnRlc3QobGluay50aXRsZSkgdGhlbiBcIlwiIGVsc2UgbGluay50aXRsZVxuICAgICAgICBsaW5rWydsYWJlbCddID0gaW5zZXJ0TGlua1ZpZXcucmVmZXJlbmNlSWQgfHwgJ0dFTkVSQVRFRCdcbiAgICAgICAgbGlua1xuXG4gICAgaXQgXCJpbnNlcnQgbmV3IGxpbmtcIiwgLT5cbiAgICAgIGluc2VydExpbmtWaWV3LmRpc3BsYXkoKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcudGV4dEVkaXRvci5zZXRUZXh0KFwidGV4dFwiKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcudXJsRWRpdG9yLnNldFRleHQoXCJ1cmxcIilcbiAgICAgIGluc2VydExpbmtWaWV3Lm9uQ29uZmlybSgpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiW3RleHRdKHVybClcIlxuXG4gICAgaXQgXCJpbnNlcnQgbmV3IGxpbmsgd2l0aCB0ZXh0XCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCBcInRleHRcIlxuICAgICAgaW5zZXJ0TGlua1ZpZXcuZGlzcGxheSgpXG4gICAgICBpbnNlcnRMaW5rVmlldy51cmxFZGl0b3Iuc2V0VGV4dChcInVybFwiKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcub25Db25maXJtKClcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJbdGV4dF0odXJsKVwiXG5cbiAgICBpdCBcImluc2VydCBuZXcgcmVmZXJlbmNlIGxpbmtcIiwgLT5cbiAgICAgIGluc2VydExpbmtWaWV3LmRpc3BsYXkoKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcudGV4dEVkaXRvci5zZXRUZXh0KFwidGV4dFwiKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcudGl0bGVFZGl0b3Iuc2V0VGV4dChcInRpdGxlXCIpXG4gICAgICBpbnNlcnRMaW5rVmlldy51cmxFZGl0b3Iuc2V0VGV4dChcInVybFwiKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcub25Db25maXJtKClcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAgIFt0ZXh0XVtHRU5FUkFURURdXG5cbiAgICAgICAgICBbR0VORVJBVEVEXTogdXJsIFwidGl0bGVcIlxuICAgICAgICBcIlwiXCJcblxuICAgIGl0IFwiaW5zZXJ0IG5ldyByZWZlcmVuY2UgbGluayB3aXRoIHRleHRcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0IFwidGV4dFwiXG4gICAgICBpbnNlcnRMaW5rVmlldy5kaXNwbGF5KClcbiAgICAgIGluc2VydExpbmtWaWV3LnRpdGxlRWRpdG9yLnNldFRleHQoXCIqXCIpICMgZm9yY2UgcmVmZXJlbmNlIGxpbmtcbiAgICAgIGluc2VydExpbmtWaWV3LnVybEVkaXRvci5zZXRUZXh0KFwidXJsXCIpXG4gICAgICBpbnNlcnRMaW5rVmlldy5vbkNvbmZpcm0oKVxuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIlwiXCJcbiAgICAgICAgW3RleHRdW0dFTkVSQVRFRF1cblxuICAgICAgICAgIFtHRU5FUkFURURdOiB1cmwgXCJcIlxuICAgICAgICBcIlwiXCJcblxuICAgIGl0IFwiaW5zZXJ0IHJlZmVyZW5jZSBsaW5rIHdpdGhvdXQgZGVmaW5pdGlvblwiLCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0KFwibWFya2Rvd24td3JpdGVyLnJlZmVyZW5jZUlubGluZVRhZ1wiLFxuICAgICAgICBcIjxhIHRpdGxlPSd7dGl0bGV9JyBocmVmPSd7dXJsfScgdGFyZ2V0PSdfYmxhbmsnPnt0ZXh0fTwvYT5cIilcbiAgICAgIGF0b20uY29uZmlnLnNldChcIm1hcmtkb3duLXdyaXRlci5yZWZlcmVuY2VEZWZpbml0aW9uVGFnXCIsIFwiXCIpXG5cbiAgICAgIGluc2VydExpbmtWaWV3LmRpc3BsYXkoKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcudGV4dEVkaXRvci5zZXRUZXh0KFwidGV4dFwiKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcudGl0bGVFZGl0b3Iuc2V0VGV4dChcInRpdGxlXCIpXG4gICAgICBpbnNlcnRMaW5rVmlldy51cmxFZGl0b3Iuc2V0VGV4dChcInVybFwiKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcub25Db25maXJtKClcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAgIDxhIHRpdGxlPSd0aXRsZScgaHJlZj0ndXJsJyB0YXJnZXQ9J19ibGFuayc+dGV4dDwvYT5cbiAgICAgIFwiXCJcIlxuXG4gICAgaXQgXCJ1cGRhdGUgaW5saW5lIGxpbmtcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiW3RleHRdKHVybClcIilcbiAgICAgIGVkaXRvci5zZWxlY3RBbGwoKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcuZGlzcGxheSgpXG5cbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy50ZXh0RWRpdG9yLmdldFRleHQoKSkudG9FcXVhbChcInRleHRcIilcbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy51cmxFZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsKFwidXJsXCIpXG5cbiAgICAgIGluc2VydExpbmtWaWV3LnRleHRFZGl0b3Iuc2V0VGV4dChcIm5ldyB0ZXh0XCIpXG4gICAgICBpbnNlcnRMaW5rVmlldy51cmxFZGl0b3Iuc2V0VGV4dChcIm5ldyB1cmxcIilcbiAgICAgIGluc2VydExpbmtWaWV3Lm9uQ29uZmlybSgpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiW25ldyB0ZXh0XShuZXcgdXJsKVwiXG5cbiAgICBpdCBcInVwZGF0ZSBpbmxpbmUgbGluayB0byByZWZlcmVuY2UgbGlua1wiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCJbdGV4dF0odXJsKVwiKVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcbiAgICAgIGVkaXRvci5zZWxlY3RUb0VuZE9mTGluZSgpXG4gICAgICBpbnNlcnRMaW5rVmlldy5kaXNwbGF5KClcblxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LnRleHRFZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsKFwidGV4dFwiKVxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LnVybEVkaXRvci5nZXRUZXh0KCkpLnRvRXF1YWwoXCJ1cmxcIilcblxuICAgICAgaW5zZXJ0TGlua1ZpZXcudGV4dEVkaXRvci5zZXRUZXh0KFwibmV3IHRleHRcIilcbiAgICAgIGluc2VydExpbmtWaWV3LnRpdGxlRWRpdG9yLnNldFRleHQoXCJ0aXRsZVwiKVxuICAgICAgaW5zZXJ0TGlua1ZpZXcudXJsRWRpdG9yLnNldFRleHQoXCJuZXcgdXJsXCIpXG4gICAgICBpbnNlcnRMaW5rVmlldy5vbkNvbmZpcm0oKVxuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIlwiXCJcbiAgICAgICAgW25ldyB0ZXh0XVtHRU5FUkFURURdXG5cbiAgICAgICAgICBbR0VORVJBVEVEXTogbmV3IHVybCBcInRpdGxlXCJcbiAgICAgICAgXCJcIlwiXG5cbiAgICBpdCBcInVwZGF0ZSByZWZlcmVuY2UgbGluayB0byBpbmxpbmUgbGlua1wiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICBbdGV4dF1bQUJDMTIzXVxuXG4gICAgICBbQUJDMTIzXTogdXJsIFwidGl0bGVcIlxuICAgICAgXCJcIlwiXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuICAgICAgZWRpdG9yLnNlbGVjdFRvRW5kT2ZMaW5lKClcbiAgICAgIGluc2VydExpbmtWaWV3LmRpc3BsYXkoKVxuXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcudGV4dEVkaXRvci5nZXRUZXh0KCkpLnRvRXF1YWwoXCJ0ZXh0XCIpXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcudGl0bGVFZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsKFwidGl0bGVcIilcbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy51cmxFZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsKFwidXJsXCIpXG5cbiAgICAgIGluc2VydExpbmtWaWV3LnRleHRFZGl0b3Iuc2V0VGV4dChcIm5ldyB0ZXh0XCIpXG4gICAgICBpbnNlcnRMaW5rVmlldy50aXRsZUVkaXRvci5zZXRUZXh0KFwiXCIpXG4gICAgICBpbnNlcnRMaW5rVmlldy51cmxFZGl0b3Iuc2V0VGV4dChcIm5ldyB1cmxcIilcbiAgICAgIGluc2VydExpbmtWaWV3Lm9uQ29uZmlybSgpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpLnRyaW0oKSkudG9CZSBcIltuZXcgdGV4dF0obmV3IHVybClcIlxuXG4gICAgaXQgXCJ1cGRhdGUgcmVmZXJlbmNlIGxpbmsgdG8gY29uZmlnIHJlZmVyZW5jZSBsaW5rXCIsIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJtYXJrZG93bi13cml0ZXIucmVmZXJlbmNlSW5saW5lVGFnXCIsXG4gICAgICAgIFwiPGEgdGl0bGU9J3t0aXRsZX0nIGhyZWY9J3t1cmx9JyB0YXJnZXQ9J19ibGFuayc+e3RleHR9PC9hPlwiKVxuICAgICAgYXRvbS5jb25maWcuc2V0KFwibWFya2Rvd24td3JpdGVyLnJlZmVyZW5jZURlZmluaXRpb25UYWdcIiwgXCJcIilcblxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICBbdGV4dF1bQUJDMTIzXVxuXG4gICAgICBbQUJDMTIzXTogdXJsIFwidGl0bGVcIlxuICAgICAgXCJcIlwiXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuICAgICAgZWRpdG9yLnNlbGVjdFRvRW5kT2ZMaW5lKClcbiAgICAgIGluc2VydExpbmtWaWV3LmRpc3BsYXkoKVxuXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcudGV4dEVkaXRvci5nZXRUZXh0KCkpLnRvRXF1YWwoXCJ0ZXh0XCIpXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcudGl0bGVFZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsKFwidGl0bGVcIilcbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy51cmxFZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsKFwidXJsXCIpXG5cbiAgICAgIGluc2VydExpbmtWaWV3LnRleHRFZGl0b3Iuc2V0VGV4dChcIm5ldyB0ZXh0XCIpXG4gICAgICBpbnNlcnRMaW5rVmlldy50aXRsZUVkaXRvci5zZXRUZXh0KFwibmV3IHRpdGxlXCIpXG4gICAgICBpbnNlcnRMaW5rVmlldy51cmxFZGl0b3Iuc2V0VGV4dChcIm5ldyB1cmxcIilcbiAgICAgIGluc2VydExpbmtWaWV3Lm9uQ29uZmlybSgpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpLnRyaW0oKSkudG9CZShcbiAgICAgICAgXCI8YSB0aXRsZT0nbmV3IHRpdGxlJyBocmVmPSduZXcgdXJsJyB0YXJnZXQ9J19ibGFuayc+bmV3IHRleHQ8L2E+XCIpXG5cbiAgICBpdCBcInJlbW92ZSBpbmxpbmUgbGlua1wiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCJbdGV4dF0odXJsKVwiKVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcbiAgICAgIGVkaXRvci5zZWxlY3RUb0VuZE9mTGluZSgpXG4gICAgICBpbnNlcnRMaW5rVmlldy5kaXNwbGF5KClcblxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LnRleHRFZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsKFwidGV4dFwiKVxuICAgICAgZXhwZWN0KGluc2VydExpbmtWaWV3LnVybEVkaXRvci5nZXRUZXh0KCkpLnRvRXF1YWwoXCJ1cmxcIilcblxuICAgICAgaW5zZXJ0TGlua1ZpZXcudXJsRWRpdG9yLnNldFRleHQoXCJcIilcbiAgICAgIGluc2VydExpbmtWaWV3Lm9uQ29uZmlybSgpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwidGV4dFwiXG5cbiAgICBpdCBcInJlbW92ZSByZWZlcmVuY2UgbGlua1wiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICBbdGV4dF1bQUJDMTIzXVxuXG4gICAgICBbQUJDMTIzXTogdXJsIFwidGl0bGVcIlxuICAgICAgXCJcIlwiXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuICAgICAgZWRpdG9yLnNlbGVjdFRvRW5kT2ZMaW5lKClcbiAgICAgIGluc2VydExpbmtWaWV3LmRpc3BsYXkoKVxuXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcudGV4dEVkaXRvci5nZXRUZXh0KCkpLnRvRXF1YWwoXCJ0ZXh0XCIpXG4gICAgICBleHBlY3QoaW5zZXJ0TGlua1ZpZXcudGl0bGVFZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsKFwidGl0bGVcIilcbiAgICAgIGV4cGVjdChpbnNlcnRMaW5rVmlldy51cmxFZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsKFwidXJsXCIpXG5cbiAgICAgIGluc2VydExpbmtWaWV3LnVybEVkaXRvci5zZXRUZXh0KFwiXCIpXG4gICAgICBpbnNlcnRMaW5rVmlldy5vbkNvbmZpcm0oKVxuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKS50cmltKCkpLnRvQmUgXCJ0ZXh0XCJcbiJdfQ==
