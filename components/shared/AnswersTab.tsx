import { getUserAnswers } from '@/lib/actions/user.action';
import React from 'react'
import AnswerCard from '../cards/AnswerCard';
import { SearchParamsProps } from '@/types';
import Pagination from './Pagination';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswersTab = async ({ searchParams, userId, clerkId }: Props) => {

  const result = await getUserAnswers({ userId, page: searchParams.page ? +searchParams.page : 1, });

  return (
    <>
      {result.answers.map((answer) => (
        <AnswerCard
          key={answer._id}
          _id={answer._id}
          clerkId={clerkId}
          author={answer.author}
          upvotes={answer.upvotes}
          question={answer.question}
          createdAt={answer.createdAt}
        />
      ))}
      <div className='mt-10'>
        <Pagination pageNumber={searchParams?.page ? +searchParams.page : 1} isNext={result.isNextAnswers} />
      </div>
    </>
  )
}

export default AnswersTab