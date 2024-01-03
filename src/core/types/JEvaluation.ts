export interface JEvaluation {
    [courseCode: string]: {
        [key: string]: {
            avgEvaluation: number;
            evaluations: {
                year: number;
                semester: number;
                divCode: string;
                evaluation: number;
            }[];
        }
    };
}