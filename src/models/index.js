// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Rooms, Messages, Users } = initSchema(schema);

export {
  Rooms,
  Messages,
  Users
};