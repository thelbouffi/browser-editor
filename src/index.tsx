import "bulmaswatch/superhero/bulmaswatch.min.css";
import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
import CodeEditor from "./components/code-editor";
import Preview from "./components/preview";

const App = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const esbuildRef = useRef<any>();

  const startService = async () => {
    esbuildRef.current = await esbuild.startService({
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
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

    // traspiling
    // const result = await esbuildRef.current.transform(input, {
    //   loader: "jsx",
    //   target: 'es2015'
    // });

    // building
    const result = await esbuildRef.current.build({
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });
    setCode(result.outputFiles[0].text);
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
      <Preview code={code}/>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
