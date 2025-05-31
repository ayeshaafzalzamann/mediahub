/*
  # Create favorites table and related tables

  1. New Tables
     - `favorites`
       - `id` (uuid, primary key)
       - `user_id` (uuid, foreign key to auth.users)
       - `book_id` (text, Google Books ID)
       - `book_data` (jsonb, storing book data)
       - `created_at` (timestamp)
       
  2. Security
     - Enable RLS on `favorites` table
     - Add policies for users to manage their own favorites
*/

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  book_id text NOT NULL,
  book_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, book_id)
);

-- Enable Row Level Security
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own favorites" 
  ON favorites 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" 
  ON favorites 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorites" 
  ON favorites 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
  ON favorites 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON favorites (user_id);
CREATE INDEX IF NOT EXISTS favorites_book_id_idx ON favorites (book_id);