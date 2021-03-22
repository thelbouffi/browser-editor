import "./text-editor.css";
import { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";

const TextEditor: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("# Header");
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
      <div className="text-editor" ref={textEditorRef}>
        <MDEditor value={value} onChange={(v) => setValue(v || "")} />
      </div>
    );
  }

  return (
    <div className="text-editor card" onClick={() => setEditing(true)}>
      <div className="card-content">
        <MDEditor.Markdown source={value} />
      </div>
    </div>
  );
};

export default TextEditor;
