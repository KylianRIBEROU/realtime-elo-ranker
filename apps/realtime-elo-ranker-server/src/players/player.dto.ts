import { Player } from '../db/models/player.model';

export class PlayerDto {
    id: string;
    rank: number;

    static fromEntity(player: Player): PlayerDto {
        const playerDto = new PlayerDto();
        playerDto.id = player.id;
        playerDto.rank = player.rank;
        return playerDto;
    }

    static fromValueSet(id: string, rank: number): PlayerDto{
        const playerDto = new PlayerDto();
        playerDto.id = id;
        playerDto.rank = rank;
        return playerDto;
    }
}