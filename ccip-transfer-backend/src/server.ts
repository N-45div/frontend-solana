import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Empty CCIP Transfer API route
app.post('/api/ccip-transfer', (req: Request, res: Response) => {
  // TODO: Implement CCIP transfer logic here
  res.status(200).json({ message: 'CCIP transfer endpoint not yet implemented' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});