'use client';

import { Ellipsis } from 'lucide-react';
import { useMemo } from 'react';

interface IPagination {
    count: number;
    page?: number;
    siblingCount?: number;
}

export default function usePagination({ count, page = 1, siblingCount = 1 }: IPaginate) {
    function renderRangeNumber(start: number, end: number): number[] {
        const length = end - start + 1;
        return Array.from({ length }, (_, i) => start + i);
    }

    const paginateArray = useMemo(() => {
        const totalPaginateItem = 5 + siblingCount * 2;
        if (count <= totalPaginateItem) {
            return renderRangeNumber(1, count);
        }

        const isDotsLeft = page > 3;
        const isDotsRight = page < count - 2;

        if (isDotsLeft && !isDotsRight) {
            const rightStart = count - 2 - siblingCount;
            const rightArray = renderRangeNumber(rightStart, count);
            return [1, <Ellipsis key={rightStart} />, ...rightArray];
        }

        if (!isDotsLeft && isDotsRight) {
            const leftArray = renderRangeNumber(1, 3 + siblingCount * 2);
            return [...leftArray, <Ellipsis key="left" />, count];
        }

        if (isDotsLeft && isDotsRight) {
            const siblingStart = Math.max(1, page - siblingCount);
            const siblingEnd = Math.min(count, page * siblingCount);

            const middleArray = renderRangeNumber(siblingStart, siblingEnd);
            return [1, <Ellipsis key="left" />, ...middleArray, <Ellipsis key="right" />, count];
        }
    }, [page, count, siblingCount]);
    return paginateArray;
}
