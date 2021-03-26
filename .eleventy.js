const { DateTime } = require("luxon");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function(eleventyConfig) {
  // Eleventy Navigation https://www.11ty.dev/docs/plugins/navigation/
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // Merge data instead of overriding
  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true);

  // List of only the pages that should show in the header nav
  eleventyConfig.addCollection("headerNavPages", collectionApi => {
    return collectionApi.getAll().filter((item) => {
      return (
        item.data.hasOwnProperty("eleventyNavigation")
          && item.data.eleventyNavigation.includeInHeaderNav);
    });
  });

  const readableDateMonthYear = dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("LLL y");
  };

  // Date formatting (human readable)
  eleventyConfig.addFilter("readableDate", dateObj => {
    const dayOfMonthStr = (
      DateTime.fromJSDate(dateObj, {zone: "utc"}).toFormat("d"));
    const dayOfMonth = parseInt(dayOfMonthStr);

    // Thanks to: https://momentjs.com/docs/#/customization/ordinal/
    const getOrdinal = (number) => {
      const b = number % 10;
      const output = ((~~(number % 100 / 10) === 1)
        ? "th"
        : ((b === 1)
          ? "st"
          : ((b === 2)
            ? "nd"
            : ((b === 3)
              ? "rd"
              : "th"))));

      return output;
    };

    return (
      dayOfMonthStr
        + getOrdinal(dayOfMonth)
        + " "
        + readableDateMonthYear(dateObj));
  });

  // Date formatting (just month and year)
  eleventyConfig.addFilter("readableDateMonthYear", readableDateMonthYear);

  // Needed because the nunjucks built-in slice filter is actually a chunker, but we
  // want regular JS slice behaviour
  eleventyConfig.addFilter("jsslice", (value, start, end) => {
    return value.slice(start, end);
  });

  // Given a page URL, find its parent page by chopping off the final
  // slash-delimited part of the URL, and finding a matching page.
  eleventyConfig.addFilter("getParentPage", (collection, pageURL) => {
    if (!pageURL.match(/^\/[^/]+\/([^/]+\/)+$/)) {
      return null;
    }

    const expectedParentPageURL = pageURL.replace(/[^/]+\/$/, "");
    const parentPages = collection.filter(item => {
      return item.url === expectedParentPageURL;
    });

    return parentPages.length ? parentPages[0] : null;
  });

  eleventyConfig.addFilter("getPhotosForGallery", (photos, galleryTag) => {
    return photos.filter(item => {
      return item.data.tags.includes(galleryTag);
    });
  });

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy({"static/favicon.ico": "favicon.ico"});
  eleventyConfig.addPassthroughCopy({"static/css": "css"});
  eleventyConfig.addPassthroughCopy({"static/img": "img"});
  eleventyConfig.addPassthroughCopy({"static/js": "js"});

  return {
    templateFormats: ["html"],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
    pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
