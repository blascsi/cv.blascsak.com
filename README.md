# Personal resume site

This site was created because as a Front-End developer I wanted to make my resume / portfolio available online.

## Usage

You can make changes locally if you just load index.html into your favorite browser, make changes to the files and refresh the browser after each change.

You can test if the build task succeeds by installing the dependencies with `npm i` and running the bundler with `npm run build`.
After the task finishes, the generated files will be located in the `/dist` directory, and they can be tested by serving the directory through a web server.

The changes committed to master will be automatically deployed by a GitHub Action, if the commit is not marked with a `[deploy skip]` flag.
