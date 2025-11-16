from supabase import create_client, Client
from typing import Optional, Dict
import os


class RecyclingDB:
    def __init__(self, supabase_url: str, supabase_key: str):
        """Initialize Supabase client."""
        self.client: Client = create_client(supabase_url, supabase_key)

    def update_user_points(self, user_id: str = 'a3c2e9d1-5fd8-4f3a-8c6e-0b7f2c4d9b22', points_to_add: int = 5):
        """Add points to user's total."""
        # Get current points
        user = self.client.table("trash_table").select("total_points").execute()

        if user.data:
            current_points = user.data[0].get("total_points", 0)
            new_total = current_points + points_to_add
        else:
            # Create new user if doesn't exist
            new_total = points_to_add
            self.client.table("users").insert({
                "user_id": user_id,
                "total_points": new_total,
            }).execute()
            return

        # Update points
        self.client.table("users").update({
            "total_points": new_total
        }).eq("user_id", user_id).execute()


# Convenience function for quick setup
def init_db(supabase_url: str = None, supabase_key: str = None) -> RecyclingDB:
    """Initialize database with credentials from environment or parameters."""
    url = supabase_url or os.getenv("SUPABASE_URL")
    key = supabase_key or os.getenv("SUPABASE_KEY")

    if not url or not key:
        raise ValueError("Supabase credentials not provided")

    return RecyclingDB(url, key)
