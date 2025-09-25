-- Add 'rejected' status to contract_request status enum
-- Migration: Add rejected status to contract requests

-- Note: Since we're using text fields instead of enums in PostgreSQL,
-- no schema changes are needed. The application will handle the new 'rejected' status.
-- This migration serves as documentation of the change.

-- The status field already allows text values, so 'rejected' can be used immediately.
-- Valid statuses are now: 'pending', 'ongoing', 'completed', 'rejected'
