import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";

interface codeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<codeEditorProps> = ({ initialValue, onChange }) => {
  const onEditorDidMount: EditorDidMount = (getEditorValue, monacoeditor) => {
    monacoeditor.onDidChangeModelContent(() => {
      onChange(getEditorValue());
    });
    monacoeditor.getModel()?.updateOptions({ tabSize: 2 });
  };
  return (
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
  );
};

export default CodeEditor;
