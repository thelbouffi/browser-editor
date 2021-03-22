import './text-editor.css';
import { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";

const TextEditor: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const textEditorRef = useRef<HTMLDivElement | null>(null);

  const listener = (event: MouseEvent) => {
    if (
      textEditorRef.current &&
      event.target &&
      textEditorRef.current.contains(event.target as Node)
    ) {
      return;
    }
    setEditing(false);
  };

  useEffect(() => {
    document.addEventListener("click", listener, {
      capture: true,
    });
    // or document.addEventListener("click", listener, true);
    return () => {
      document.removeEventListener("click", listener, {
        capture: true,
      });
      // or document.removeEventListener("click", listener, true);
    };
  }, []);

  if (editing) {
    return (
      <div ref={textEditorRef}>
        <MDEditor />
      </div>
    );
  }

  return (
    <div onClick={() => setEditing(true)}>
      <MDEditor.Markdown source={"# Header"} />
    </div>
  );
};

export default TextEditor;
