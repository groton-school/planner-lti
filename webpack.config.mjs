import bundle from '@battis/webpack';

export default bundle.fromTS.toSPA({
  root: import.meta.dirname,
  appName: 'Planner',
  entry: './src/UI/index.ts',
  template: './views/UI',
  module: {
    rules: [
      {
        test: /\.ejs$/,
        loader: 'html-loader',
        options: {
          // don't process the sources in ejs files -- they may not exist (yet)!
          sources: false
        }
      }
    ]
  },
  resolve: {
    symlinks: true
  },
  // TODO review externals and bundle configuration
  externals: {
    bootstrap: 'bootstrap',
    ejs: 'ejs',
    '@fullcalendar/core': 'FullCalendar',
    '@fullcalendar/daygrid': 'FullCalendar.DayGrid',
    '@fullcalendar/timegrid': 'FullCalendar.TimeGrid',
    '@fullcalendar/list': 'FullCalendar.List'
  },
  output: { path: 'public' }
});
