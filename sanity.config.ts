import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "default",
  title: "L'Amour La Mort",
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Issues")
              .child(S.documentTypeList("issue").title("Issues")),
            S.listItem()
              .title("Articles")
              .child(S.documentTypeList("article").title("Articles")),
            S.listItem()
              .title("Authors")
              .child(S.documentTypeList("author").title("Authors")),
            S.listItem()
              .title("Series")
              .child(S.documentTypeList("series").title("Series")),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
