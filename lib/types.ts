import { CarListing as PrismaCarListing } from "@prisma/client";

export type CarListing = PrismaCarListing;

export interface IQuickMessage {
  text: string;
  description?: string;
}

export interface IChatInterfaceProps {
  onQueryResult?: (data: { userQuery: string; response: string }) => void;
}
