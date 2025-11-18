import mongoose, { Schema, model, models } from 'mongoose';

const DocumentSchema = new Schema({
  filename: { type: String, required: true },
  fileType: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  totalChunks: { type: Number, default: 0 },
  metadata: {
    size: Number,
    pages: Number,
  },
});

export default models.Document || model('Document', DocumentSchema);
