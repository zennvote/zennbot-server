import {
  model, Schema, Model, Document,
} from 'mongoose';

interface Flag extends Document {
  key: string,
  value: boolean,
}

const FlagSchema: Schema = new Schema({
  key: { type: String, required: true },
  value: { type: Boolean, required: true },
});

const FlagModel: Model<Flag> = model('flag', FlagSchema);

export const getFlags = async (): Promise<Flag[]> => {
  const flags = await FlagModel.find();

  return flags;
};

export const getFlag = async (key: string): Promise<boolean | null> => {
  const flag = await FlagModel.findOne({ key });

  if (flag === null) {
    return null;
  }

  return flag.value;
};

export const setFlag = async (key: string, value: boolean): Promise<number> => {
  const result = await FlagModel.updateOne({ key }, { value });

  return result.ok;
};
