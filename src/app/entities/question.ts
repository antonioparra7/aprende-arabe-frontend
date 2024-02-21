export class Question {
    id: number;
    question: string;
    responseA: string;
    responseB: string;
    responseC: string;
    responseD: string;
    responseCorrect: string;
    image: Uint8Array;
    createAt: Date;
}
