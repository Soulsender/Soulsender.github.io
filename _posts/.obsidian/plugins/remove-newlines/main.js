/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => RemoveNewline
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  fixWhitespace: true,
  fixHyphenation: true
};
var RemoveNewline = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.removeNewlines = (text) => {
      if (this.settings.fixHyphenation) {
        text = text.replace(/-(\r\n|\r|\n)/g, "");
      }
      text = text.replace(/(\r\n|\r|\n)/g, " ");
      if (this.settings.fixWhitespace) {
        text = text.replace(/\s{2,}/g, " ");
      }
      return text;
    };
    this.removeBlankLines = (text) => {
      text = text.replace(/(\r\n|\r|\n){2,}/g, "\r\n");
      return text;
    };
    this.removeNewlinesFromSelection = (editor) => {
      let selection = editor.getSelection();
      selection = this.removeNewlines(selection);
      editor.replaceSelection(selection);
    };
    this.pasteWithoutNewlines = async (editor) => {
      let selection = await navigator.clipboard.readText();
      selection = this.removeNewlines(selection);
      editor.replaceSelection(selection);
    };
    this.removeBlankLinesFromSelection = (editor) => {
      let selection = editor.getSelection();
      selection = this.removeBlankLines(selection);
      editor.replaceSelection(selection);
    };
    this.pasteWithoutBlankLines = async (editor) => {
      let selection = await navigator.clipboard.readText();
      selection = this.removeBlankLines(selection);
      editor.replaceSelection(selection);
    };
  }
  async onload() {
    await this.loadSettings();
    this.addCommand({
      id: "remove-newlines-from-selection",
      name: "Remove newlines from selection",
      editorCheckCallback: (checking, editor, ctx) => {
        if (editor.somethingSelected()) {
          if (!checking) {
            if (typeof this.removeNewlinesFromSelection !== "function") {
              console.error("removeNewlinesFromSelection is not defined or not a function.");
              return false;
            }
            this.removeNewlinesFromSelection(editor);
          }
          return true;
        }
        return false;
      }
    });
    this.addCommand({
      id: "paste-without-newlines",
      name: "Paste without newlines",
      editorCallback: (editor) => {
        if (typeof this.pasteWithoutNewlines !== "function") {
          console.error("pasteWithoutNewlines is not defined or not a function.");
          return;
        }
        void this.pasteWithoutNewlines(editor);
      }
    });
    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor, view) => {
        menu.addItem((item) => {
          item.setTitle("Remove newlines from selection").setIcon("square-bottom-dashed-scissors").setDisabled(!editor.somethingSelected()).onClick(() => {
            this.removeNewlinesFromSelection(editor);
          });
        });
      })
    );
    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor, view) => {
        menu.addItem((item) => {
          item.setTitle("Paste without newlines").setIcon("clipboard-paste").onClick(() => {
            void this.pasteWithoutNewlines(editor);
          });
        });
      })
    );
    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor, view) => {
        menu.addItem((item) => {
          item.setTitle("Remove blank lines from selection").setIcon("square-bottom-dashed-scissors").setDisabled(!editor.somethingSelected()).onClick(() => this.removeBlankLinesFromSelection(editor));
        });
      })
    );
    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor, view) => {
        menu.addItem((item) => {
          item.setTitle("Paste without blank lines").setIcon("clipboard-paste").onClick(() => {
            void this.pasteWithoutBlankLines(editor);
          });
        });
      })
    );
    this.addCommand({
      id: "paste-without-blank-lines",
      name: "Paste without blank lines",
      editorCallback: (editor) => {
        void this.pasteWithoutBlankLines(editor);
      }
    });
    this.addCommand({
      id: "remove-blank-lines-from-selection",
      name: "Remove blank lines from selection",
      editorCheckCallback: (checking, editor, ctx) => {
        if (editor.somethingSelected()) {
          if (!checking) {
            this.removeBlankLinesFromSelection(editor);
          }
          return true;
        }
        return false;
      }
    });
    this.addSettingTab(new RemoveNewlineSettingsTab(this.app, this));
  }
  onunload() {
  }
  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData()
    );
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
var RemoveNewlineSettingsTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Fix whitespace when removing newlines").setDesc(
      "Remove two or more whitespace characters in a row from the selection after removing the newlines. (Recommended)"
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.fixWhitespace).onChange(async (value) => {
        this.plugin.settings.fixWhitespace = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Fix hyphenation when removing newlines").setDesc(
      "If on, removes hyphens from the end of a line and also does not put a space where the newline was."
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.fixHyphenation).onChange(async (value) => {
        this.plugin.settings.fixHyphenation = value;
        await this.plugin.saveSettings();
      })
    );
  }
};


/* nosourcemap */