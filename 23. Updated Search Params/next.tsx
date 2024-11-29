'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import QueryString from 'qs';
import { useState } from 'react';

const TOTAL_PAGE = 5;

const ClientSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const search = searchParams.get('q') || '';
    const task = searchParams.get('task') || '';
    const price = searchParams.get('price') || '';
    const sort = searchParams.get('sort') || '';
    const page = searchParams.get('page') || '1';
    const router = useRouter();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams);
        if (params.has('q') && e.target.value === '') {
            params.delete('q');
        } else {
            params.set('q', e.target.value);
        }
        router.push(`?${params.toString()}`);
    };

    const handleSetPage = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        if (pageNumber > TOTAL_PAGE) return;
        if (pageNumber < 1) return;

        params.set('page', pageNumber.toString());
        router.push(`?${params.toString()}`);
    };

    const handleChecked = (value: string) => {
        const params = new URLSearchParams(searchParams);
        const currentTasks = params.get('task')?.split(',') || [];
        if (currentTasks.includes(value)) {
            const updatedTasks = currentTasks.filter((task) => task !== value);
            if (updatedTasks.length > 0) {
                params.set('task', updatedTasks.join(','));
            } else {
                params.delete('task');
            }
        } else {
            params.set('task', [...currentTasks, value].join(','));
        }
        router.push(`?${params.toString()}`);
    };

    const handleSetPrice = (value: string) => {
        const params = new URLSearchParams(searchParams);
        if (params.has('price') && params.get('price') === value) {
            params.delete('price');
        } else {
            params.set('price', value);
        }
        router.push(`?${params.toString()}`);
    };

    const handleSort = (value: string) => {
        const params = new URLSearchParams(searchParams);
        if (params.has('sort') && value === 'default') {
            params.delete('sort');
        } else {
            params.set('sort', value);
        }
        router.push(`?${params.toString()}`);
    };

    const handleCallApi = () => {
        const params = new URLSearchParams(searchParams);
        const queryString = QueryString.parse(params.toString(), { ignoreQueryPrefix: true });
        const formatPrice: { [key: string]: string } = {};

        //* Quy chuẩn:
        /**
         * ! 1. value="100000" (Giá từ 100000 trở lên)
         * *    <=> price >= 100000
         * *    <=> { price[gte]: 100000 }
         * ! 2. value=">1000:<5000" (Giá trong khoảng từ 1001 - 4999)
         * *    <=> price > 1000 & price < 5000
         * *    <=> { price[gt]: 1000, price[lt]: 5000 }
         * ! 3. value="100000:500000" (Giá trong khoảng từ 100000 - 500000)
         * *    <=> price >= 100000 & price <= 500000
         * *    <=> { price[gte]: 100000, price[lte]: 500000 }
         * ! 4. value=">1000:5000" (Giá trong khoảng từ 1001 - 5000)
         * *    <=> price > 1000 & price <= 5000
         * *    <=> { price[gt]: 1000, price[lte]: 5000 }
         * ! 5. value="100000:<500000" (Giá trong khoảng từ 100000 - 499999)
         * *    <=> price >= 100000 & price < 500000
         * *    <=> { price[gte]: 100000, price[lt]: 500000 }
         * ! 6. value="0:<100000" (Giá dưới 100000)
         * *    <=> price > 100000
         * *    <=> { price[lt]: 100000 }
         */

        //? Xử lý logic
        if (queryString.price) {
            const query = queryString.price as string;
            if (query.includes('>')) {
                formatPrice.gt = query.split('>')[1].split(':')[0];
            } else {
                formatPrice.gte = query.split(':')[0];
            }

            if (query.includes('<')) {
                formatPrice.lt = query.split('<')[1].split(':')[0];
            } else {
                formatPrice.lte = query.split(':')[1];
            }
            queryString.price = formatPrice;
        }

        const query = QueryString.stringify(queryString, { encode: false, arrayFormat: 'comma' });
        setSearchQuery(query);
    };

    return (
        <div className="space-y-2">
            <p>Client Search: {search}</p>
            <div className="flex gap-2 items-center">
                <Input type="text" placeholder="Search" onChange={handleSearch} value={search} />
                <Button onClick={() => handleSetPage(Math.floor(Math.random() * 5) + 1)}>Pagination</Button>
            </div>
            <hr />
            <div className="space-y-2">
                <div className="flex gap-2 items-center">
                    <Checkbox
                        value="reactjs"
                        onCheckedChange={() => handleChecked('reactjs')}
                        checked={task.includes('reactjs')}
                    />
                    <Label>ReactJS</Label>
                </div>
                <div className="flex gap-2 items-center">
                    <Checkbox
                        value="nextjs"
                        onCheckedChange={() => handleChecked('nextjs')}
                        checked={task.includes('nextjs')}
                    />
                    <Label>NextJS</Label>
                </div>
            </div>
            <hr />
            {/* Lọc theo giá */}
            <div className="space-y-2">
                {/* Trường hợp 1 */}
                <div className="flex gap-2 items-center">
                    <Checkbox
                        value="100000"
                        onCheckedChange={() => handleSetPrice('100000')}
                        checked={price === '100000'}
                    />
                    <Label>Từ 10000 trở lên</Label>
                </div>
                {/* Trường hợp 2 */}
                <div className="flex gap-2 items-center">
                    <Checkbox
                        value=">1000:<5000"
                        onCheckedChange={() => handleSetPrice('>1000:<5000')}
                        checked={price === '>1000:<5000'}
                    />
                    <Label>Trên 1000 - Dưới 5000</Label>
                </div>
                {/* Trường hợp 3 */}
                <div className="flex gap-2 items-center">
                    <Checkbox
                        value="100000:500000"
                        onCheckedChange={() => handleSetPrice('100000:500000')}
                        checked={price === '100000:500000'}
                    />
                    <Label>Từ 100000 - 500000</Label>
                </div>
                {/* Trường hợp 4 */}
                <div className="flex gap-2 items-center">
                    <Checkbox
                        value=">1000:5000"
                        onCheckedChange={() => handleSetPrice('>1000:5000')}
                        checked={price === '>1000:5000'}
                    />
                    <Label>Trên 1000 - 5000</Label>
                </div>
                {/* Trường hợp 5 */}
                <div className="flex gap-2 items-center">
                    <Checkbox
                        value="100000:<500000"
                        onCheckedChange={() => handleSetPrice('100000:<500000')}
                        checked={price === '100000:<500000'}
                    />
                    <Label>Từ 10000 - dưới 500000</Label>
                </div>
                {/* Trường hợp 6 */}
                <div className="flex gap-2 items-center">
                    <Checkbox
                        value="0:<100000"
                        onCheckedChange={() => handleSetPrice('0:<100000')}
                        checked={price === '0:<100000'}
                    />
                    <Label>Dưới 100000</Label>
                </div>
            </div>
            <hr />
            <div>
                <Select onValueChange={(value) => handleSort(value)} defaultValue={sort}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Mặc định" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">Mặc định</SelectItem>
                        <SelectItem value="-price">Cao đến thấp</SelectItem>
                        <SelectItem value="price">Thấp đến cao</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <hr />
            <div className="flex gap-2">
                <Button onClick={() => handleSetPage(+page - 1)}>Previous</Button>
                {new Array(5).fill(0).map((_, index) => (
                    <Button
                        key={index}
                        variant={+page === index + 1 ? 'default' : 'outline'}
                        onClick={() => handleSetPage(index + 1)}
                    >
                        {index + 1}
                    </Button>
                ))}
                <Button onClick={() => handleSetPage(+page + 1)}>Next</Button>
            </div>
            <hr />
            <Button onClick={handleCallApi}>Call Api</Button>
            <hr />
            {searchQuery && (
                <p>
                    Search Query:{' '}
                    <Link
                        className="text-blue-500"
                        href={`http://localhost:3001${pathname}/?${searchQuery}`}
                    >{`http://localhost:3001${pathname}/?${searchQuery}`}</Link>
                </p>
            )}
        </div>
    );
};

export default ClientSearch;
