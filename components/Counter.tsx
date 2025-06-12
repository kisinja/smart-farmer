"use client";

import { useState } from "react";
import { Button } from "./ui/button";

const Counter = () => {
    const [count, setCount] = useState(0);
    return (
        <div className="flex justify-center items-center">
            <Button onClick={() => setCount(prev => prev + 1)}>
                Count: {count}
            </Button>
        </div>
    );
};

export default Counter;