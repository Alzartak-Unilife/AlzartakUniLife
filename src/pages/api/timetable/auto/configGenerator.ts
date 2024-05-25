import MongoDbProvider from '@/core/modules/database/MongoDbProvider';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const db = await MongoDbProvider.connectDb(process.env.ALZARTAK_MONGODB_URI).then(() => MongoDbProvider.getDb());
    const session = await getServerSession(request, response, authOptions);

    switch (request.method) {
        case "GET": {
            if (session === null) {
                response.status(500).json({ data: null, message: "FAIL" });
            } else {
                try {
                    const result = await db.collection("timetable_generator_config").findOne(
                        { owner: session.user?.email },
                        { projection: { _id: 0, owner: 0 } }
                    );
                    response.status(200).json({ data: result, message: "SUCCESS" });

                } catch (error) {
                    response.status(500).json({ data: null, message: "FAIL" });
                }
            }
            break;
        }
        case "POST": {
            if (session === null) {
                response.status(500).json({ message: "FAIL" });
            } else {
                try {
                    const count = await db.collection("timetable_generator_config").countDocuments({ owner: session.user?.email });
                    if (count === 0) {
                        await db.collection("timetable_generator_config").insertOne({ owner: session.user?.email, ...request.body });
                    }
                    response.status(200).json({ message: "SUCCESS" });
                } catch (error) {
                    response.status(500).json({ message: "FAIL" });
                }
            }
            break;
        }
        case "PATCH": {
            if (session === null) {
                response.status(500).json({ message: "FAIL" });
            } else {
                try {
                    await db.collection("timetable_generator_config").updateOne(
                        { owner: session.user?.email },
                        { $set: { owner: session.user?.email, ...request.body } },
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