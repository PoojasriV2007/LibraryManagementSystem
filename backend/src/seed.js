// Sample books loaded into an empty library so the dashboard has something to show.
export const SAMPLE_BOOKS = [
  { title: 'Atomic Habits', author: 'James Clear', category: 'Self-Help', status: 'Issued', isbn: '9780735211292', issuedTo: 'Priya Sharma' },
  { title: 'The Alchemist', author: 'Paulo Coelho', category: 'Fiction', status: 'Available', isbn: '9780062315007' },
  { title: 'Clean Code', author: 'Robert C. Martin', category: 'Technology', status: 'Available', isbn: '9780132350884' },
  { title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', status: 'Issued', isbn: '9780062316097', issuedTo: 'Arjun Mehta' },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', status: 'Available', isbn: '9780061120084' },
  { title: 'The Pragmatic Programmer', author: 'David Thomas & Andrew Hunt', category: 'Technology', status: 'Issued', isbn: '9780135957059', issuedTo: 'Rahul Verma' },
  { title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science', status: 'Available', isbn: '9780553380163' },
  { title: 'Wings of Fire', author: 'A. P. J. Abdul Kalam', category: 'Biography', status: 'Available', isbn: '9788173711466' },
  { title: "Harry Potter and the Philosopher's Stone", author: 'J. K. Rowling', category: 'Fiction', status: 'Issued', isbn: '9780747532699', issuedTo: 'Sneha Iyer' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', category: 'Science', status: 'Available', isbn: '9780374533557' },
  { title: 'The Psychology of Money', author: 'Morgan Housel', category: 'Self-Help', status: 'Available', isbn: '9780857197689' },
  { title: '1984', author: 'George Orwell', category: 'Fiction', status: 'Available', isbn: '9780451524935' },
]

export async function seedIfEmpty(store) {
  if ((await store.books.count()) > 0) return
  await store.books.insertMany(SAMPLE_BOOKS)
  console.log(`📚 Library was empty – added ${SAMPLE_BOOKS.length} sample books.`)
}
