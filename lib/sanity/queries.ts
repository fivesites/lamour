import { groq } from "next-sanity";

export const issuesQuery = groq`*[_type == "issue"] | order(issueNumber desc) {
  _id,
  title,
  slug,
  issueNumber,
  coverImage,
  price,
  inStock,
  publishedAt
}`;

export const issueBySlugQuery = groq`*[_type == "issue" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  issueNumber,
  coverImage,
  "previewImages": previewImages[] { _key, alt, asset },
  description,
  price,
  stripePriceId,
  inStock,
  publishedAt
}`;

export const seriesQuery = groq`*[_type == "series"] | order(title asc) {
  _id,
  title,
  slug,
  description,
  aboutText
}`;

export const articlesQuery = groq`*[_type == "article"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  "author": author->{name, slug},
  "issue": issue->{title, issueNumber},
  "series": series->{title, slug},
  coverImage,
  publishedAt
}`;

export const articleBySlugQuery = groq`*[_type == "article" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  "author": author->{name, slug, image, bio},
  "issue": issue->{title, issueNumber, slug},
  "series": series->{title, slug},
  body,
  publishedAt
}`;

export const authorBySlugQuery = groq`*[_type == "author" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  bio,
  image,
  "articles": *[_type == "article" && references(^._id)] | order(publishedAt desc) {
    title,
    slug,
    publishedAt,
    "issue": issue->{title, issueNumber}
  }
}`;
