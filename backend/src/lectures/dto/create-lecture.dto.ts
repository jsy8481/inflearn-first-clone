import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateLectureDto {
    @ApiProperty({
        description: '강의 제목',
    })
    @IsNotEmpty()
    @IsString()
    title: string;
}
