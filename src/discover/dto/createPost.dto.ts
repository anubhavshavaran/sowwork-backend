export class CreatePostDto {
  caption: string;
  image: {
    url: string;
  };
  postOnPortfolio: boolean;
  postOnFeed: boolean;
}
