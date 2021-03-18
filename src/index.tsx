import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

const App = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const esbuildRef = useRef<any>();
  const iframeRef = useRef<any>();

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
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window'
      }
    });
    // post built code to the iframe
    iframeRef.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  };

  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            eval(event.data);
          }, false)
        </script>
      </body>
    </html>
  `

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
      <iframe ref={iframeRef} sandbox="allow-scripts" srcDoc={html}></iframe>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
