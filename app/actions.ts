"use server";

import prisma from "@/utils/connect";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function handleSubmit(formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return redirect("/api/auth/register");
    };

    await prisma.blogPost.create({
        data: {
            title: formData.get("title") as string,
            content: formData.get("content") as string,
            imageUrl: formData.get("imgUrl") as string,
            authorImage: user?.picture as string,
            authorName: user?.given_name as string,
            authorId: user?.id as string,
        }
    });

    revalidatePath("/");

    return redirect("/dashboard");
};