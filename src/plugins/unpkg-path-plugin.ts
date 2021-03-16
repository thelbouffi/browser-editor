import * as esbuild from "esbuild-wasm";


export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // handle root entry file of 'index.js
      // means on resolvin args.path === "index.js",
      // (^) for no characters infront of index, ($) for no characters after index
      build.onResolve({ filter: /(^index\.js$)/ }, async () => {
        return { path: "index.js", namespace: "a" };
      });

      // on resolving relative and nested paths in a module
      // means on resolving (args.path.includes("./") || args.path.includes("../"))
      // (+) for repeating the (.), (^) means text that stars with, (\) to consider (.) and (/) as real characters
      //  in our case find text that stars with 1 dot or more then has (/)
      build.onResolve({ filter: /^\.+\// }, async (args: any) => {
        return { 
          path: new URL(args.path, `https://unpkg.com/${args.resolveDir}/`)
            .href,
          namespace: "a",
        };
      });

      // on resolving other use cases of args.path (that are main file of a module)
      // (.) means any character, (*) means repeat as many time as you want, 
      // this means any characters
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          path: `https://unpkg.com/${args.path}`,
          namespace: "a",
        };
      });
    },
  };
};
