# remark-slides

This is my personal distribution of [remarkjs](https://remarkjs.com/).

## documentation
For docs on my patches see the example presentation or look at the source code
at `remark/scripts.js`.

## patches
The styles are all shamelessly taken from the official remark presentation. But
I extended it with a few scripts/patches:

### leftmenu.js
creates an overview about the slides at the left side, just like in the official
presentation on [remarkjs.com](https://remarkjs.com/), but it can be made with
much less redundant markdown code.

### imagelist.js
scales images automatically, so that they always fit nicely without the need of
specifying a height or width or alignment.

### arrow.js
For every bullet point starting with an arrow the bullet itself gets replaced
with an arrow

For these scripts to work, there is a slight modification in the official
remark code necessary, which allows to insert a function, which preprocesses
the slides between parsing and rendering. This modification can be found in the
`remark-preprocessor.diff`-file. For the version in `remark/remark.min.js` this
patch is already applied.

I also downloaded the fonts from Google Fonts to make all presentations offline
available and avoid the Google trackers (See `remark/fonts` directory).

## compiler script
It is a real pain to edit Markdown inside a HTML text field: There is weird
stuff at the top and at the bottom and syntax highlighting and auto-completion
are going crazy. I think one can embed an external markdown document and
request that via HTTP on page load alternatively. But this method requires you
to run a real web server instead of just viewing the file in your browser. So I
hacked together this little shell script, that combines a markdown document
with the HTML boilerplate. You can run it like so (or put a shortcut in your
vimrc or configure it in whatever editor you are using):
```
./remark/compile.sh index.remark
```

## pdf export
The slides can be exported to a PDF file with
[decktape](https://github.com/astefanutti/decktape).
To export, run the following command:
```
decktape remark index.html index.pdf --chrome-arg=--disable-web-security
```

To install decktape: (LOOKING AT THIS AGAIN THIS SEEMS LIKE A VERY BAD IDEA...)
```
sudo npm install -g decktape --unsafe-perm
```

## see also
- https://github.com/gnab/remark
- https://github.com/gnab/remark/issues/72
- https://github.com/astefanutti/decktape
- https://story.xaprb.com/slides/adirondack/
