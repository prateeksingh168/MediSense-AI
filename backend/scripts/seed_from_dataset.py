import sys
import argparse
from pathlib import Path

# Add project root to sys.path so app imports work
backend_root = Path(__file__).resolve().parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from app.database import engine, Base, SessionLocal
from app.services.seed_service import seed_dataset


def main():
    parser = argparse.ArgumentParser(description="Seed MediSense AI database from dataset CSVs.")
    parser.add_argument("--max-rows", type=int, default=None, help="Maximum number of patient rows to seed (default: all)")
    args = parser.parse_args()

    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Starting seed process...")
        counts = seed_dataset(db, max_rows=args.max_rows)
        print("Seeding completed successfully:")
        for k, v in counts.items():
            print(f"  - {k}: {v}")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
