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
        + DateTime.fromJSDate(dateObj).toFormat("LLL y"));
  });

  // Needed because the nunjucks built-in slice filter is actually a chunker, but we
  // want regular JS slice behaviour
  eleventyConfig.addFilter("jsslice", (value, start, end) => {
    return value.slice(start, end);
  });

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("js");

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
