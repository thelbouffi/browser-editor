import { useState } from "react";
import ReactDOM from "react-dom";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundle from "../bundler";

const CodeCell = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const submitHandler = async () => {
    const bundledCode = await bundle(input);
    setCode(bundledCode);
  };

  return (
    <div>
      <CodeEditor
        initialValue="const a =2;"
        onChange={(value) => setInput(value)}
      />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={submitHandler}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  );
};

export default CodeCell;