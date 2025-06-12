import { handleSubmit } from '@/app/actions'
import SubmitButton from '@/components/SubmitButton'
import { CardHeader, Card, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React from 'react';

const CreateBlog = async () => {

    return (
        <div>
            <Card className='max-w-lg mx-auto'>
                <CardHeader>
                    <CardTitle>Create Post</CardTitle>
                    <CardDescription>Create a new post to share with the world</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className='flex flex-col gap-4' action={handleSubmit}>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" required type='text' placeholder='Title' name="title" />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor="content">Content</Label>
                            <Textarea required placeholder='Content' name="content" />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor="content">Image URL</Label>
                            <Input required type='url' placeholder='Image url' name="imgUrl" />
                        </div>

                        <SubmitButton />
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateBlog;