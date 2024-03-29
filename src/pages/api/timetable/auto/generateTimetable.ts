import { TimetableGenerator } from '@/core/systems/timetable-generator/TimetableGenerator';
import { GeneratorConfigObject } from '@/core/types/GeneratorConfig';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    switch (request.method) {
        case "POST": {
            const param = request.body as GeneratorConfigObject;
            try {
                const timetableGen = new TimetableGenerator(param);
                const genTimetables = (await timetableGen.getCourseCombination(0, 1000)).map((courses) => courses.map((course) => course.toObject()));
                response.status(200).json({ data: genTimetables, message: "SUCCESS" });
            } catch (error) {
                response.status(500).json({ data: [], message: "FAIL" });
            }
            break;
        }
        default: {
            response.status(400).json({ data: [], message: "FAIL" });
        }
    };
}