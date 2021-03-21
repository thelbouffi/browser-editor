import { useRef } from "react";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";

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
    monacoeditor.getModel()?.updateOptions({ tabSize: 2 });
  };

  // prettier formatting
  const onFormatClick = () => {
    // get current value from editor
    const unformatted = editorRef.current.getModel()?.getValue();

    // format the value
    const formatted = prettier.format(unformatted, {
      parser: "babel",
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: true
    });
    // set the formatted value back to the editor
    editorRef.current.setValue(formatted);
  };

  return (
    <div>
      <button onClick={onFormatClick}>Format</button>
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
