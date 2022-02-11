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

export const ManagerModel: Model<ManagerDocument> = model('manager', ManagerSchema);
