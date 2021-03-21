import "bulmaswatch/superhero/bulmaswatch.min.css";
import { useState } from "react";
import ReactDOM from "react-dom";
import CodeEditor from "./components/code-editor";
import Preview from "./components/preview";
import bundle from "./bundler";

const App = () => {
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

ReactDOM.render(<App />, document.querySelector("#root"));
