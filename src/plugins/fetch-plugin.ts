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
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: inputCode,
          };
        }

        let cachedData;
        // try {
        //   cachedData = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
        // } catch (err) {
        //   console.log(err);
        // }

        // if (cachedData) {
        //   return cachedData;
        // }

        const { data, request } = await axios.get(args.path);
        const fileType = args.path.match(/\.css$/) ? "css" : "jsx";
        const escaped = data // g stand for extract multiple times
          .replace(/\n/g, "") // remove avery new line => put all file in one line
          .replace(/"/g, '\\"') // replace all (") by (\")
          .replace(/'/g, "\\'"); // rplace all (') by (\")

        const contents =
          fileType === "css"
            ? `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
        `
            : data;

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
    },
  };
};
