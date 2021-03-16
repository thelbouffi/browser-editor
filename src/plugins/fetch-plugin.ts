import axios from "axios";
import * as esbuild from "esbuild-wasm";
import localForage from "localforage";

const fileCache = localForage.createInstance({
  name: "fileCache",
});

export const fetchPlugin = (inputCode: string) => {
    return {
        name: 'fetch-plugin',
        setup(build: esbuild.PluginBuild){
        build.onLoad({ filter: /.*/ }, async (args: any) => {
            console.log("onLoad", args);
    
            if (args.path === "index.js") {
              return {
                loader: "jsx",
                contents: inputCode,
              };
            }
    
            let cachedData;
            try {
              cachedData = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
            } catch (err) {
              console.log(err);
            }
    
            if (cachedData) {
              return cachedData;
            }
    
            const { data, request } = await axios.get(args.path);
            const result: esbuild.OnLoadResult = {
              loader: "jsx",
              contents: data,
              resolveDir: new URL("./", request.responseURL).pathname,
            };
    
            try {
              await fileCache.setItem(args.path, result);
            } catch (err) {
              console.log(err);
            }
    
            return result;
          });
        }
    }
}