import { TimetableGenerator } from '@/core/systems/timetable-generator/TimetableGenerator';
import { IGeneratorConfig } from '@/core/types/IGeneratorConfig';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    switch (request.method) {
        case "POST": {
            const param = request.body as IGeneratorConfig;
            try {
                const timetableGen = new TimetableGenerator(param);
                const genTimetables = timetableGen.getCourseCombination(0, 500).map((courses) => courses.map((course) => course.toObject()));
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