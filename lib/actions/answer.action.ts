"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams, GetAnswersParams } from "./shared.type";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";

export async function createAnswer(params: CreateAnswerParams){

   try {
    connectToDatabase();

    const { content, author, question, path } = params;
    const newAnswer = await Answer.create({ content, author, question });

    await Question.findByIdAndUpdate(question, {
        $push: { answers: newAnswer._id }
    });


    revalidatePath(path);
   } catch (error) {
        console.log(error);
        throw new Error;
   }
}

export async function getAnswers(params: GetAnswersParams){

    try {
        connectToDatabase();

        const { questionId } = params;

        const answers = await Answer.find({ questionId }).populate("author", "_id clerkId name picture").sort({createdAt: -1});

        return { answers };

    } catch (error) {
        console.log(error);
        throw new Error;
    }
}
