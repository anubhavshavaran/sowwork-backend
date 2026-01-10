import { OllamaEmbeddings } from "@langchain/ollama";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PostService } from "src/discover/services";
import { User } from "src/user/schemas";
import { UserService } from "src/user/user.service";
import { SearchDto } from "../dto";
import { ArtistService } from "./artist.service";

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
                "$vectorSearch": {
                    "index": "default",
                    "path": "embedding",
                    "queryVector": queryVector,
                    "numCandidates": 100,
                    "limit": 10
                }
            },
            {
                "$project": {
                    "firstName": 1,
                    "lastName": 1,
                    "description": 1,
                    "userRole": 1,
                    "score": { "$meta": "vectorSearchScore" }
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
}