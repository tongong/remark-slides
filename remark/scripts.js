// imagelist.js
// This is a helper-script for the .ilist class
// A line of images get scaled, so that they all have the same height and fill
// the entire width
// ~ made for modified version by @tongong

const gap = 10; // pixels between each image; should match with the css rules

// this function gets passed to the slideshow-constructor and is executed after
// the creation of the slideshow
imagelistcallback = function () {
    document.querySelectorAll(".ilist p").forEach((list) => {
        let images = Array.from(list.querySelectorAll("img"));
        // Waits for all images to finish loading/detects if all images are
        // already loaded
        let alreadyLoaded = false; // prevent the function from executing twice
        if (images.every((a) => imgLoaded(a))) {
            console.log("Images are already cached.");
            allLoaded(list);
        } else {
            images.forEach((img) => {
                img.onload = function () {
                    if (images.every((a) => imgLoaded(a)) && !alreadyLoaded) {
                        alreadyLoaded = true;
                        allLoaded(list);
                    }
                };
            });
        }
    });
};

// Checks if an image is already loaded
// thanks to (aka shamelessly copied from) https://stackoverflow.com/a/34726863
function imgLoaded(imgElement) {
    return imgElement.complete && imgElement.naturalHeight !== 0;
};

// The actual magic of image resizing happens here
function allLoaded(list) {
    // kind of redundant, but who cares?
    let images = Array.from(list.querySelectorAll("img"));
    // get ratio width/height of all images combined without the gaps
    let ratio = images.map((a) => a.naturalWidth / a.naturalHeight).reduce(
        (b, a) => a + b
    );
    // build css calc() function for every image, because the final width
    // cannot be measured since the slides are display: none; at the start of
    // the presentation
    // width is calculated as fraction of the width of all images and that
    // fraction is applied to the width of the wrapper element minus the gaps
    images.forEach((image) => {
        image.style.width = "calc((100% -  " + (images.length - 1) * gap +
            "px) * " + image.naturalWidth / image.naturalHeight / ratio + ")";
    });

    // Apply margin, if set in the alt of any of the images
    let width = 0;
    images.forEach((i) => {
        if (i.alt.includes(":")) {
            width = +i.alt.split(":")[1] || 0;
        }
    });
    if (width != 0) {
        list.parentNode.style.marginLeft = (100-width)/2 + "%";
        list.parentNode.style.marginRight = (100-width)/2 + "%";
    }
};



// leftmenu.js
// This script generates a menu with headings at the left side
// headings are specified for each slide by the "left:..." option
// The headings list gets reset for every heading starting with "_"
// ~ made for modified version by @tongong

// This polyfill is needed for the pdf-export. For whatever reason the
// JS-version shipped with puppeteer does not support the replaceAll() function
// and I am to lazy to change my code lol
/**
 * String.prototype.replaceAll() polyfill
 * https://gomakethings.com/how-to-replace-a-section-of-a-string-with-another-one-with-vanilla-js/
 * @author Chris Ferdinandi
 * @license MIT
 */
if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (str, newStr) {
        // If a regex pattern
        if ( Object.prototype.toString.call(str)
            .toLowerCase() === "[object regexp]"
        ) {
            return this.replace(str, newStr);
        }
        // If a string
        return this.replace(new RegExp(str, "g"), newStr);
    };
}

function leftmenu(slides) {
    let curleftmenu = "";
    let curtemplate = "";
    slides.forEach((slide) => {
        // Check if template slide
        if (!(slide.properties || { layout: false }).layout) {
            // get template
            let template = curtemplate;
            if (slide.properties.template) {
                template = slide.properties.template;
            }

            // For left-menu template build the menu
            if (template == "leftmenu") {
                // variable with the new heading to the left
                let newleft = slide.properties.left || "...";
                if (newleft[0] != "*") {
                    if (newleft[0] == "_") {
                        curleftmenu = "\n<h2>"
                            + newleft.substring(1) + "</h2>";
                    } else {
                        curleftmenu += "\n<h2>" + newleft + "</h2>";
                    }
                }

                // Generate new content object
                let content = [
                    "\n",
                    {
                        block: true,
                        class: "left-column",
                        content: [curleftmenu + "\n"],
                    },
                    "\n",
                    {
                        block: true,
                        class: "right-column",
                        content: [...slide.content, "\n"],
                    },
                    "\n",
                ];

                // Apply new content object
                slide.content = content;
            }
        } else {
            // If template slide reload template
            curtemplate = slide.properties.name || curtemplate;
        }
    });
    return slides;
}



// arrow.js
// if a bullet point starts with an arrow, the bullet style gets changed
// convertes "- -> blabla" to "-> blabla"
// ~ made for modified version by @tongong
// applies the css rule list-style-type: symbols(cyclic "→");
function replaceArrow(slides) {
    slides.forEach((slide) => {
        slide.content = slide.content.map((p) => {
            if (typeof p == "string") {
                p = p.split("\n").map((l) => (
                    l.replace(/^[ ]*-[ ]+&rarr;/, (a) => a.replace(
                            " &rarr;",
                            " <span class='tag-arrow-bullet'></span>"
                        )
                    )
                )).join("\n");
            }
            return p;
        });
    });
    return slides;
}

function arrowcallback() {
    document.querySelectorAll(".tag-arrow-bullet").forEach((li) => {
        let parent;
        if (li.parentNode.tagName == "LI") {
            parent = li.parentNode;
        }
        else if (li.parentNode.parentNode.tagName == "LI") {
            parent = li.parentNode.parentNode;
        }
        else return;
        parent.style.listStyleType = 'symbols(cyclic "→")';
    });
}



// Init remark with additional replacing of arrows
let source = document.getElementById("source").value
    .replaceAll("->", "&rarr;");
var slideshow = remark.create(
    { preprocessor: (s) => leftmenu(replaceArrow(s)), source },
    (() => {imagelistcallback(); arrowcallback(); })
);
