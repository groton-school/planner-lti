import bundle from "@battis/webpack";

export default bundle.fromTS.toSPA({
  root: import.meta.dirname,
  appName: "Planner",
  entry: "./src/UI/index.ts",
  template: "./templates/spa",
  output: { path: "public" },
});
