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
      name: "coverImage",
      title: "Cover Image",
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
      of: [{ type: "block" }],
    }),
    defineField({
      name: "price",
      title: "Price (öre/cents)",
      type: "number",
      description: "Store in minor currency unit, e.g. 22000 = 220 kr",
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
  ],
});
