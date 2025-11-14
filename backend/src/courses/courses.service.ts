import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Course, Prisma } from '@prisma/client';
import { CreateCourseDto } from 'src/courses/dto/create-course.dto';
import { UpdateCourseDto } from 'src/courses/dto/update-course.dto';
import slug from 'slug';

@Injectable()
export class CoursesService {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        userId: string,
        createCourseDto: CreateCourseDto,
    ): Promise<Course> {
        const course = await this.prisma.course.create({
            data: {
                title: createCourseDto.title,
                slug: slug(createCourseDto.title),
                instructorId: userId,
                status: 'DRAFT',
            },
        });
        return course;
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.CourseWhereUniqueInput;
        where?: Prisma.CourseWhereInput;
        orderBy?: Prisma.CourseOrderByWithRelationInput;
    }): Promise<Course[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.course.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async findOne(id: string, include?: string[]): Promise<Course | null> {
        const includeObject = {};

        if (include) {
            include.forEach((item) => {
                includeObject[item] = true;
            });
        }

        const course = await this.prisma.course.findUnique({
            where: { id },
            include: include && include.length > 0 ? includeObject : undefined,
        });

        return course;
    }

    async update(
        id: string,
        userId: string,
        updateCourseDto: UpdateCourseDto,
    ): Promise<Course> {
        const course = await this.prisma.course.findUnique({
            where: { id },
        });

        if (!course) {
            throw new NotFoundException(`ID: ${id} 강의를 찾을 수 없습니다.`);
        }
        const { categoryIds, ...otherData } = updateCourseDto;
        const data: Prisma.CourseUpdateInput = {
            ...otherData,
        };
        if (categoryIds) {
            data.categories = {
                connect: categoryIds.map((id) => ({ id })),
            };
        }

        if (course.instructorId !== userId) {
            throw new UnauthorizedException(
                '강의의 소유자만 수정할 수 있습니다.',
            );
        }

        return this.prisma.course.update({
            where: { id },
            data,
        });
    }

    async delete(id: string, userId: string): Promise<Course> {
        const course = await this.prisma.course.findUnique({
            where: { id },
        });

        if (!course) {
            throw new NotFoundException(`ID: ${id} 강의를 찾을 수 없습니다.`);
        }

        if (course.instructorId !== userId) {
            throw new UnauthorizedException(
                '강의의 소유자만 삭제할 수 있습니다.',
            );
        }

        await this.prisma.course.delete({ where: { id } });

        return course;
    }
}
