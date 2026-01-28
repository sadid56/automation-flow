import { Schema, model, Document } from 'mongoose';

export interface IAutomation extends Document {
  name: string;
  nodes: any;
  edges: any;
  createdAt: Date;
  updatedAt: Date;
}

const automationSchema = new Schema<IAutomation>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    nodes: {
      type: Array,
      default: [],
    },
    edges: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Automation = model<IAutomation>('Automation', automationSchema);
