import axios from "axios";
import * as esbuild from "esbuild-wasm";
import localForage from "localforage";

const fileCache = localForage.createInstance({
  name: "fileCache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {

      // on loading index.js
      build.onLoad({ filter: /(^index\.js$)/ }, async () => {
        return {
          loader: "jsx",
          contents: inputCode,
        };
      });

      // called on every load to check the cached packages
      build.onLoad({ filter: /.*/ }, async (args: any) => {      
        let cachedData;
        try {
          cachedData = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
        } catch (err) {
          console.log(err);
        }

        if (cachedData) {
          return cachedData;
        }
      });

      // on loading css
      build.onLoad({ filter: /\.css$/ }, async (args: any) => {     
        const { data, request } = await axios.get(args.path);
        const escaped = data // g stand for extract multiple times
          .replace(/\n/g, "") // remove avery new line => put all file in one line
          .replace(/"/g, '\\"') // replace all (") by (\")
          .replace(/'/g, "\\'"); // rplace all (') by (\")

        const contents = `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
        `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        try {
          await fileCache.setItem(args.path, result);
        } catch (err) {
          console.log(err);
        }

        return result;
      });

      // on loading any other packages
      build.onLoad({ filter: /.*/ }, async (args: any) => {    
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
    },
  };
};
