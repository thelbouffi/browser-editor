import "./code-editor.css";
import './highlight-syntax.css'
import { useRef } from "react";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import codeShift from "jscodeshift"; // understand jsx
import HighLighter from "monaco-jsx-highlighter";

interface codeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<codeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>();

  // handle passed code to editor
  const onEditorDidMount: EditorDidMount = (getEditorValue, monacoeditor) => {
    editorRef.current = monacoeditor;

    monacoeditor.onDidChangeModelContent(() => {
      onChange(getEditorValue());
    });

    // set deafault editor tab size to 2
    monacoeditor.getModel()?.updateOptions({ tabSize: 2 });

    // fix code high lighting in jsx
    const highliter = new HighLighter(
      // @ts-ignore
      window.monaco, // by default when using monaco window object has monaco property but Ts doesn' know that
      codeShift,
      monacoeditor
    );
    highliter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    );
  };

  // prettier formatting
  const onFormatClick = () => {
    // get current value from editor
    const unformatted = editorRef.current.getModel()?.getValue();

    // format the value
    const formatted = prettier
      .format(unformatted, {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, ""); // remove return to new line

    // set the formatted value back to the editor
    editorRef.current.setValue(formatted);
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        theme="dark"
        language="javascript"
        height="300px"
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
