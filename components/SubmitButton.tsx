"use client";

import { useFormStatus } from "react-dom"
import { Button } from "./ui/button"

const SubmitButton = () => {

    const { pending } = useFormStatus();

    return (
        <Button className="w-fit cursor-pointer" type="submit" disabled={pending}>
            {pending ? "Creating..." : "Create Post"}
        </Button>
    )
}

export default SubmitButton