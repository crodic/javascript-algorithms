/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const DateScheme = z.object({
    date: z
        .object({
            year: z.string(),
            month: z.string(),
            day: z.string(),
        })
        .superRefine((value, ctx) => {
            if (value.month.length <= 0) {
                ctx.addIssue({
                    message: 'Month is invalid',
                    code: z.ZodIssueCode.custom,
                });
            }
            if (value.year.length <= 0) {
                ctx.addIssue({
                    message: 'Year is invalid',
                    code: z.ZodIssueCode.custom,
                });
            }
        }),
});

export default function Home() {
    const form = useForm<z.infer<typeof DateScheme>>({
        resolver: zodResolver(DateScheme),
        defaultValues: {
            date: {
                year: '',
                month: '',
                day: '',
            },
        },
    });
    const year = form.watch('date.year');
    const month = form.watch('date.month');
    const onSubmit = async (value: z.infer<typeof DateScheme>) => {
        console.log(value);
    };

    const getDaysInMonth = (year: number, month: number): number[] => {
        month = month - 1;
        const date = new Date(year, month + 1, 0);
        const daysInMonth = date.getDate();
        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    };

    const [days, setDays] = useState<number[]>([]);

    useEffect(() => {
        setDays(getDaysInMonth(Number(year), Number(month)));

        // form.setValue('date.day', '1'); // Reset day to 1 when year or month changes to avoid invalid dates
    }, [year, month, form.setValue]);

    console.log(form.formState.errors);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mx-5">
                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="date.year"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Năm Sinh</FormLabel>
                                <Select
                                    onValueChange={(value: string) => {
                                        field.onChange(value);
                                    }}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Array.from(
                                            { length: new Date().getFullYear() - 1900 + 1 },
                                            (_, i) => 1900 + i
                                        ).map((year) => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="date.month"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tháng Sinh</FormLabel>
                                <Select
                                    onValueChange={(value: string) => {
                                        field.onChange(value);
                                    }}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                            <SelectItem key={month} value={month.toString()}>
                                                {month}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="date.day"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày Sinh</FormLabel>
                                <Select
                                    onValueChange={(value: string) => {
                                        field.onChange(value);
                                    }}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {days.map((day) => (
                                            <SelectItem key={day} value={day.toString()}>
                                                {day}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <p className="text-red-500">{form.formState.errors.date?.root?.message}</p>
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
