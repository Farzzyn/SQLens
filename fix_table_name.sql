-- Run this in your Supabase SQL Editor to rename the table properly

-- First, rename the table to a valid name (lowercase, no spaces)
ALTER TABLE "SQl SandBox" RENAME TO sql_sandbox;

-- Verify the rename worked
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
