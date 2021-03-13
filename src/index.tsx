import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const App = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const esbuildRef = useRef<any>();

  const startService = async () => {
    esbuildRef.current = await esbuild.startService({
      wasmURL: "/esbuild.wasm",
      worker: true,
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const submitHandler = async () => {
    if (!esbuildRef.current) {
      return;
    }
    const result = await esbuildRef.current.transform(input, {
      loader: "jsx",
      target: 'es2015'
    });

    setCode(result.code);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={submitHandler}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
