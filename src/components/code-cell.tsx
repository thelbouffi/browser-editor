import { useState, useEffect } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import Resizable from "./resizable";
import bundle from "../bundler";

const CodeCell = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      const bundledCode = await bundle(input);
      setCode(bundledCode.code);
      setErr(bundledCode.err)
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <Resizable direction="vertical">
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue="const a =2;"
            onChange={(value) => setInput(value)}
          />
        </Resizable>
        <Preview code={code} err={err}/>
      </div>
    </Resizable>
  );
};

export default CodeCell;
