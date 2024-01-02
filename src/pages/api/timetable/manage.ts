import MongoDbProvider from '@/core/modules/database/MongoDbProvider';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { ObjectId } from 'mongodb';


export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const db = await MongoDbProvider.getDb(process.env.ALZARTAK_MONGODB_URI);
    const session = await getServerSession(request, response, authOptions);

    switch (request.method) {
        case "GET": {
            if (session === null) {
                response.status(500).json({ data: null, message: "FAIL" });
            } else {
                try {
                    const result = await db.collection("timetables").find({ owner: session.user?.email }).toArray();
                    response.status(200).json({
                        data: result.map((res) => ({
                            id: res._id.toString(),
                            name: res.name,
                            courses: res.courses
                        })),
                        message: "SUCCESS"
                    });
                } catch (error) {
                    response.status(500).json({ data: null, message: "FAIL" });
                }
            }
            break;
        }
        case "POST": {
            if (session === null) {
                response.status(500).json({ data: { id: "" }, message: "FAIL" });
            } else {
                try {
                    const result = await db.collection("timetables").insertOne({
                        owner: session.user?.email,
                        name: request.body.name,
                        courses: request.body.courses
                    });
                    response.status(200).json({ data: { id: result.insertedId.toString() }, message: "SUCCESS" });
                } catch (error) {
                    response.status(500).json({ data: { id: "" }, message: "FAIL" });
                }
            }
            break;
        }
        case "PATCH": {
            if (session === null) {
                response.status(500).json({ message: "FAIL" });
            } else {
                try {
                    await db.collection("timetables").updateOne(
                        { _id: new ObjectId(request.body.id), owner: session.user?.email },
                        {
                            $set: {
                                name: request.body.name,
                                courses: request.body.courses,
                            }
                        },
                        { upsert: true }
                    );
                    response.status(200).json({ message: "SUCCESS" });
                } catch (error) {
                    response.status(500).json({ message: "FAIL" });
                }
            }
            break;
        }
        default: {
            response.status(400).json({ message: "FAIL" });
        }
    };
}