import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { OllamaEmbeddings } from '@langchain/ollama';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas';
import { Model } from 'mongoose';
import { AuthGuard } from 'src/guards';
import { SearchDto } from './dto';

@Controller('search')
export class SearchController {
    private readonly ollamaEmbeddings;

  constructor(
    private readonly artistService: ArtistService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {
    this.ollamaEmbeddings = new OllamaEmbeddings({ model: 'nomic-embed-text:latest' });
  }

  @Post('artists')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async search(@Body() search: SearchDto) {
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
}
