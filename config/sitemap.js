import fm from "front-matter";
import { locales, flattenDeep, readFileAsync } from "../helpers";

import blogPaths from "../contents/blogs";

export default {
  hostname: "https://jefrydco.id",
  gzip: true,
  async routes() {
    let routes = await Promise.all(
      locales.map(locale => {
        return Promise.all(
          blogPaths.map(async blogPath => {
            let blogs = null;
            if (locale.code === "id") {
              blogs = await readFileAsync(
                `./contents/blogs/${blogPath}/index.md`
              );
            } else {
              blogs = await readFileAsync(
                `./contents/blogs/${blogPath}/index.${locale.code}.md`
              );
            }
            const { attributes } = await fm(blogs.toString());

            if (locale.code === "id") {
              return {
                url: `/blog/${blogPath}`,
                changefreq: "daily",
                priority: 1,
                lastmodISO: new Date(attributes.updatedDate).toISOString()
              };
            } else {
              return {
                url: `${locale.code}/blog/${blogPath}`,
                changefreq: "daily",
                priority: 1,
                lastmodISO: new Date(attributes.updatedDate).toISOString()
              };
            }
          })
        );
      })
    );
    routes = flattenDeep(routes);
    return routes;
  }
};