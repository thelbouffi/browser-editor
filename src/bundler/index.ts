import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

let service: esbuild.Service;
const bundle = async (rawCode: string) => {
  if (!service) {
    service = await esbuild.startService({
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
      worker: true,
    });
  }

  try {
    const result = await service.build({
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });
    return {
      code: result.outputFiles[0].text,
      err: "",
    };
  } catch (error) {
    return {
      code: "",
      err: error.message,
    };
  }
};

export default bundle;
