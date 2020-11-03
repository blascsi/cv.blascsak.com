# Personal resume site

This site was created because as a Front-End developer I wanted to make my resume / portfolio available online.

## Usage

You can make changes locally if you just load index.html into your favorite browser, make changes to the files and refresh the browser after each change.

However if you want to test the build task of the site before a deployment:

1. Install dependencies via `npm install` or `yarn install`.
2. Make the necessary changes.
3. Run `npm run build`
4. Check if everything works correctly with loading `dist/index.html` into your browser.

(Note: The build process replaces all strings matching `../../public` to `public`. Keep this in mind while development or make the replacement more specific if needed.)

## Reason for the build task

I know that using purely HTML and CSS (maybe a little JS sprinkled in) should be more than enough for a simple site like this, but I really wanted to toy around with an animated canvas background, and it felt nice to have separate CSS files for the generated fonts and style reset. And while development experience is much better this way (in my opinion), these small files aren't worth the delay that comes with a HTTP request, so I made a small Gulp task to inline and minify them.
