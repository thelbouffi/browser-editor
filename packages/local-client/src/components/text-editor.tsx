import "./text-editor.css";
import { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Cell } from "../state";
import { useActions } from "../hooks/use-actions";

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const [editing, setEditing] = useState(false);
  const textEditorRef = useRef<HTMLDivElement | null>(null);

  const { updateCell } = useActions();

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
        <MDEditor
          value={cell.content}
          onChange={(v) => updateCell(cell.id, v || "")}
        />
      </div>
    );
  }

  return (
    <div className="text-editor card" onClick={() => setEditing(true)}>
      <div className="card-content">
        <MDEditor.Markdown source={cell.content || "Click to edit"} />
      </div>
    </div>
  );
};

export default TextEditor;
