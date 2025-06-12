import React from 'react';
import prisma from '@/utils/connect';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import { buttonVariants } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { Trash2 } from 'lucide-react';

const getPostDetail = async (postId: string) => {
    const data = await prisma.blogPost.findUnique({
        where: {
            id: postId,
        },
    });
    return data;
};

const deletePost = async (postId: string) => {
    try {
        await prisma.blogPost.delete({
            where: {
                id: postId,
            }
        });
        redirect("/");
    } catch (error) {
        console.log(error);
    }
};

type Params = Promise<{ id: string }>;

const PostDetail = async ({ params }: { params: Params }) => {
    const { id } = await params;
    const post = await getPostDetail(id);

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!post) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Post not found</h1>
                    <Link href="/" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
                        <ChevronLeft className="inline mr-1" size={16} />
                        Return home
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn flex flex-col gap-6">

            <div className='flex justify-between items-center'>
                <Link href="/" className={buttonVariants({
                    variant: "secondary",
                }) + " flex items-center gap-1"}>
                    <ChevronLeft className="inline" size={16} />
                    Back to posts
                </Link>

                {
                    user?.id === post.authorId && (
                        <form
                            className={"w-max cursor-pointer"}
                            action={
                                async () => {
                                    "use server";
                                    await deletePost(post.id)
                                }
                            }>
                            <button type="submit">
                                <Trash2 color="#f40101" />
                            </button>
                        </form>
                    )
                }
            </div>

            <div className="">
                {/* Hero Section with Parallax Effect */}
                <div className="relative h-96 w-full overflow-hidden rounded-2xl mb-12 shadow-2xl group">
                    <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-105"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-2 drop-shadow-lg">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-3 flex-wrap">
                            <Image
                                src={post.authorImage}
                                alt={post.authorName}
                                width={40}
                                height={40}
                                className="rounded-full border-2 border-white flex-shrink-0"
                            />
                            <span className="font-medium">{post.authorName}</span>
                            <span className="text-white/80">
                                {formatDate(post.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Animated Content Section */}
                <article className="prose prose-lg max-w-none dark:prose-invert 
                        prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500 
                        prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-l-blue-500
                        prose-pre:bg-gray-900 prose-pre:text-gray-100">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} className='text-gray-600 text-lg tracking-wide' />

                    {/* Author Card (Sticky on scroll) */}
                    <div className="sticky bottom-8 mt-16 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg 
                      border border-gray-200 dark:border-gray-800 backdrop-blur-sm bg-opacity-80
                      transition-all duration-300 hover:shadow-xl">
                        <div className="flex items-center gap-4">
                            <Image
                                src={post.authorImage}
                                alt={post.authorName}
                                width={80}
                                height={80}
                                className="rounded-full border-2 border-blue-500 flex-shrink-0"
                            />
                            <div>
                                <h3 className="text-xl font-bold">{post.authorName}</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Published on {formatDate(post.createdAt)}
                                </p>
                                <Link
                                    href={`/author/${post.authorId}`}
                                    className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-500 transition-colors"
                                >
                                    View all posts →
                                </Link>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default PostDetail;