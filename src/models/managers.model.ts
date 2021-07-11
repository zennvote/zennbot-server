import { model, Schema, Model, Document } from 'mongoose';

interface Manager extends Document {
  username: string;
}

const ManagerSchema: Schema = new Schema({
  username: { type: String, required: true },
});

const ManagerModel: Model<Manager> = model('manager', ManagerSchema);

export const getManagers = async () => {
  const managers = await ManagerModel.find();

  return managers;
};
