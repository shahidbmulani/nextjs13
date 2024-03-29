"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import { CreateQuestionParams, GetQuestionsParams } from "./shared.type";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
    try {
        connectToDatabase();

        const questions = await Question.find({}).populate({ path: 'tags', model: Tag }).populate({ path: 'author', model: User }).sort({ createdAt: -1 });

        return { questions }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createQuestion(params: CreateQuestionParams) {

    try {
        connectToDatabase();

        const { title, content, tags, author, path } = params;

        // create a new question

        const question = await Question.create({
            title,
            content,
            author
        });

        const tagDocumets = [];

        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${tag}$`, "i") } },
                { $setOnInsert: { name: tag }, $push: { question: question._id } },
                { upsert: true, new: true }
            );

            tagDocumets.push(existingTag._id);
        }

        await Question.findByIdAndUpdate(question._id, {
            $push: { tags: { $each: tagDocumets } }
        })

        revalidatePath(path);
    } catch (error) {
        // console.log(error);
        // throw error;
    }
}