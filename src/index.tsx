import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";

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
    // traspiling
    // const result = await esbuildRef.current.transform(input, {
    //   loader: "jsx",
    //   target: 'es2015'
    // });

    // building
    const result = await esbuildRef.current.build({
      plugins: [unpkgPathPlugin(input)],
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window'
      }
    });
    console.log(result)

    setCode(result.outputFiles[0].text);
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
