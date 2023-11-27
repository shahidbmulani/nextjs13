import { BADGE_CRITERIA } from "@/constants";
import { BadgeCounts } from "@/types";
import { type ClassValue, clsx } from "clsx"
import qs from "query-string";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getTimestamp = (createdAt: Date): string => {
  const createdDate = new Date(createdAt);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - createdDate.getTime();
  const secondsAgo = Math.floor(timeDifference / 1000);

  if (secondsAgo < 60) {
    return `${secondsAgo} second${secondsAgo === 1 ? '' : 's'} ago`;
  } else if (secondsAgo < 3600) {
    const minutesAgo = Math.floor(secondsAgo / 60);
    return `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`;
  } else if (secondsAgo < 86400) {
    const hoursAgo = Math.floor(secondsAgo / 3600);
    return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
  } else {
    const daysAgo = Math.floor(secondsAgo / 86400);
    return `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
  }
};

export const formatBigNumber = (inputNumber: number): string => {
  if (inputNumber >= 2000000) {
    return `${(inputNumber / 1000000).toFixed(2)}M`;
  } else if (inputNumber >= 2000) {
    return `${(inputNumber / 1000).toFixed(2)}K`;
  } else {
    return inputNumber.toString();
  }
}

export const getJoinedDate = (date: Date): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const joinedDate = `${months[monthIndex]} ${year}`;

  return joinedDate;
}

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;

  return qs.stringifyUrl({
    url: window.location.pathname,
    query: currentUrl,
  }, { skipNull: true })
}

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export const removeKeysFromQuery = ({ params, keysToRemove }: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  })

  return qs.stringifyUrl({
    url: window.location.pathname,
    query: currentUrl,
  }, { skipNull: true })
}

interface BadgeParams {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }
}

export const assignBadges = (params: BadgeParams) => {

  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,  
  }

  const { criteria } = params;

  criteria.forEach((item) => {
    const {type, count} = item;
    const badgeLevels: any = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level: any) => {
      if(count >= badgeLevels[level]){
        badgeCounts[level as keyof BadgeCounts] +=1;
      }
    })
  });

  return badgeCounts;
}
