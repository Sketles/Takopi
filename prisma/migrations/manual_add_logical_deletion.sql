-- Migration: Add logical deletion and purchase snapshot
-- This migration adds support for logical deletion of content and purchase snapshots

-- Step 1: Add new columns to Content table
ALTER TABLE "contents" ADD COLUMN IF NOT EXISTS "isListed" BOOLEAN DEFAULT true;
ALTER TABLE "contents" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP;

-- Step 2: Create index on isListed for efficient queries
CREATE INDEX IF NOT EXISTS "contents_isListed_idx" ON "contents"("isListed");

-- Step 3: Modify Purchase table - make contentId nullable
ALTER TABLE "purchases" ALTER COLUMN "contentId" DROP NOT NULL;

-- Step 4: Add contentSnapshot column to Purchase table with default empty object
ALTER TABLE "purchases" ADD COLUMN IF NOT EXISTS "contentSnapshot" JSONB DEFAULT '{}'::jsonb;

-- Step 5: Update foreign key constraint to use SET NULL instead of CASCADE
ALTER TABLE "purchases" DROP CONSTRAINT IF EXISTS "purchases_contentId_fkey";
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_contentId_fkey" 
  FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Step 6: Set isListed to true for all existing content
UPDATE "contents" SET "isListed" = true WHERE "isListed" IS NULL;

-- Step 7: Make isListed NOT NULL after setting default values
ALTER TABLE "contents" ALTER COLUMN "isListed" SET NOT NULL;

-- Migration completed successfully
