import {
  model, Schema, Model, Document,
} from 'mongoose';

export class Manager {
  username!: string;
}

export interface ManagerDocument extends Document, Manager {}

const ManagerSchema: Schema = new Schema({
  username: { type: String, required: true },
});

const ManagerModel: Model<ManagerDocument> = model('manager', ManagerSchema);

export const getManagers = async (): Promise<Manager[]> => {
  const managers = await ManagerModel.find();

  return managers;
};
