import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-webhook-secret");

  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  let body: { _type?: string; slug?: { current?: string } } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type = body._type;
  const slug = body.slug?.current;

  if (type === "issue") {
    revalidatePath("/shop");
    if (slug) revalidatePath(`/shop/${slug}`);
  } else if (type === "article") {
    revalidatePath("/articles");
    if (slug) revalidatePath(`/articles/${slug}`);
  } else if (type === "author") {
    if (slug) revalidatePath(`/authors/${slug}`);
  } else {
    revalidatePath("/");
  }

  return NextResponse.json({ revalidated: true, type, slug });
}
