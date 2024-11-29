import { useSearchParams } from 'react-router-dom';
import style from '../assets/css/style.module.css';
import QueryString from 'qs';
import { useState } from 'react';

const TOTAL_PAGE = 5;

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const search = searchParams.get('q');
    const page = searchParams.get('page') || '1';
    const price = searchParams.get('price');
    const task = searchParams.get('task') || '';
    const sort = searchParams.get('sort') || 'default';

    const handleSetSearch = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (params.has('q') && value === '') {
            params.delete('q');
        } else {
            params.set('q', value);
        }
        setSearchParams(params);
    };

    const handleSetPage = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (+value < 1) return;
        if (+value > TOTAL_PAGE) return;
        params.set('page', value);
        setSearchParams(params);
    };

    const handleChangeCheckBox = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (params.has('price') && params.get('price') === value) {
            params.delete('price');
        } else {
            params.set('price', value);
        }
        setSearchParams(params);
    };

    const handleCheckTask = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const currentTasks = params.get('task')?.split(',') || [];

        if (currentTasks.includes(value)) {
            const updatedTasks = currentTasks.filter((v) => v !== value);
            if (updatedTasks.length > 0) {
                params.set('task', updatedTasks.join(','));
            } else {
                params.delete('task');
            }
        } else {
            params.set('task', [...currentTasks, value].join(','));
        }

        setSearchParams(params);
    };

    const handleSort = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (params.has('sort') && value === 'default') {
            params.delete('sort');
        } else {
            params.set('sort', value);
        }
        setSearchParams(params);
    };

    const handleCallApi = () => {
        const params = new URLSearchParams(searchParams.toString());
        const queryString = QueryString.parse(params.toString(), { ignoreQueryPrefix: true });
        const formatPrice: { [key: string]: string } = {};

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
        <>
            <div className={style.container}>
                <div>
                    <p>Search Value: {search}</p>
                    <p>API URL: {searchQuery}</p>
                    {/* Search */}
                    <div>
                        <input
                            type="text"
                            placeholder="Search"
                            value={search || ''}
                            onChange={(e) => handleSetSearch(e.target.value)}
                        />
                    </div>
                    <br />
                    <hr />
                    <br />
                    {/* Pagination */}
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <button className={style.buttonPaginate} onClick={() => handleSetPage((+page - 1).toString())}>
                            Previous
                        </button>
                        {new Array(5).fill(0).map((_, index) => (
                            <button
                                key={index}
                                className={`${style.buttonPaginate} ${index + 1 === +page ? style.active : ''}`}
                                onClick={() => handleSetPage((index + 1).toString())}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button className={style.buttonPaginate} onClick={() => handleSetPage((+page + 1).toString())}>
                            Next
                        </button>
                    </div>
                    <br />
                    <hr />
                    <br />
                    {/* Price Offer */}
                    <div>
                        <label htmlFor="" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <input
                                type="checkbox"
                                value=">10000"
                                onChange={(e) => handleChangeCheckBox(e.target.value)}
                                checked={price === '>10000'}
                            />
                            Trên 10000
                        </label>
                        <label htmlFor="" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <input
                                type="checkbox"
                                value="10000:<50000"
                                onChange={(e) => handleChangeCheckBox(e.target.value)}
                                checked={price === '10000:<50000'}
                            />
                            Từ 10000 - Dưới 50000
                        </label>
                        <label htmlFor="" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <input
                                type="checkbox"
                                value=">10000:<50000"
                                onChange={(e) => handleChangeCheckBox(e.target.value)}
                                checked={price === '>10000:<50000'}
                            />
                            Trên 10000 - dưới 50000
                        </label>
                        <label htmlFor="" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <input
                                type="checkbox"
                                value="10000:50000"
                                onChange={(e) => handleChangeCheckBox(e.target.value)}
                                checked={price === '10000:50000'}
                            />
                            Từ 10000 - 50000
                        </label>
                        <label htmlFor="" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <input
                                type="checkbox"
                                value=">10000:50000"
                                onChange={(e) => handleChangeCheckBox(e.target.value)}
                                checked={price === '>10000:50000'}
                            />
                            Trên 10000 - 50000
                        </label>
                        <label htmlFor="" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <input
                                type="checkbox"
                                value="0:<10000"
                                onChange={(e) => handleChangeCheckBox(e.target.value)}
                                checked={price === '0:<10000'}
                            />
                            Dưới 10000
                        </label>
                    </div>
                    <br />
                    <hr />
                    <br />
                    {/* Tasks */}
                    <div>
                        <label htmlFor="" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <input
                                type="checkbox"
                                value="nextjs"
                                onChange={(e) => handleCheckTask(e.target.value)}
                                checked={task.includes('nextjs')}
                            />
                            NextJS
                        </label>
                        <label htmlFor="" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <input
                                type="checkbox"
                                value="reactjs"
                                onChange={(e) => handleCheckTask(e.target.value)}
                                checked={task.includes('reactjs')}
                            />
                            ReactJS
                        </label>
                    </div>
                    <br />
                    <hr />
                    <br />
                    {/* Sort Price */}
                    <div>
                        <select
                            style={{ width: '120px', padding: '5px 10px' }}
                            onChange={(e) => handleSort(e.target.value)}
                        >
                            <option value="default" selected={sort === 'default'}>
                                Mặc Định
                            </option>
                            <option value="-price" selected={sort === '-price'}>
                                Thấp tới cao
                            </option>
                            <option value="price" selected={sort === 'price'}>
                                Cao tới thấp
                            </option>
                        </select>
                    </div>
                    <br />
                    <hr />
                    <br />
                    {/* Call API URL */}
                    <button onClick={handleCallApi}>Call API</button>
                </div>
            </div>
        </>
    );
};

export default SearchPage;
