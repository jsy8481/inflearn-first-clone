import { PartialType } from '@nestjs/swagger';
import CreateLectureDto from 'src/lectures/dto/create-lecture.dto';
import {
    IsString,
    IsOptional,
    IsNumber,
    IsObject,
    IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateLectureDto extends PartialType(CreateLectureDto) {
    @ApiProperty({
        description: '강의 설명',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: '강의 순서',
        required: false,
    })
    @IsNumber()
    @IsOptional()
    order?: number;

    @ApiProperty({
        description: '강의 재생 시간',
        required: false,
    })
    @IsNumber()
    @IsOptional()
    duration?: number;

    @ApiProperty({
        description: '강의 비디오 저장 정보',
        required: false,
    })
    @IsObject()
    @IsOptional()
    videoStorageInfo?: Record<string, any>;

    @ApiProperty({
        description: '강의 미리보기 여부',
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    isPreview?: boolean;
}
