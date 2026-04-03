export interface BookDTO {
  id?: number;
  name: string;
  genre: string;
  ageGroup: "CHILD" | "TEEN" | "ADULT" | "OTHER";
  price: number;
  publicationDate: string;
  author: string;
  pages: number;
  characteristics: string;
  description: string;
  language:
    | "ENGLISH"
    | "SPANISH"
    | "FRENCH"
    | "GERMAN"
    | "JAPANESE"
    | "UKRAINIAN"
    | "OTHER";
}
