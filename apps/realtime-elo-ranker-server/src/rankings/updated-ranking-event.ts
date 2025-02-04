export class UpdatedRankingEvent {
    id: string;
    rank: number;

    constructor(id: string, rank: number) {
        this.id = id;
        this.rank = rank;
    }
}

