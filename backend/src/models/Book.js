import mongoose from 'mongoose'
import { BOOK_CATEGORIES, BOOK_STATUSES } from '../utils/validate.js'

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    author: { type: String, required: true, trim: true, maxlength: 100 },
    category: { type: String, required: true, enum: BOOK_CATEGORIES },
    status: { type: String, required: true, enum: BOOK_STATUSES, default: 'Available' },
    isbn: { type: String, trim: true, default: '' },
    issuedTo: { type: String, trim: true, maxlength: 80, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

bookSchema.index({ title: 'text', author: 'text' })

bookSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    if (ret.createdBy) ret.createdBy = ret.createdBy.toString()
    delete ret._id
    delete ret.__v
    return ret
  },
})

export default mongoose.models.Book || mongoose.model('Book', bookSchema)
