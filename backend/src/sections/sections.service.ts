import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateSectionDto from 'src/sections/dto/create-section.dto';
import UpdateSectionDto from 'src/sections/dto/update-section.dto';
@Injectable()
export class SectionsService {
    constructor(private readonly prisma: PrismaService) {}

    async createSection(
        courseId: string,
        createSectionDto: CreateSectionDto,
        userId: string,
    ) {
        const course = await this.prisma.course.findUnique({
            where: {
                id: courseId,
            },
        });
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        if (course.instructorId !== userId) {
            throw new UnauthorizedException(
                'You are not the instructor of this course',
            );
        }
        const lastSection = await this.prisma.section.findFirst({
            where: {
                courseId,
            },
            orderBy: {
                order: 'desc',
            },
        });
        const order = lastSection ? lastSection.order + 1 : 0;
        return await this.prisma.section.create({
            data: {
                ...createSectionDto,
                order,
                course: {
                    connect: {
                        id: courseId,
                    },
                },
            },
        });
    }

    async findOne(sectionId: string, userId: string) {
        const section = await this.prisma.section.findUnique({
            where: {
                id: sectionId,
            },
            include: {
                course: {
                    select: {
                        instructorId: true,
                    },
                },
                lectures: { orderBy: { order: 'asc' } },
            },
        });

        if (!section) {
            throw new NotFoundException(
                `Section with ID ${sectionId} not found`,
            );
        }
        if (section.course.instructorId !== userId) {
            throw new UnauthorizedException(
                'You are not the instructor of this course',
            );
        }
        return section;
    }

    async updateSection(
        sectionId: string,
        updateSectionDto: UpdateSectionDto,
        userId: string,
    ) {
        const section = await this.prisma.section.findUnique({
            where: {
                id: sectionId,
            },
            include: {
                course: true,
            },
        });
        if (!section) {
            throw new NotFoundException(
                `Section with ID ${sectionId} not found`,
            );
        }
        if (section.course.instructorId !== userId) {
            throw new UnauthorizedException(
                'You are not the instructor of this course',
            );
        }
        return await this.prisma.section.update({
            where: {
                id: sectionId,
            },
            data: updateSectionDto,
        });
    }

    async deleteSection(sectionId: string, userId: string) {
        const section = await this.prisma.section.findUnique({
            where: {
                id: sectionId,
            },
            include: {
                course: {
                    select: {
                        instructorId: true,
                    },
                },
            },
        });
        if (!section) {
            throw new NotFoundException(
                `Section with ID ${sectionId} not found`,
            );
        }
        if (section.course.instructorId !== userId) {
            throw new UnauthorizedException(
                'You are not the instructor of this course',
            );
        }
        await this.prisma.section.delete({
            where: { id: sectionId },
        });
        return section;
    }
}
