"""add_deleted_at_to_user

Revision ID: c84d52a00d66
Revises: 0f7c4b24fe6a
Create Date: 2025-04-26 23:59:09.898672

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = 'c84d52a00d66'
down_revision = '0f7c4b24fe6a'
branch_labels = None
depends_on = None


def upgrade():
    # Add deleted_at column to user table
    op.add_column('user', sa.Column('deleted_at', sa.DateTime(), nullable=True))


def downgrade():
    # Remove deleted_at column from user table
    op.drop_column('user', 'deleted_at')
