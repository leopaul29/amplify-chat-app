import { ModelInit, MutableModel } from "@aws-amplify/datastore";

type RoomsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MessagesMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UsersMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Rooms {
  readonly id: string;
  readonly roomname?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Rooms, RoomsMetaData>);
  static copyOf(source: Rooms, mutator: (draft: MutableModel<Rooms, RoomsMetaData>) => MutableModel<Rooms, RoomsMetaData> | void): Rooms;
}

export declare class Messages {
  readonly id: string;
  readonly message?: string | null;
  readonly usersID: string;
  readonly Rooms?: Rooms | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly messagesRoomsId?: string | null;
  constructor(init: ModelInit<Messages, MessagesMetaData>);
  static copyOf(source: Messages, mutator: (draft: MutableModel<Messages, MessagesMetaData>) => MutableModel<Messages, MessagesMetaData> | void): Messages;
}

export declare class Users {
  readonly id: string;
  readonly usernam?: string | null;
  readonly Messages?: (Messages | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Users, UsersMetaData>);
  static copyOf(source: Users, mutator: (draft: MutableModel<Users, UsersMetaData>) => MutableModel<Users, UsersMetaData> | void): Users;
}