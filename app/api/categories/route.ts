import myPrismaClient from "@/utils/connect";

export async function POST(req: Request) {
  const { name, description, imageUrl } = await req.json();

  if (!name || !description || !imageUrl) {
    return new Response("Missing required fields", { status: 400 });
  }

  try {
    const category = await myPrismaClient.category.create({
      data: {
        name,
        description,
        imageUrl,
      },
    });

    return new Response(JSON.stringify(category), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const categories = await myPrismaClient.category.findMany({
      orderBy: { name: "asc" },
    });

    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
