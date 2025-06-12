import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const loading = () => {
    return (
        <Skeleton className="w-full h-[400px]" />
    );
};

export default loading