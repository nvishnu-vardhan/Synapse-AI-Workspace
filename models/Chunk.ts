import mongoose, { Schema, model, models } from 'mongoose';

const ChunkSchema = new Schema({
  documentId: { type: Schema.Types.ObjectId, ref: 'Document', required: true },
  content: { type: String, required: true },
  embedding: { type: [Number], required: true },
  metadata: {
    chunkIndex: Number,
    pageNumber: Number,
  },
  createdAt: { type: Date, default: Date.now },
});

// Create vector search index
ChunkSchema.index({ embedding: '2dsphere' });

export default models.Chunk || model('Chunk', ChunkSchema);
