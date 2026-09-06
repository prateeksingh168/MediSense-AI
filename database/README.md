# MediSense AI Database

PostgreSQL database implementation for MediSense AI.

> The included records are synthetic demo data only. AI output is decision support, not a confirmed diagnosis or medical advice.

## Contents

- `migrations/001_initial_schema.sql` — core tables, relationships, indexes, and constraints
- `migrations/002_add_assessment_demographics.sql` — assessment age/sex snapshot fields
- `seed/` — supplied synthetic CSV dataset
- `scripts/seed_demo_data.sql` — imports the 1,500 demo records
- `scripts/verify_database.sql` — verifies row counts and foreign-key relationships

## Database setup

Create the database in pgAdmin:

```sql
CREATE DATABASE medisense_ai;