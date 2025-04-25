import bundle from '@battis/webpack';

export default bundle.fromTS.toSPA({
  root: import.meta.dirname,
  appName: 'Planner',
  entry: './src/SPA/index.ts',
  template: './templates/SPA',
  externals: { bootstrap: 'bootstrap' },
  output: { path: 'public' }
});
