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

  const REVIEW_TAG_PREFIX = "reviewtag/";
  const REVIEW_TAGS_PATH = "/library/books/categories/";

  const GAME_TAG_PREFIX = "gametag/";
  const GAME_TAGS_PATH = "/interests/games/categories/";

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

  eleventyConfig.addFilter("readableDateJustDay", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("cccc");
  });

  // Needed because the nunjucks built-in slice filter is actually a chunker, but we
  // want regular JS slice behaviour
  eleventyConfig.addFilter("jsslice", (value, start, end) => {
    return value.slice(start, end);
  });

  const getPageByUrl = (collection, pageURL) => {
    const pages = collection.filter(item => {
      return item.url === pageURL;
    });

    return pages.length ? pages[0] : null;
  };

  // Given a page URL, find its parent page by chopping off the final
  // slash-delimited part of the URL, and finding a matching page.
  eleventyConfig.addFilter("getParentPage", (collection, pageURL) => {
    if (!pageURL.match(/^\/[^/]+\/([^/]+\/)+$/)) {
      return null;
    }

    const expectedParentPageURL = pageURL
      .replace(/page\/\d+\/$/, "")
      .replace(/[^/]+\/$/, "");
    return getPageByUrl(collection, expectedParentPageURL);
  });

  eleventyConfig.addFilter("getItemsForTag", (items, tag) => {
    return items.filter(item => {
      return item.data.tags.includes(tag);
    });
  });

  eleventyConfig.addFilter("getTagsForReview", (tags, collection) => {
    if (!tags) {
      return [];
    }

    return tags
      .filter(tag => tag.startsWith(REVIEW_TAG_PREFIX))
      .map(tag => tag.replace(REVIEW_TAG_PREFIX, ""))
      .filter(tag => getPageByUrl(collection, REVIEW_TAGS_PATH + tag + "/"))
      .map(tag => {
        return {
          url: REVIEW_TAGS_PATH + tag + "/",
          title: getPageByUrl(collection, REVIEW_TAGS_PATH + tag + "/").data.title
        };
      });
  });

  eleventyConfig.addFilter("getTagsForGame", (tags, collection) => {
    if (!tags) {
      return [];
    }

    return tags
      .filter(tag => tag.startsWith(GAME_TAG_PREFIX))
      .map(tag => tag.replace(GAME_TAG_PREFIX, ""))
      .filter(tag => getPageByUrl(collection, GAME_TAGS_PATH + tag + "/"))
      .map(tag => {
        return {
          url: GAME_TAGS_PATH + tag + "/",
          title: getPageByUrl(collection, GAME_TAGS_PATH + tag + "/").data.title
        };
      });
  });

  eleventyConfig.addFilter("getAllReviewTags", (collection) => {
    if (!collection) {
      return [];
    }

    return collection.map(item => {
      const tag = item.url.replace(REVIEW_TAGS_PATH, "").replace("/", "");
      return {
        key: REVIEW_TAG_PREFIX + tag,
        url: item.url,
        title: item.data.title
      };
    });
  });

  eleventyConfig.addFilter("getAllGameTags", (collection) => {
    if (!collection) {
      return [];
    }

    return collection.map(item => {
      const tag = item.url.replace(GAME_TAGS_PATH, "").replace("/", "");
      return {
        key: GAME_TAG_PREFIX + tag,
        url: item.url,
        title: item.data.title
      };
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
