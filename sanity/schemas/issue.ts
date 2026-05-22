import { defineField, defineType } from "sanity";

export default defineType({
  name: "issue",
  title: "Issue",
  type: "document",
  orderings: [
    {
      title: "Issue Number",
      name: "issueNumberDesc",
      by: [{ field: "issueNumber", direction: "desc" }],
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "issueNumber",
      title: "Issue Number",
      type: "number",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "cover",
      title: "Cover",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (r) => r.required(),
        }),
      ],
    }),
    defineField({
      name: "spine",
      title: "Spine",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "back",
      title: "Back",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "previewImages",
      title: "Preview Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              validation: (r) => r.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 1", value: "h1" },
            { title: "Heading 2", value: "h2" },
            { title: "Blockquote", value: "blockquote" },
            { title: "Quote", value: "quote" },
          ],
          lists: [],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [{ name: "href", type: "url", title: "URL" }],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "price",
      title: "Price (SEK)",
      type: "number",
      description: "Enter in SEK, e.g. 220. Multiply by 100 when sending to Stripe.",
    }),
    defineField({
      name: "weight",
      title: "Weight (grams)",
      type: "number",
    }),
    defineField({
      name: "stripePriceId",
      title: "Stripe Price ID",
      type: "string",
      description: "Populate when Stripe is integrated",
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "date",
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions",
      type: "object",
      description: "Physical dimensions in millimeters",
      fields: [
        defineField({
          name: "cover",
          title: "Cover",
          type: "object",
          fields: [
            defineField({ name: "width", title: "Width (mm)", type: "number" }),
            defineField({ name: "height", title: "Height (mm)", type: "number" }),
          ],
        }),
        defineField({
          name: "spine",
          title: "Spine",
          type: "object",
          fields: [
            defineField({ name: "width", title: "Width (mm)", type: "number" }),
          ],
        }),
      ],
    }),
  ],
});
