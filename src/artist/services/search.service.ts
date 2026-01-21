import { OllamaEmbeddings } from "@langchain/ollama";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PostService } from "src/discover/services";
import { User } from "src/user/schemas";
import { UserService } from "src/user/user.service";
import { SearchDto } from "../dto";
import { ArtistService } from "./artist.service";
import { PostRequestFilterDto } from "src/common/dto";
import { UserRole, UserStatus } from "src/common/constants";

@Injectable()
export class SearchService {
    private readonly ollamaEmbeddings;

    constructor(
        private readonly userService: UserService,
        private readonly artistService: ArtistService,
        private readonly postService: PostService,
        @InjectModel(User.name) private userModel: Model<User>
    ) {
        this.ollamaEmbeddings = new OllamaEmbeddings({ model: 'nomic-embed-text:latest' });
    }

    async searchArtists(search: SearchDto): Promise<any[]> {
        const queryVector = await this.ollamaEmbeddings.embedQuery(search.query);

        const results = await this.userModel.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "embedding",
                    queryVector: queryVector,
                    numCandidates: 100,
                    limit: 10,
                    filter: {
                        $and: [
                            { userRole: UserRole.USER_ROLE_ARTIST },
                            { status: UserStatus.STATUS_ACTIVE },
                            { acceptWork: true }
                        ]
                    }
                }
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    description: 1,
                    userRole: 1,
                    address: 1,
                    perHourRate: 1,
                    rating: 1,
                    profileImage: 1,
                    score: { $meta: "vectorSearchScore" }
                }
            }
        ]);

        return results;
    }

    async getArtistProfile(artistId: string): Promise<any> {
        try {
            const artist = await this.userService.findUser({ _id: artistId }, ['-embedding', '-password', '-email', '-phoneNumber', '-status']);
            const deliverables = await this.artistService.getDeliverables(artistId);
            const faqs = await this.artistService.getFaqs(artistId);
            const posts = await this.postService.findArtistPortfolio(artistId);

            if (!artist) {
                throw new ForbiddenException('Artist not found');
            }
            return { artist, deliverables, faqs, posts };
        } catch (error) {
            throw new ForbiddenException('Error fetching artist profile');
        }
    }

    async getRandomArtists(filter: PostRequestFilterDto): Promise<any> {
        try {
            const artists = await this.userModel.aggregate([
                {
                    $match: {
                        userRole: UserRole.USER_ROLE_ARTIST,
                        acceptWork: true,
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                {
                    $unwind: {
                        path: '$category',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'specializations',
                        localField: 'specialization',
                        foreignField: '_id',
                        as: 'specialization'
                    }
                },
                {
                    $unwind: {
                        path: '$specialization',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $sample: { size: filter.limit }
                },
                {
                    $project: {
                        embedding: 0,
                        __v: 0,
                        loginCode: 0,
                        createdAt: 0,
                        updatedAt: 0,
                        isDeleted: 0,
                        deletedAt: 0
                    }
                }
            ]);

            return { artists };
        } catch (error) {
            throw new ForbiddenException('Error fetching artist profile');
        }
    }
}