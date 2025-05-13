"""Set last_accessed_at to updated_at for existing recipes

Revision ID: dfdd793e1a1c
Revises: 9ff5d478d5ee
Create Date: 2025-05-12 19:29:50.488691

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = 'dfdd793e1a1c'
down_revision = '9ff5d478d5ee'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("UPDATE recipe SET last_accessed_at = updated_at WHERE last_accessed_at IS NULL")

def downgrade():
    op.execute("UPDATE recipe SET last_accessed_at = NULL")
