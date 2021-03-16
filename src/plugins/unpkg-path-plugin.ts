import axios from "axios";
import * as esbuild from "esbuild-wasm";
import localForage from "localforage";

const fileCache = localForage.createInstance({
  name: "fileCache",
});

export const unpkgPathPlugin = (inputCode: string) => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log("onResolve", args);
        if (args.path === "index.js") {
          return { path: args.path, namespace: "a" };
        }
        if (args.path.includes("./") || args.path.includes("../")) {
          // if(args.resolveDir){
          //   return {
          //     path: new URL(args.path,`https://unpkg.com/${args.resolveDir}/`).href,
          //     namespace: "a",
          //   };
          // }
          // return {
          //   path: new URL(args.path,`${args.importer}/`).href,
          //   namespace: "a",
          // };
          return {
            path: new URL(args.path, `https://unpkg.com/${args.resolveDir}/`)
              .href,
            namespace: "a",
          };
        }

        return {
          path: `https://unpkg.com/${args.path}`,
          namespace: "a",
        };

        // else if (args.path === "tiny-test-pkg") {
        //   return {
        //     path: "https://unpkg.com/tiny-test-pkg@1.0.0/index.js",
        //     namespace: "a",
        //   };
        // }
      });

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
          cachedData = await fileCache.getItem<esbuild.OnLoadResult>(
            args.path
          );
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
    },
  };
};
