"use client"

import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/lib/utils';


interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

const Filter = ({ filters, otherClasses, containerClasses }: Props) => {

  const searchParams = useSearchParams();
  const router = useRouter();

  const paramFilters = searchParams.get('filter');

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'filter',
      value
    })

    router.push(newUrl, { scroll: false });
  }

  return (
    <div className={`relative ${containerClasses}`}>
      <Select onValueChange={handleUpdateParams} defaultValue={paramFilters || undefined}>
        <SelectTrigger className={`${otherClasses} body-regular light-border background-light_800_dark300 text-dark500_light700 border px-5 py-2.5`}>
          <div className='line-clamp-1 flex-1 text-left'>
            <SelectValue placeholder="Select a filter" />
          </div>
        </SelectTrigger>
        <SelectContent className='text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300'>
          <SelectGroup>
            {filters.map((item) => {
              return (
                <SelectItem className='focus:bg-light-800 dark:focus:bg-dark-400 cursor-pointer' key={item.value} value={item.value}>
                  {item.name}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>

    </div>
  )
}

export default Filter